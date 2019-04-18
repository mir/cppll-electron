<template>
    <g class="x axis">
        <vertical-tick v-for="tick in ticks" :key="tick.value"
                       v-bind:x="tick.value"
                       v-bind:y="plotArea.height"
                       v-bind:height="plotArea.height - plotArea.y"
                       v-bind:label="tick.label"/>
    </g>
</template>

<script>
  import * as d3 from 'd3';
  import VerticalTick from './verticalTick';

  export default {
    name: 'xAxes',
    components: { VerticalTick },
    props: ['xData', 'plotArea'],
    computed: {
      ticks() {
        const extent = d3.extent(this.xData);
        const linearScale = d3.scaleLinear()
          .domain(extent)
          .range([this.plotArea.x, this.plotArea.width]);
        const toTick = function toTick(tick) {
          return {
            value: linearScale(tick),
            label: tick,
          };
        };
        return linearScale.ticks(5)
          .map(toTick);
      },
    },
  };
</script>

<style scoped>
    path {
        fill: none;
        stroke: #999;
    }
</style>
