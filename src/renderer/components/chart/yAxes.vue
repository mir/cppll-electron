<template>
    <g class="y axis">
<!--        <path v-bind:d="lineData"/>-->
        <horizontal-tick v-for="tick in ticks"
                       v-bind:y="tick.value"
                       v-bind:x="x"
                       v-bind:width="width"
                       v-bind:label="tick.label"/>
    </g>
</template>

<script>
  import * as d3 from 'd3';
  import HorizontalTick from './horizontalTick';

  export default {
    name: 'yAxes',
    components: { HorizontalTick },
    props: ['x', 'width', 'height', 'yData'],
    computed: {
      lineData() {
        const lineGenerator = d3.line();
        const points = [
          [this.x, 0],
          [this.x, this.height],
        ];
        const pathData = lineGenerator(points);
        return pathData;
      },
      ticks() {
        const extent = d3.extent(this.yData);
        const linearScale = d3.scaleLinear()
          .domain(extent)
          .range([this.height, 0]);
        const toTick = function (tick) {
          return {
            value: linearScale(tick),
            label: tick,
          };
        };
        return linearScale.ticks(5).map(toTick);
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
