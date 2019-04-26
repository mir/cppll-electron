<template>
  <div id="app">
    <h1>CPPLL simulator</h1>
    <div class="params">
      C = <input v-model.number="params.C"
                 type="number" min="1e-9" max="1e-1"/>
    </div>
    <div class="ranges">
      <input type="range" v-model.number="CRange" min="1" max="100" />
    </div>
    <div class="params">R = <input v-model.number="params.R"
                                   type="number" min="1" max="100"/>
    </div>
    <div class="ranges">
      <input type="range" v-model.number="RRange" min="1" max="100"/>
    </div>
    <div class="params">
      I_p = <input v-model.number="params.Ip"
                   type="number" min="1" max="100"/>
    </div>
    <div class="ranges">
      <input type="range" v-model.number="IPRange" min="1" max="100"/>
    </div>
    <div class="params">K_vco = <input v-model.number="params.Kvco"
                                       type="number" min="1" max="100"/></div>
    <div class="ranges">
      <input type="range" v-model.number="KVCORange" min="1" max="100"/>
    </div>
    <div class="params" v-bind:class="{ yellowText: toMakeTrefYellow, redText: toMakeTrefRed }" >
      T_ref = <input v-model.number="tRefFormBinding"
                     type="number" min="1" max="100"/>
    </div>
    <div class="ranges">
      <input type="range" v-model.number="omegaRefRange" min="1" max="100"/>
    </div>
    <div class="params">&#969;_free = <input v-model.number="params.omegaFree"
                                            type="number" min="1" max="100"/>
    </div>
    <div class="ranges">
      <input type="range" v-model.number="omegaFreeRange" min="1" max="100"/>
    </div>

    <h3>Initial data</h3>

    <div class="params">&#964;(0) = <input v-model.number="tauK" type="number" v-bind:min="-params.Tref"/></div>
    <div class="ranges">
    </div>
    <span class="params">v(0) = <input v-model.number="vK" type="number"/></span>
    <div class="ranges">
    </div>

    <input type="range"
           v-model="yZoom"
           name="yZoom"
           min="0.1" max="30" step="0.1"
           class="vertical-slider"
           orient="vertical">
    <div class="chart">
      <d3-chart v-bind:data-points="log"
              v-bind:secondary-data="log2"
              v-bind:equilibrium="eq"
              v-bind:width="plotWidth"
              v-bind:height="plotHeight"
              v-bind:x-range="xRange"
              v-bind:y-range="yRange"
              v-bind:suggest-data="suggestIC"
              v-bind:v-overload="overloadFunc"
              v-bind:sector-line1-data="sector1"
              v-bind:sector-line2-data="sector2"/>
      <input type="range"
             v-model="xZoom"
             name="xZoom"
             min="0.1" max="10" step="0.1"
             class="wide-slider">
    </div>
    <span class="params">steps = {{ steps }}</span>
    <div class="ranges">
      <input type="range"  v-model="steps" name="steps" min="10" max="1000">
    </div>
    <span class="params">nearby points = {{ nearPoints }}</span>
    <div class="ranges">
      <input type="range" v-model="nearPoints" name="nearPoints" min="0" max="20">
    </div>
    <span class="params">radius</span>
    <div class="ranges">
      <input type="range" v-model="nearPointsRadius"
             name="nearPointsRadius"
             min="0.1" max="10" step="0.1">
    </div>
  </div>
</template>

