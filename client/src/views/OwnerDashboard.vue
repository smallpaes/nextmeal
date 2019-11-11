<template>
  <section class="wrapper d-flex vh-100">
    <!--Left Side Navbar-->
    <OwnerSideNavBar :nav-is-open="navIsOpen" />

    <!--Right Side Content-->
    <section class="dashboard flex-fill">
      <!--Navbar toggler-->
      <NavbarToggler
        :nav-is-open="navIsOpen"
        @toggle-navbar="navIsOpen = !navIsOpen"
      />
      <h1 class="dashboard-title">
        餐廳分析
      </h1>
      <hr class="dashboard-divider">

      <!--Loader-->
      <Loader
        v-if="isLoading"
        :height="'300px'"
      />

      <!--Chart Display-->
      <div class="row">
        <div class="col-md-6">
          <LineChart
            :chart-data="chartData"
            :options="chartOptions"
          />
        </div>
        <div class="col-md-6">
          <LineChart />
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import OwnerSideNavBar from '../components/Navbar/OwnerSideNavBar'
import NavbarToggler from '../components/Navbar/NavbarToggler'
import LineChart from '../components/Chart/LineChart'
import Loader from '../components/Loader'
import { Toast } from '../utils/helpers'

export default {
  components: {
    OwnerSideNavBar,
    NavbarToggler,
    Loader,
    LineChart
  },
  data () {
    return {
      isLoading: false, // true
      navIsOpen: false,
      chartData: {
        labels: ['11/1', '11/2', '11/3', '11/4', '11/5', '11/6', '11/7', '11/8', '11/9', '11/10', '11/11', '11/12'],
        datasets: [{
          label: ['訂單'],
          data: [40, 30, 45, 34, 30, 41, 32, 38, 35, 40, 38, 32],
          borderColor: 'rgb(247,185,36)',
          backgroundColor: 'rgb(253,241,211)',
          pointBackgroundColor: 'rgb(255,255,255)',
          pointHoverBackgroundColor: 'rgb(255,255,255)',
          pointBorderWidth: 3,
          pointHoverBorderWidth: 2
        }]
      },
      chartOptions: {
        scales: {
          yAxes: [{
            ticks: {

            }
          }]
        }
      }
    }
  },
  computed: {
    smallLineChart () {
      return {

      }
    }
  }
}
</script>

<style lang="scss" scoped>
@include slideAnimation(false);

.wrapper {
  background-color: color(quinary);
}

.dashboard {
  @include controlPanelLayout;
}
</style>
