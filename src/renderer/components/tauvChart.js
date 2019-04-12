// tauvChart.js
import { Scatter, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {
  extends: Scatter,
  mixins: [reactiveProp],
  options: {
    responsive: true,
  },

  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
