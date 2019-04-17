<template>
    <g class="x axis">
<!--        <path v-bind:d="lineData"/>-->
        <vertical-tick v-for="tick in ticks"
                       v-bind:x="tick.value"
                       v-bind:y="y"
                       v-bind:height="height"
                       v-bind:label="tick.label"/>
    </g>
</template>

<script>
  import * as d3 from 'd3';
  import VerticalTick from './verticalTick';

  export default {
    name: 'xAxes',
    components: { VerticalTick },
    props: ['y', 'width', 'height', 'xData'],
    computed: {
      lineData() {
        const lineGenerator = d3.line();
        const points = [
          [0, this.y],
          [this.width, this.y],
        ];
        const pathData = lineGenerator(points);
        return pathData;
      },
      ticks() {
        const extent = d3.extent(this.xData);
        const linearScale = d3.scaleLinear()
          .domain(extent)
          .range([0, this.width]);
        const toTick = function (tick) {
          return {
            value: linearScale(tick),
            label: tick,
          };
        };
        return linearScale.ticks().map(toTick);
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
