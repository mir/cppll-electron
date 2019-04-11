<template>
  <div id="app">
    <p>CPPLL simulator</p>
    <section class="params">
      <label for="C">C = </label>
      <input type="number" v-model="params.C" id="C"/>
      <br/>
      <label for="R">R = </label>
      <input type="number" v-model="params.R" id="R"/>
      <br/>
      <label for="I_p">I_p = </label>
      <input type="number" v-model="params.Ip" id="I_p"/>
      <br/>
      <label for="K_vco">K_vco = </label>
      <input type="number" v-model="params.Kvco" id="K_vco"/>
      <br/>
      <label for="T_ref">T_ref = </label>
      <input type="number" v-model="params.Tref" id="T_ref"/>
      <br/>
      <label for="omega_free">omega_free = </label>
      <input type="number" v-model="params.omegaFree" id="omega_free"/>
    </section>
    <section class="inital-data">
      <label for="tau_k">tau_k = </label>
      <input type="number" v-model="tauK" id="tau_k"/>
      <label for="v_k">v_k = </label>
      <input type="number" v-model="vK" id="v_k"/>
      <br/>
      <button type="button" @click="computeNext">Next</button>
    </section>
    <chart></chart>
  </div>
</template>

<script>
  import LandingPage from '@/components/LandingPage';
  import sim from './simulator/cppll.js';
  import Chart from './components/Chart';

  export default {
    name: 'cppll-simulator',
    components: {
      Chart,
      LandingPage,
    },
    data() {
      return {
        tauK: 0,
        vK: 0,
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
      computeNext() {
        const result = sim(this.tauK, this.vK, this.params);
        this.tauK = result.tauK;
        this.vK = result.vK;
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
