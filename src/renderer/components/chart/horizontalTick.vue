<template>
    <g class="tick">
        <path v-bind:d="lineData"/>
        <text v-bind:x="x" v-bind:y="y" dy="5">{{ label }}</text>
    </g>
</template>

<script>
  import * as d3 from 'd3';

  export default {
    name: 'horizontalTick',
    props: ['x', 'y', 'width', 'label'],
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
    },
  };
</script>

<style scoped>
    path {
        fill: none;
        stroke: #b5b5b5;
    }
</style>
