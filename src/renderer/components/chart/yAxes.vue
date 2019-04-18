<template>
    <g class="y axis">
        <horizontal-tick v-for="tick in ticks" :key="tick.value"
                       v-bind:y="tick.value"
                       v-bind:x="plotArea.x"
                       v-bind:width="plotArea.width"
                       v-bind:label="tick.label"
        />
    </g>
</template>

<script>
  import * as d3 from 'd3';
  import HorizontalTick from './horizontalTick';

  export default {
    name: 'yAxes',
    components: { HorizontalTick },
    props: ['yData', 'plotArea'],
    computed: {
      ticks() {
        const extent = d3.extent(this.yData);
        const linearScale = d3.scaleLinear()
          .domain(extent)
          .range([this.plotArea.height, this.plotArea.y]);
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
