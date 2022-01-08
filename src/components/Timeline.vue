<script setup lang="ts">
import { ref, Ref, computed, ComputedRef, onMounted, onBeforeUnmount } from 'vue';


const truncateText = (ref: Ref<any>, width: number) => {
    console.log('');
}

const chartWidth = ref(0);
const chartRef: Ref<HTMLDivElement | null> = ref(null);

const scrollAreaRef: Ref<SVGRectElement | null> = ref(null);
const onScroll = (scrollEvent: WheelEvent) => {
    const normalizeBasis = () => {
        if (xTickSpacing.value > X_SPACING_MAX) {
            xTickSpacing.value = X_SPACING_MIN;
            // TODO: change labelType
        } else if (xTickSpacing.value < X_SPACING_MIN) {
            xTickSpacing.value = X_SPACING_MAX;
            // TODO: change labelType
        }
    }
    if (scrollEvent.deltaY > 0) {
        window.requestAnimationFrame(() => xTickSpacing.value -= 1);
    } else {
        window.requestAnimationFrame(() => xTickSpacing.value += 1);
    }
    normalizeBasis();
}

interface Tick {
    x: number;
    label: string;
}

let xTickSpacing = ref(150);
const X_SPACING_MIN = 100, X_SPACING_MAX = 200;

const tickCount = computed(() => {
    const bodyPos = document.body.getBoundingClientRect();
    const pos = scrollAreaRef.value?.getBoundingClientRect() || { width: 0 };
    return Math.floor((pos.width + xTickSpacing.value) / xTickSpacing.value);
});

enum LabelTypes { Month, Year, Week, Day };
const labelType = computed(() => LabelTypes.Year);
const startDate = ref(new Date());

const adjustStartDate = (val: number) => {
    const newDate = new Date(startDate.value);
    newDate.setFullYear(newDate.getFullYear() + val);
    startDate.value = newDate;
}

const translateStart = ref(0);
const xAxis: ComputedRef<Tick[]> = computed(() => {

    // let yearOffset = -Math.floor(tickCount.value / 2);
    const d = new Array(tickCount.value).fill(startDate.value).map((d, idx) => ({
        x: xTickSpacing.value * (idx + 1) + translateStart.value,
        label: d.getFullYear() + idx + '',
    }));

    return d;
});

const onBrowserResize = () => {
    chartWidth.value = chartRef.value?.getBoundingClientRect().width || 0;
    console.log(scrollAreaRef.value?.getBoundingClientRect().width);
}


let mouseDown = false;
let mouseDownPosition = 0;

const onMouseDown = (mouseEvent: MouseEvent) => {
    mouseEvent.preventDefault();
    mouseDown = true;
    mouseDownPosition = mouseEvent.pageX;
}
const onMouseUp = (mouseEvent: MouseEvent) => { mouseDown = false; }
// const onMouseLeave = (mouseEvent: MouseEvent) => { 
//     mouseDown = false; 
// }

const onMouseMove = (mouseEvent: MouseEvent) => {
    mouseEvent.preventDefault();
    console.log('mouseDown', mouseDown);
    if (mouseDown) {
        window.requestAnimationFrame(() => {
            translateStart.value -= mouseDownPosition - mouseEvent.pageX;
            mouseDownPosition = mouseEvent.pageX;

            if (translateStart.value > xTickSpacing.value) {
                translateStart.value = 0;
                adjustStartDate(-1);
            } else if (translateStart.value < 0) {
                translateStart.value = 150;
                adjustStartDate(1);
            }
        });
    }
}

const onDrag = () => {
    console.log('dragging')
}

onMounted(() => {
    window.addEventListener('resize', onBrowserResize);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    onBrowserResize();
    if (scrollAreaRef.value) {
        scrollAreaRef.value.addEventListener('wheel', onScroll);
    }
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', onBrowserResize);
    window.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mouseup', onMouseUp);
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
                @mousemove="onMouseMove"
                @drag="onDrag"
                ref="scrollAreaRef"
            />
            <line x1="150" x2="150" y1="0" y2="100%" stroke="var(--stroke-color)" stroke-width="2" />
            <g class="x-axis">
                <g
                    class="tick"
                    v-for="(tick, idx) in xAxis"
                    :key="tick.label"
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

.tick {
    will-change: transform;
    transition: linear;
}
.tick--label {
    text-anchor: middle;
}
</style>