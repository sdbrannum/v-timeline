<script setup lang="ts">
import { ref, Ref, computed, ComputedRef, onMounted, onBeforeUnmount } from 'vue';


const truncateText = (ref: Ref<any>, width: number) => {
    console.log('');
}

const chartWidth = ref(0);
const chartRef: Ref<HTMLDivElement | null> = ref(null);

const scrollAreaRef: Ref<SVGRectElement | null> = ref(null);
const onScroll = (scrollEvent: Event) => {
    console.log('on scroll ', scrollEvent)
}

let last_known_scroll_position = 0;
let ticking = false;


interface Tick {
    x: Number;
    label: String;
}

enum LabelTypes { Month, Year, Day };
const startDate = ref(new Date());
const labelType = computed(() => LabelTypes.Year);

const labels = computed(() => {
    let yearOffset = -Math.ceil(ticks.value.length / 2);
    return new Array(ticks.value.length).fill(startDate.value).map(d => d.getFullYear() + yearOffset++);
});

const getTickSpacing = () => {
    const bodyPos = document.body.getBoundingClientRect();
    const pos = scrollAreaRef.value?.getBoundingClientRect() || { width: 0 };
    // 12 will change based on zoom level
    return pos.width / 12;
}

let xBasis = ref(150);
const ticks = computed(() => {
    const res = [];
    if (scrollAreaRef.value) {
        const bodyPos = document.body.getBoundingClientRect();
        const pos = scrollAreaRef.value.getBoundingClientRect();
        let w = pos.width;
        let lastX = 0;
        let idx = 0;
        const spacing = getTickSpacing();
        while (w > 0) {
            lastX = (pos.left - bodyPos.left) + (idx++ * spacing) - 2;
            res.push(lastX)
            w -= spacing;
        }
    }
    return res;
});

const xAxis: ComputedRef<Tick[]> = computed(() => {
    return ticks.value.map((x, idx) => ({ x, label: labels.value[idx] }));
});

const onBrowserResize = () => {
    chartWidth.value = chartRef.value?.getBoundingClientRect().width || 0;
    console.log(scrollAreaRef.value?.getBoundingClientRect().width);
}


const firstXPosition = ref(0);
let mouseDown = false;
let mouseDownPosition = 0;

const onMouseDown = (mouseEvent: MouseEvent) => { mouseDown = true; mouseDownPosition = mouseEvent.pageX; }
const onMouseUp = (mouseEvent: MouseEvent) => { mouseDown = false; }
const onMouseLeave = (mouseEvent: MouseEvent) => { mouseDown = false; }
const onMouseMove = (mouseEvent: MouseEvent) => {
    if (mouseDown) {
        if (mouseEvent.pageX >= mouseDownPosition) {
            window.requestAnimationFrame(() => xBasis.value += 1);
        } else {
            window.requestAnimationFrame(() => xBasis.value -= 1);
        }
        mouseDownPosition = mouseEvent.pageX;
    }
}

onMounted(() => {
    window.addEventListener('resize', onBrowserResize);
    onBrowserResize();
    generateTicks();
    if (scrollAreaRef.value) {
        scrollAreaRef.value.addEventListener('wheel', onScroll);
    }
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', onBrowserResize);
    if (scrollAreaRef.value) {
        scrollAreaRef.value.addEventListener('wheel', onScroll);
    }
});

</script>

<template>
    <div class="timeline-chart" ref="chartRef">
        <svg width="100%" height="100%">
            <g>
                <text y="95">Hello</text>
                <line x1="0" x2="100%" y1="100" y2="100" stroke="var(--stroke-color)" />
                <text y="195">Long text man longer</text>
                <line x1="0" x2="100%" y1="200" y2="200" stroke="var(--stroke-color)" />
            </g>

            <rect
                class="chart-bounds"
                x="150"
                y="0"
                fill="#529fca"
                @mousedown="onMouseDown"
                @mouseup="onMouseUp"
                @mouseleave="onMouseLeave"
                @mousemove="onMouseMove"
                ref="scrollAreaRef"
            />
            <line x1="150" x2="150" y1="0" y2="100%" stroke="var(--stroke-color)" stroke-width="2" />
            <g class="x-axis">
                <g
                    class="tick"
                    v-for="(tick, idx) in xAxis"
                    :key="idx"
                    :style="{ transform: `translateX(${tick.x}px)` }"
                >
                    <line y1="-1.5em" y2="-300" stroke="var(--stroke-color)" />
                    <text class="tick--label" y="-0.25em">{{ tick.label }}</text>
                </g>
            </g>
            <g>
                <!--  draggable area -->
            </g>
        </svg>
    </div>
</template> 

<style scoped>
.timeline-chart {
    --stroke-color: #0f172a;
    --chart-height: 300px;
    box-sizing: border-box;
    height: var(--chart-height);
    width: 100%;
    border-radius: 3px;
    border: 2px solid black;
}

.timeline-chart * {
    box-sizing: border-box;
}

.chart-bounds {
    box-sizing: border-box;
    height: 100%;
    width: calc(100% - 150px);
}

.x-axis {
    transform: translate(0, 100%);
}

.tick--label {
    text-anchor: middle;
}
</style>