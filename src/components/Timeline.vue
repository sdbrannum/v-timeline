<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
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


const scrollAreaRef = ref(null);
const onScroll = (scrollEvent: Event) => {
    console.log('on scroll ', scrollEvent)
}

let last_known_scroll_position = 0;
let ticking = false;

onMounted(() => {
    if (scrollAreaRef.value) {
        console.log('adding scroll event');
        (scrollAreaRef.value as SVGRectElement).addEventListener('wheel', onScroll)
    }
});

onBeforeUnmount(() => {
    if (scrollAreaRef.value) {
        (scrollAreaRef.value as SVGRectElement).addEventListener('wheel', onScroll)
    }
});

</script>

<template>
    <div class="timeline-chart">
        <svg width="100%" height="100%">
            <g>
                <text>Hello</text>
                <line x1="0" x2="100%" y1="100" y2="100" stroke="black" />
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
            <g class="x-axis">
                <g class="tick">
                    <line x1="100" x2="100" y1="0" y2="95%" />
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
    height: 300px;
    width: 100%;
    border-radius: 3px;
    border: 2px solid black;
}

.chart-bounds {
    height: 100%;
    width: calc(100% - 150px);
}
</style>