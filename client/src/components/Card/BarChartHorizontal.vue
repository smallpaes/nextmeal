<template>
  <div class="card rounded-sm shadow-sm border-0 mb-4">
    <div
      v-if="$slots.header"
      class="card-header bg-white"
    >
      <slot name="header" />
    </div>
    <div class="card-body card-statistic">
      <p class="card-title">
        <slot name="title" />
      </p>
      <h3 class="card-text">
        <slot name="text" />
      </h3>
    </div>
    <div class="card-body pl-0 pr-3 pb-1">
      <BarChartTemplate
        :chart-data="chartData"
        :options="chartOptions"
        :styles="myStyles"
      />
    </div>
  </div>
</template>

<script>
import BarChartTemplate from '../Chart/BarChartTemplate'

export default {
  components: {
    BarChartTemplate
  },
  props: {
    chartData: {
      type: Object,
      required: true
    },
    height: {
      type: Number,
      default: 160
    }
  },
  data () {
    return {
      isLoading: false, // true
      navIsOpen: false,
      chartOptions: {
        animation: {
          easing: 'easeOutQuad'
        },
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            right: 5,
            top: 5,
            left: 5,
            bottom: 15
          }
        },
        tooltips: {
          // none
        },
        scales: {
          yAxes: [{
            stacked: true,
            ticks: {
              beginAtZero: true,
              // display: false
              stepSize: 10,
              fontColor: '#a9a7a5'
            },
            gridLines: {
              display: false,
              color: 'rgba(255,255,255,0)'
            }
          }],
          xAxes: [{
            stacked: true,
            ticks: {
              display: true,
              fontColor: '#a9a7a5'
            },
            gridLines: {
              display: false,
              color: 'rgba(255,255,255,0)',
              tickMarkLength: 8
            }
          }]
        }
      }
    }
  },
  computed: {
    myStyles () {
      return {
        height: `${this.height}px`,
        position: 'relative'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  &-header {
    font-size: size(sm);
    color: color(secondary);
    padding: 1rem 1.25rem;
  }

  &-statistic {
    padding-left: 1.6rem;
  }

  &-title {
    font-size: size(xs);
    color: lighten(color(secondary), 30%);
    margin-bottom: .2rem;
  }

  &-text {
    font-size: size(lg);
    font-weight: weight(bold);
    color: rgb(247,185,36);
  }
}
</style>
