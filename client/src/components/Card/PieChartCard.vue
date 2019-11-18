<template>
  <div class="card rounded-sm shadow-sm border-0">
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
        <span class="mr-2"><slot name="text" /></span>
        <span class="card-subtext"><slot name="subtext" /></span>
      </h3>
    </div>
    <div
      class="card-body pl-0 pr-3 pb-4 pt-0"
    >
      <PieChartTemplate
        :chart-data="chartData"
        :options="chartOptions"
        :styles="styles"
      />
    </div>
  </div>
</template>

<script>
import PieChartTemplate from '../Chart/PieChartTemplate'

export default {
  components: {
    PieChartTemplate
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
      chartOptions: {
        animation: {
          easing: 'easeOutQuad',
          animateScale: true
        },
        legend: {
          display: true,
          position: 'right'
        },
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            right: 5,
            top: 0,
            left: 5,
            bottom: 0
          }
        }
      }
    }
  },
  computed: {
    styles () {
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
    padding: .6rem 1.25rem;
  }

  &-statistic {
    position: relative;
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
    color: color(secondary);
  }

  &-subtext {
    font-size: size(xs);
    color: rgb(58,196,124);
  }
}
</style>
