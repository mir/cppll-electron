<template>
    <g class="tick">
        <path v-bind:d="lineData"/>
        <text v-bind:x="x" v-bind:y="y+15" text-anchor="middle">{{ label }}</text>
    </g>
</template>

<script>
  import * as d3 from 'd3';

  export default {
    name: 'verticalTick',
    props: ['x', 'y', 'height', 'label'],
    data() {
      return {
        bottomOffset: 20,
      };
    },
    computed: {
      lineData() {
        const lineGenerator = d3.line();
        const points = [
          [this.x, this.y],
          [this.x, this.y - this.height],
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
