<template>
    <svg id="svg"
         v-bind:width="width"
         v-bind:height="height"
         v-on:click="mouseClick">
        <x-axes v-bind:xData="xRange"
                v-bind:plotArea="plotArea"
                />
        <y-axes v-bind:yData="yRange"
                v-bind:plotArea="plotArea"/>
        <path v-bind:d="pathData" />
        <circle v-for="(point, index) in points" :key="index"
                v-bind:cx="point[0]"
                v-bind:cy="point[1]"
                class="vertex"/>

        <circle
                v-bind:cx="eqX"
                v-bind:cy="eqY"
                class="eq"/>
        <circle
                v-bind:cx="mouseX"
                v-bind:cy="mouseY"
                class="vertex"/>
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
        type: Array,
        required: true,
      },
      equilibrium: {
        type: Array,
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
          return 0;
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
    data() {
      return {
        mouseX: 0,
        mouseY: 0,
        plotArea: {
          x: 20,
          y: 20,
          height: this.height - 20,
          width: this.width - 20,
        },
      };
    },
    computed: {
      points() {
        return this.dataPoints
          .map(point => [this.xScale(point.x), this.yScale(point.y)]);
      },
      pathData() {
        const lineGenerator = d3.line();
        const pathData = lineGenerator(this.points);
        return pathData;
      },
      eqX() {
        return this.xScale(this.equilibrium[0].x);
      },
      eqY() {
        return this.yScale(this.equilibrium[0].y);
      },
    },
    methods: {
      xScale(x) {
        return d3.scaleLinear()
          .domain(this.xRange)
          .range([this.plotArea.x, this.plotArea.width])(x);
      },
      yScale(y) {
        return d3.scaleLinear()
          .domain(this.yRange)
          .range([this.plotArea.height, this.plotArea.y])(y);
      },
      mouseClick(e) {
        const svg = document.getElementById('svg');
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const res = pt.matrixTransform(svg.getScreenCTM().inverse());
        this.mouseX = res.x;
        this.mouseY = res.y;
      },
    },
  };
</script>

<style scoped>
    path {
        fill: none;
        stroke: #232323;
    }
    .vertex {
        r: 3;
        fill: #f3524f;
        stroke: #f3524f;
    }
    .eq {
        r: 3;
        fill: #5bf316;
        stroke: #262424;
    }
</style>
