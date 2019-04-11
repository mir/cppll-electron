// tauvChart.js
import { Scatter, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {
  extends: Scatter,
  mixins: [reactiveProp],
  options: {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0, // disables bezier curves
      },
    },
  },

  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
