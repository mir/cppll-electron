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
    <span class="params">T_ref = {{ params.Tref }}</span>
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
      <input type="range"  v-model="tauKRange" name="tauKRange"  min="-50" max="50">
    </div>
    <span class="params">v_k = {{ vK }}</span>
    <div class="ranges">
      <input type="range"  v-model="vKRange" name="vKRange"  min="0" max="100">
    </div>
    <tauv-chart :chart-data="datacollection"  id="chart"></tauv-chart>
  </div>
</template>

<script>
  import { computeNextN } from './simulator/cppll.js';
  import tauvChart from './components/tauvChart';

  export default {
    name: 'cppll-simulator',
    components: {
      tauvChart,
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
      log() {
        return computeNextN(90, this.tauK, this.vK, this.params);
      },
      datacollection() {
        return {
          datasets: [
            {
              label: 'tau_k and v_k',
              backgroundColor: '#f87979',
              showLine: true,
              fill: false,
              data: this.log,
            },
          ],
        };
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
  .ranges {
    grid-column: span 4;
  }
  .initialData {
    grid-column: span 12;
  }
  #chart {
    grid-column: span 12;
  }
</style>
