<template>
  <div id="app">
    <p>CPPLL simulator</p>
    <section class="params">
      <label for="C">C = </label>
      <input type="number" v-model.number="params.C" id="C"/>
      <br/>
      <label for="R">R = </label>
      <input type="number" v-model.number="params.R" id="R"/>
      <br/>
      <label for="I_p">I_p = </label>
      <input type="number" v-model.number="params.Ip" id="I_p"/>
      <br/>
      <label for="K_vco">K_vco = </label>
      <input type="number" v-model.number="params.Kvco" id="K_vco"/>
      <br/>
      <label for="T_ref">T_ref = </label>
      <input type="number" v-model.number="params.Tref" id="T_ref"/>
      <br/>
      <label for="omega_free">omega_free = </label>
      <input type="number" v-model.number="params.omegaFree" id="omega_free"/>
    </section>
    <section class="inital-data">
      <p>tau_k = {{ tauK }}</p>
      <input type="range"  v-model="tauKRange" name="tauKRange"  min="-50" max="50">
      <br/>
      <p>v_k = {{ vK }}</p>
      <input type="range"  v-model="vKRange" name="vKRange"  min="0" max="100">
    </section>
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
        // log: [{ x: 0, y: 10 }],
        params: {
          R: 1000,
          Ip: 1e-3,
          C: 1e-6,
          Kvco: 500,
          Tref: 1e-3,
          omegaFree: 0,
        },
      };
    },
    computed: {
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
        return computeNextN(30, this.tauK, this.vK, this.params);
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
  .params {
    text-align: right;
  }
</style>
