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
    <span class="params">v_k = {{ vK }}</span>
    <d3-chart class="chart"
              v-bind:data-points="log"
              v-bind:secondary-data="log2"
              v-bind:equilibrium="eq"
              v-bind:width="plotWidth"
              v-bind:height="plotHeight"
              v-bind:x-range="xRange"
              v-bind:y-range="yRange"
              v-bind:suggest-data="suggestIC"
              v-bind:v-overload="vOverload"
              v-bind:sector-line1-data="sector1"
              v-bind:sector-line2-data="sector2"/>
    <span class="params">steps = {{ steps }}</span>
    <div class="ranges">
      <input type="range"  v-model="steps" name="steps" min="10" max="1000">
    </div>
    <span class="params">nearby points = {{ nearPoints }}</span>
    <div class="ranges">
      <input type="range" v-model="nearPoints" name="steps" min="0" max="20">
    </div>
  </div>
</template>

<script>
  import { computeNextN, equilibria, inHoldIn, cycle3Exists, getSector1, getSector2 } from './simulator/cppll.js';
  import D3Chart from './components/d3Chart';

  export default {
    name: 'cppll-simulator',
    components: {
      D3Chart,
    },
    data() {
      return {
        electron: 0,
        omegaFreeRange: 0,
        omegaRefRange: 30,
        KVCORange: 500,
        IPRange: 30,
        RRange: 30,
        CRange: 60,
        steps: 50,
        nearPoints: 5,
        plotHeight: 200,
        tauK: 0,
        vK: 1,
      };
    },
    computed: {
      params() {
        const Tref = 1 / (10 ** (this.omegaRefRange / 10));
        const omegaFree = this.omegaFreeRange / (Tref * 200);
        return {
          R: 10 ** (this.RRange / 10),
          Ip: 0.1 ** (this.IPRange / 10),
          C: 0.1 ** (this.CRange / 10),
          Kvco: this.KVCORange,
          Tref,
          omegaFree,
        };
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
          const dTau = Math.cos(angle) * this.params.Tref * 0.05;
          const dv = Math.sin(angle) * equilibria(this.params).vK * 0.1;
          const newLog = this.compute(this.tauK + dTau, this.vK + dv);
          if (i % 2 === 0) {
            addLog = addLog.concat(newLog.reverse());
          } else {
            addLog = addLog.concat(newLog);
          }
        }
        return addLog;
      },
      sector1() {
        return getSector1(this.params, this.params.Tref * 2.1, this.params.Tref * 0.1);
      },
      sector2() {
        return getSector2(this.params, -1.1 * this.params.Tref, -this.params.Tref * 0.1);
      },
      xRange() {
        return [-this.params.Tref, (2 * this.params.Tref)];
      },
      yRange() {
        return [-this.eq[0].y, (this.eq[0].y * 2.5)];
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
