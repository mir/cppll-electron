<template>
    <g class="tick">
        <path v-bind:d="lineData"/>
        <text v-bind:x="x" v-bind:y="y" dx="-6" dy="-2">{{ label }}</text>
    </g>
</template>

<script>
  import * as d3 from 'd3';

  export default {
    name: 'verticalTick',
    props: ['x', 'y', 'height', 'label'],
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
    },
  };
</script>

<style scoped>
    path {
        fill: none;
        stroke: #b5b5b5;
    }
</style>