<script>
  import { computeNextN, equilibria, inHoldIn, cycle3Exists, getSector1, getSector2 } from './simulator/cppll.js';
  import D3Chart from './components/d3Chart';
  import { vOverload } from './simulator/overload';

  export default {
    name: 'cppll-simulator',
    components: {
      D3Chart,
    },
    data() {
      return {
        params: {
          C: 1e-6,
          R: 1e3,
          Ip: 1e-4,
          Kvco: 1e3,
          Tref: 1e-3,
          omegaFree: 0,
        },
        xZoom: 1,
        yZoom: 1,
        nearPointsRadius: 1,
        electron: 0,
        steps: 50,
        nearPoints: 0,
        plotHeight: 200,
        tauK: 0,
        vK: 0.5,
      };
    },
    computed: {
      RRange: {
        get: function getR() {
          const value = this.sanitize(this.params.R);
          return Math.round(Math.log10(value) * 10);
        },
        set: function setR(sliderValue) {
          this.params.R = 10 ** (sliderValue / 10);
        },
      },
      CRange: {
        get: function getC() {
          const value = this.sanitize(this.params.C);
          return Math.round(-Math.log10(value) * 10);
        },
        set: function setC(sliderValue) {
          this.params.C = 10 ** (-sliderValue / 10);
        },
      },
      IPRange: {
        get: function getIp() {
          const value = this.sanitize(this.params.Ip);
          return Math.round(-Math.log10(value) * 10);
        },
        set: function setIp(sliderValue) {
          this.params.Ip = 10 ** (-sliderValue / 10);
        },
      },
      KVCORange: {
        get: function getKvcoRange() {
          const value = this.sanitize(this.params.Kvco);
          return Math.round(Math.log10(value) * 10);
        },
        set: function setR(sliderValue) {
          this.params.Kvco = 10 ** (sliderValue / 10);
        },
      },
      omegaRefRange: {
        get: function getOmegaRef() {
          const value = this.sanitize(this.params.Tref);
          return Math.round(-Math.log10(value) * 10);
        },
        set: function setR(sliderValue) {
          this.params.Tref = 10 ** (-sliderValue / 10);
        },
      },
      omegaFreeRange: {
        get: function getOmegaFree() {
          return Math.round(this.params.omegaFree / 10);
        },
        set: function setOmegaFree(sliderValue) {
          this.params.omegaFree = sliderValue * 10;
        },
      },
      tRefFormBinding: {
        get: function getTRef() {
          return this.params.Tref;
        },
        set: function setTRef(value) {
          const newValue = this.sanitize(value);
          this.params.Tref = newValue;
        },
      },
      eq() {
        return [{
          x: equilibria(this.params).tauK,
          y: equilibria(this.params).vK,
        }];
      },
      vOverload() {
        return -(this.params.omegaFree / this.params.Kvco);
      },
      log() {
        return computeNextN(this.steps, this.tauK, this.vK, this.params);
      },
      log2() {
        let addLog = [];
        for (let i = 1; i <= this.nearPoints; i += 1) {
          const angle = (2 * Math.PI * i) / this.nearPoints;
          let dTau = Math.cos(angle) * this.params.Tref * 0.05;
          let dv = Math.sin(angle) * equilibria(this.params).vK * 0.1;
          dTau /= this.nearPointsRadius;
          dv /= this.nearPointsRadius;
          const newLog = this.compute(this.tauK + dTau, this.vK + dv);
          if (i % 2 === 0) {
            addLog = addLog.concat(newLog.reverse());
          } else {
            addLog = addLog.concat(newLog);
          }
        }
        return addLog;
      },
      xRange() {
        return [-this.params.Tref / this.xZoom, ((2 * this.params.Tref) / this.xZoom)];
      },
      yRange() {
        return [this.eq[0].y - (this.eq[0].y / this.yZoom),
          this.eq[0].y + ((this.eq[0].y * 1.5) / this.yZoom)];
      },
      sector1() {
        return getSector1(this.params, this.xRange[1], this.params.Tref * 0.05);
      },
      sector2() {
        return getSector2(this.params, this.xRange[0], -this.params.Tref * 0.1);
      },
      toMakeTrefRed() {
        return !inHoldIn(this.params);
      },
      toMakeTrefYellow() {
        return cycle3Exists(this.params);
      },
      plotWidth() {
        return 400;
      },
    },
    methods: {
      suggestIC(tau, v) {
        this.tauK = tau;
        this.vK = v;
      },
      compute(tau, v) {
        return computeNextN(this.steps, tau, v, this.params);
      },
      overloadFunc(tau) {
        return vOverload(tau, this.params);
      },
      sanitize(value) {
        if (value <= 0) return 1;
        return value;
      },
    },
  };
</script>

<style>
  /* CSS */
  #app {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
  }
  h1 {
    grid-column: span 12;
    text-align: center;
  }
  h3 {
    grid-column: span 12;
    text-align: center;
  }
  .params {
    grid-column: span 8;
  }
  input {
    width: 110px;
    border: none;
  }
  .yellowText.redText {
    background-color: #ff928e;
  }
  .yellowText {
    background-color: #fff17c;
  }
  .ranges {
    grid-column: span 4;
  }
  .initialData {
    grid-column: span 12;
  }
  .chart {
    grid-column: span 11;
    text-align: center;
  }
  .vertical-slider {
    writing-mode: bt-lr; /* IE */
    -webkit-appearance: slider-vertical; /* WebKit */
    grid-column: span 1;
    width: 10px;
    height: 160px;
    margin-top: 20px;
  }
  .wide-slider {
    width: 90%;
    text-align: center;
  }
</style>
