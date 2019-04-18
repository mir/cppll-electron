<template>
  <div id="app">
    <h1>CPPLL simulator</h1>
    <span class="params">C = {{ params.C }}</span>
    <div class="ranges">
      <input type="range" v-model.number="CRange" min="0" max="100" />
    </div>
    <span class="params">R = {{ params.R }}</span>
    <div class="ranges">
      <input type="range" v-model.number="RRange" min="0" max="100"/>
    </div>
    <span class="params">I_p = {{ params.Ip }}</span>
    <div class="ranges">
      <input type="range" v-model.number="IPRange" min="0" max="100"/>
    </div>
    <span class="params">K_vco = {{ params.Kvco }}</span>
    <div class="ranges">
      <input type="range" v-model.number="KVCORange" min="1" max="1000"/>
    </div>
    <span class="params" v-bind:class="{ yellowText: toMakeTrefYellow, redText: toMakeTrefRed }" >
      T_ref = {{ params.Tref }}
    </span>
    <div class="ranges">
      <input type="range" v-model.number="omegaRefRange" min="1" max="100"/>
    </div>
    <span class="params">omega_free = {{ params.omegaFree }}</span>
    <div class="ranges">
      <input type="range" v-model.number="omegaFreeRange" min="0" max="100"/>
    </div>
    <h3>Initial data</h3>
    <span class="params">tau_k = {{ tauK }}</span>
    <div class="ranges">
      <input type="range"  v-model="tauKRange" name="tauKRange"  min="-50" max="100">
    </div>
    <span class="params">v_k = {{ vK }}</span>
    <div class="ranges">
      <input type="range"  v-model="vKRange" name="vKRange" min="0" max="100">
    </div>
    <span class="params">steps = {{ steps }}</span>
    <div class="ranges">
      <input type="range"  v-model="steps" name="steps" min="10" max="1000">
    </div>
    <d3-chart class="chart"
              v-bind:data-points="log"
              v-bind:equilibrium="eq"
              v-bind:width="plotWidth"
              v-bind:height="plotHeight"
              v-bind:x-range="xRange"
              v-bind:y-range="yRange"/>
  </div>
</template>

<script>
  import { computeNextN, equilibria, inHoldIn, cycle3Exists } from './simulator/cppll.js';
  import D3Chart from './components/d3Chart';

  export default {
    name: 'cppll-simulator',
    components: {
      D3Chart,
    },
    data() {
      return {
        tauKRange: 0,
        vKRange: 10,
        omegaFreeRange: 0,
        omegaRefRange: 30,
        KVCORange: 500,
        IPRange: 30,
        RRange: 30,
        CRange: 60,
        steps: 50,
        plotWidth: 400,
        plotHeight: 200,
      };
    },
    computed: {
      params() {
        return {
          R: 10 ** (this.RRange / 10),
          Ip: 0.1 ** (this.IPRange / 10),
          C: 0.1 ** (this.CRange / 10),
          Kvco: this.KVCORange,
          Tref: 1 / (10 ** (this.omegaRefRange / 10)),
          omegaFree: (10 ** (this.omegaFreeRange / 10)) - 1,
        };
      },
      tauK() {
        return (this.params.Tref * this.tauKRange) / 50;
      },
      vK() {
        let to = this.vKRange / 50.0;
        if (to > 10) { to = 10; }
        if (to < 0) { to = 0; }
        return (10 ** to) - 1;
      },
      eq() {
        return [{
          x: equilibria(this.params).tauK,
          y: equilibria(this.params).vK,
        }];
      },
      log() {
        return computeNextN(this.steps, this.tauK, this.vK, this.params);
      },
      xRange() {
        return [-this.params.Tref, (2 * this.params.Tref)];
      },
      yRange() {
        return [0, (this.eq[0].y * 2.5)];
      },
      toMakeTrefRed() {
        return !inHoldIn(this.params);
      },
      toMakeTrefYellow() {
        return cycle3Exists(this.params);
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
    grid-column: span 12;
  }
</style>
