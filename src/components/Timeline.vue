<script setup lang="ts">
import { ref, Ref, computed, ComputedRef, onMounted, onBeforeUnmount } from 'vue';


const truncateText = (ref: Ref<any>, width: number) => {
    console.log('');
}
const X_TRANSLATE_MIN = 150;
const chartWidth = ref(0);
const chartRef: Ref<HTMLDivElement | null> = ref(null);

const scrollAreaRef: Ref<SVGRectElement | null> = ref(null);
const onScroll = (scrollEvent: WheelEvent) => {
    const check = () => {
        const x = getX(0);
        if (x < 150) {
            // adjustStartDate(1);
            translateStart.value += xTickSpacing.value;
            normalizeTranslateStart();
        } else if (x > X_TRANSLATE_MIN + xTickSpacing.value) {
            console.log('hit')
            // adjustStartDate(-1);
            translateStart.value -= xTickSpacing.value;
            normalizeTranslateStart();
        }
        console.log('x', x)
    }


    if (scrollEvent.deltaY > 0) {
        window.requestAnimationFrame(() => {
            xTickSpacing.value -= 1;
            check();
        });
    } else {
        window.requestAnimationFrame(() => {
            xTickSpacing.value += 1
            check();
        });
    }


    // normalizeBasis();
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

const translateStart = ref(X_TRANSLATE_MIN);
const getX = (idx: number) => {
    return translateStart.value + xTickSpacing.value * idx;
};

const xAxis: ComputedRef<Tick[]> = computed(() => {
    // let yearOffset = -Math.floor(tickCount.value / 2);
    const d = new Array(tickCount.value).fill(startDate.value).map((d, idx) => ({
        x: getX(idx),
        label: d.getFullYear() + idx + '',
    }));

    return d;
});

const onBrowserResize = () => {
    chartWidth.value = chartRef.value?.getBoundingClientRect().width || 0;
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

const normalizeTranslateStart = () => {
    if (translateStart.value > (X_TRANSLATE_MIN + xTickSpacing.value)) {
        adjustStartDate(-1);
        translateStart.value = X_TRANSLATE_MIN;

    } else if (translateStart.value < X_TRANSLATE_MIN) {
        adjustStartDate(1);
        translateStart.value = X_TRANSLATE_MIN + xTickSpacing.value;

    }
}

const onMouseMove = (mouseEvent: MouseEvent) => {
    mouseEvent.preventDefault();
    if (mouseDown) {
        window.requestAnimationFrame(() => {
            const moveX = mouseDownPosition - mouseEvent.pageX;
            translateStart.value -= moveX;
            mouseDownPosition = mouseEvent.pageX;

            normalizeTranslateStart();
        });
    }
}

const getTranslate = () => translateStart.value;
const getTickSpacing = () => xTickSpacing.value;

onMounted(() => {
    window.getX = getX;
    window.getTranslate = getTranslate;
    window.getTickSpacing = getTickSpacing;
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