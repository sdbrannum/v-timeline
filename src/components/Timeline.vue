<script setup lang="ts">
import { ref, Ref, onMounted, onBeforeUnmount } from 'vue';


const truncateText = (ref: Ref<any>, width: number) => {
    console.log('');
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
            console.log('right')
        } else {
            console.log('left')
        }
        mouseDownPosition = mouseEvent.pageX;
    }
}

const scrollAreaRef: Ref<SVGRectElement | null> = ref(null);
const onScroll = (scrollEvent: Event) => {
    console.log('on scroll ', scrollEvent)
}

let last_known_scroll_position = 0;
let ticking = false;


interface Tick {
    x: Number;
}
const ticks: Ref<Tick[]> = ref([]);

const calculateXAxis = () => {
    if (scrollAreaRef.value) {
        setTimeout(() => { }, 1000)
        const bodyPos = document.body.getBoundingClientRect();
        const pos = scrollAreaRef.value.getBoundingClientRect();
        console.log(scrollAreaRef.value.scrollLeft);
        let w = pos.width;
        console.log(w, pos)
        let lastX = 150;
        let idx = 0;
        while (w > -300) {
            lastX = (pos.left - bodyPos.left) + (idx++ * 100)
            ticks.value.push({ x: lastX })
            w -= 150;
        }

        console.log(ticks.value)
    }
}

onMounted(() => {
    if (scrollAreaRef.value) {
        calculateXAxis();

        scrollAreaRef.value.addEventListener('wheel', onScroll);

    }
});

onBeforeUnmount(() => {
    if (scrollAreaRef.value) {
        scrollAreaRef.value.addEventListener('wheel', onScroll);
    }
});

</script>

<template>
    <div class="timeline-chart">
        <svg width="100%" height="100%">
            <g>
                <text y="95">Hello</text>
                <line x1="0" x2="100%" y1="100" y2="100" stroke="black" />
                <text y="195">Long text man longer</text>
                <line x1="0" x2="100%" y1="200" y2="200" stroke="black" />
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
            <line x1="150" x2="150" y1="0" y2="100%" stroke="black" stroke-width="2" />
            <g class="x-axis">
                <g
                    class="tick"
                    v-for="(tick, idx) in ticks"
                    :key="idx"
                    :style="{ transform: `translateX(${tick.x}px)` }"
                >
                    <line y1="0" y2="95%" stroke="black" />
                    <text>Date</text>
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
    box-sizing: border-box;
    height: 300px;
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
</style>