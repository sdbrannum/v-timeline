<script setup lang="ts">

</script>

<template>
    <div class="timeline-chart" ref="chartRef">
        <svg width="100%" height="100%">
            <g>
                <text y="56" x="70">Checklists</text>
                <text y="106" x="100">Alerts</text>
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
                <line
                    x1="150"
                    x2="100%"
                    y1="50"
                    y2="50"
                    stroke="var(--stroke-color)"
                    stroke-width="1"
                />

                <line
                    x1="150"
                    x2="100%"
                    y1="100"
                    y2="100"
                    stroke="var(--stroke-color)"
                    stroke-width="1"
                />
            </g>
            <g>
                <circle
                    cx="250"
                    cy="50"
                    r="10"
                    stroke="var(--stroke-color)"
                    stroke-width="1"
                    fill="white"
                />
                <circle
                    cx="250"
                    cy="100"
                    r="10"
                    stroke="var(--stroke-color)"
                    stroke-width="1"
                    fill="white"
                />

                <circle
                    cx="300"
                    cy="100"
                    r="10"
                    stroke="var(--stroke-color)"
                    stroke-width="1"
                    fill="white"
                />

                <circle
                    cx="400"
                    cy="100"
                    r="10"
                    stroke="var(--stroke-color)"
                    stroke-width="1"
                    fill="white"
                />
            </g>
        </svg>
    </div>
</template>



<style scoped>
.timeline-chart {
    --stroke-color: #0f172a;
    --chart-height: 150px;
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