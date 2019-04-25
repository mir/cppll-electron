<template>
    <svg id="svg"
         v-bind:width="width"
         v-bind:height="height"
         v-on:click="mouseClick">

        <path v-bind:d="grayAreaPathData" class="overload-path"/>

        <x-axes v-bind:xData="xRange"
                v-bind:plotArea="plotArea"
                />
        <y-axes v-bind:yData="yRange"
                v-bind:plotArea="plotArea"/>

        <g class="sectors">
            <path v-bind:d="sectorLine1PathData" />
            <path v-bind:d="sectorLine2PathData" />
            <path v-bind:d="sectorLine3PathData" />
        </g>

        <g class="secondary">
            <path v-bind:d="secondaryPathData" class="path-grey"/>
            <circle v-for="(point, index) in secondaryPoints" :key="index"
                    v-bind:cx="point[0]"
                    v-bind:cy="point[1]"
                    class="vertex-grey"/>
        </g>

        <path v-bind:d="pathData" />

        <g class="data-circles">
        <circle v-for="(point, index) in points" :key="index"
                v-bind:cx="point[0]"
                v-bind:cy="point[1]"
                class="vertex"/>
        </g>

        <circle
                v-bind:cx="eqX"
                v-bind:cy="eqY"
                class="eq"/>

        <path v-bind:d="framePathData" stroke-width="2"/>
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
      secondaryData: {
        type: Array,
        default() {
          return [{ x: 0, y: 0 }];
        },
      },
      sectorLine1Data: {
        type: Array,
        default() {
          return [{ x: 0, y: 0 }];
        },
      },
      sectorLine2Data: {
        type: Array,
        default() {
          return [{ x: 0, y: 0 }];
        },
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
      suggestData: {
        type: Function,
      },
      vOverload: {
        type: Function,
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
      framePathData() {
        const dataPoints = [{ x: this.xRange[0], y: this.yRange[0] },
          { x: this.xRange[0], y: this.yRange[1] },
          { x: this.xRange[1], y: this.yRange[1] },
          { x: this.xRange[1], y: this.yRange[0] },
          { x: this.xRange[0], y: this.yRange[0] },
        ];
        return this.getPathData(dataPoints);
      },
      points() {
        return this.dataPoints
          .map(point => [this.xScale(point.x), this.yScale(point.y)]);
      },
      secondaryPoints() {
        return this.secondaryData
          .map(point => [this.xScale(point.x), this.yScale(point.y)]);
      },
      pathData() {
        return this.getPathData(this.dataPoints);
      },
      secondaryPathData() {
        return this.getPathData(this.secondaryData);
      },
      grayAreaPathData() {
        const path = [[this.plotArea.x, this.plotArea.height]];
        let tau = this.xRange[0];
        const precision = (this.xRange[1] - this.xRange[0]) / 100;
        while (tau < this.xRange[1]) {
          const y = this.yScale(this.vOverload(tau));
          path.push([this.xScale(tau), y]);
          tau += precision;
        }
        const y = this.yScale(this.vOverload(this.xRange[1]));
        path.push([this.xScale(tau), y]);
        path.push([this.plotArea.width, this.plotArea.height]);
        const lineGenerator = d3.line();
        const pathData = lineGenerator(path);
        return pathData;
      },
      sectorLine1PathData() {
        return this.getPathData(this.sectorLine1Data);
      },
      sectorLine2PathData() {
        return this.getPathData([{ x: 0, y: this.yRange[0] },
          { x: 0, y: this.yRange[1] }]);
      },
      sectorLine3PathData() {
        return this.getPathData(this.sectorLine2Data);
      },
      eqX() {
        return this.xScale(this.equilibrium[0].x);
      },
      eqY() {
        return this.yScale(this.equilibrium[0].y);
      },
    },
    methods: {
      getPathData(arrayOfXY) {
        const convertedPoints = arrayOfXY.map(point => [this.xScale(point.x), this.yScale(point.y)]);
        const lineGenerator = d3.line();
        const pathData = lineGenerator(convertedPoints);
        return pathData;
      },
      fitToRange(x, range) {
        let toScale = x;
        const [from, to] = range;
        if (x > to) toScale = to;
        if (x < from) toScale = from;
        return toScale;
      },
      xScale(x) {
        const toScale = this.fitToRange(x, this.xRange);
        return d3.scaleLinear()
          .domain(this.xRange)
          .range([this.plotArea.x, this.plotArea.width])(toScale);
      },
      xScaleInvert(x) {
        return d3.scaleLinear()
          .domain(this.xRange)
          .range([this.plotArea.x, this.plotArea.width])
          .invert(x);
      },
      yScale(y) {
        const toScale = this.fitToRange(y, this.yRange);
        return d3.scaleLinear()
          .domain(this.yRange)
          .range([this.plotArea.height, this.plotArea.y])(toScale);
      },
      yScaleInvert(y) {
        return d3.scaleLinear()
          .domain(this.yRange)
          .range([this.plotArea.height, this.plotArea.y])
          .invert(y);
      },
      mouseClick(e) {
        const svg = document.getElementById('svg');
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const res = pt.matrixTransform(svg.getScreenCTM().inverse());
        this.mouseX = res.x;
        this.mouseY = res.y;
        this.suggestData(this.xScaleInvert(res.x), this.yScaleInvert(res.y));
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
    .vertex-grey {
        r: 1;
        fill: #f3d1d0;
        stroke: #f3c2c2;
    }
    .eq {
        r: 3;
        fill: #5bf316;
        stroke: #262424;
    }
    .path-grey {
        fill: none;
        stroke: #bebebe;
    }
    .overload-path {
        fill: #e5edff;
        stroke: none;
    }
    .sectors path {
        fill: none;
        stroke: #404040;
        stroke-width: 2;
    }
</style>
