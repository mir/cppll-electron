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
      <label for="tau_k">tau_k = </label>
      <input type="number" v-model.number="tauK" id="tau_k"/>
      <label for="v_k">v_k = </label>
      <input type="number" v-model.number="vK" id="v_k"/>
      <br/>
      <button type="button" @click="computeNext">Next</button>
      <button type="button" @click="clear">Clear</button>
    </section>
    <tauv-chart :chart-data="datacollection"></tauv-chart>
  </div>
</template>

<script>
  import sim from './simulator/cppll.js';
  import tauvChart from './components/tauvChart';

  export default {
    name: 'cppll-simulator',
    components: {
      tauvChart,
    },
    data() {
      return {
        datacollection: {
          datasets: [
            {
              label: 'Data One',
              backgroundColor: '#f87979',
              fill: false,
              data: [{ x: 0, y: 10 }],
            },
          ],
        },
        tauK: 0,
        vK: 10,
        log: [{ x: 0, y: 10 }],
        params: {
          R: 1000,
          Ip: 10e-3,
          C: 10e-6,
          Kvco: 500,
          Tref: 10e-3,
          omegaFree: 0,
        },
      };
    },
    methods: {
      updateChartData() {
        this.datacollection = {
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
      computeNext() {
        const result = sim(this.tauK, this.vK, this.params);
        this.tauK = result.tauK;
        this.vK = result.vK;
        this.log.push({ x: this.tauK, y: this.vK });
        this.updateChartData();
      },
      clear() {
        this.log = [{ x: this.tauK, y: this.vK }];
        this.updateChartData();
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
