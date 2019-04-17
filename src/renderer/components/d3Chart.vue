<template>
    <svg v-bind:width="width" v-bind:height="height">
        <path v-bind:d="svgData" />
        <x-axes v-bind:y="centerPointY"
                v-bind:width="width"
                v-bind:height="height"
                v-bind:xData="xRange"/>
        <y-axes v-bind:x="centerPointX"
                v-bind:width="width"
                v-bind:height="height"
                v-bind:yData="yRange"/>
    </svg>
</template>

<script>
  import * as d3 from 'd3';
  import XAxes from './chart/xAxes';
  import YAxes from './chart/yAxes';

  export default {
    name: 'd3Chart',
    props: {
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      dataPoints: {
        type: Object,
        required: true,
      },
      xRange: {
        type: Array,
        default() {
          const xData = this.dataPoints.map(point => point.x);
          const extent = d3.extent(xData);
          return extent;
        },
      },
      yRange: {
        type: Array,
        default() {
          const yData = this.dataPoints.map(point => point.y);
          const extent = d3.extent(yData);
          return extent;
        },
      },
      centerPointX: {
        type: Number,
        default() {
          return 10;
        },
      },
      centerPointY: {
        type: Number,
        default() {
          return this.height;
        },
      },
    },
    components: { YAxes, XAxes },
    computed: {
      svgData() {
        const lineGenerator = d3.line();
        const xScale = d3.scaleLinear()
          .domain(this.xRange)
          .range([0, this.width]);
        const yScale = d3.scaleLinear()
          .domain(this.yRange)
          .range([0, this.height]);
        const points = this.dataPoints.map(point => [xScale(point.x), this.height - yScale(point.y)]);
        const pathData = lineGenerator(points);
        return pathData;
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
