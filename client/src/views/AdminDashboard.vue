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
        平台分析
      </h1>
      <hr class="dashboard-divider">

      <!--Today Overview-->
      <AdminDashboardToday />

      <!--Loader-->
      <Loader
        v-if="isLoading"
        :height="'300px'"
      />

      <transition
        name="slide"
      >
        <!--Chart Display-->
        <div
          v-if="!isLoading"
          class="row"
        >
          <!--Order Section-->
          <div class="col-md-6">
            <LineChartSpecific
              :chart-data="ordersChartData"
              :height="160"
            >
              <template #header>
                <i class="fas fa-clipboard-list mr-2" />訂單
              </template>
              <template #title>
                近一個月總訂單
              </template>
              <template #text>
                325
              </template>
            </LineChartSpecific>
          </div>
          <!--Customers Section-->
          <div class="col-md-6">
            <LineChartSpecific
              :chart-data="customerChartData"
              :height="160"
            >
              <template #header>
                <i class="fas fa-users mr-2" />客群
              </template>
              <template #title>
                近一個月總客群數
              </template>
              <template #text>
                <span :style="{color: customerChartData.datasets[0].borderColor}">232</span>
              </template>
            </LineChartSpecific>
          </div>
          <!--Reviews Section-->
          <div class="col-md-6">
            <BarChartHorizontal
              :chart-data="reviewChartData"
              :height="160"
            >
              <template #header>
                <i class="fas fa-smile mr-2" />滿意度
              </template>
              <template #title>
                用戶平均滿意度
              </template>
              <template #text>
                <span :style="{color: reviewChartData.datasets[0].borderColor}">4.3</span>
              </template>
            </BarChartHorizontal>
          </div>
          <!--Comments Section-->
          <div class="col-md-6 ">
            <DashboardCommentCard :comments="comments" />
          </div>
        </div>
      </transition>
    </section>
  </section>
</template>

<script>
import OwnerSideNavBar from '../components/Navbar/OwnerSideNavBar'
import NavbarToggler from '../components/Navbar/NavbarToggler'
import AdminDashboardToday from '../components/AdminDashboardToday'
import LineChartSpecific from '../components/Card/LineChartSpecific'
import BarChartHorizontal from '../components/Card/BarChartHorizontal'
import DashboardCommentCard from '../components/Card/DashboardCommentCard'
import Loader from '../components/Loader'

const dummyChartData = {
  orders: {
    labels: ['11/1', '11/2', '11/3', '11/4', '11/5', '11/6', '11/7', '11/8', '11/9', '11/10', '11/11', '11/12', '11/13', '11/14', '11/15', '11/16', '11/17', '11/18', '11/19', '11/20', '11/21', '11/22'],
    data: [40, 30, 45, 34, 30, 41, 32, 38, 35, 40, 38, 32, 40, 30, 45, 34, 30, 41, 32, 38, 35, 40]
  },
  customers: {
    labels: ['11/1', '11/2', '11/3', '11/4', '11/5', '11/6', '11/7', '11/8', '11/9', '11/10', '11/11', '11/12', '11/13', '11/14', '11/15', '11/16', '11/17', '11/18', '11/19', '11/20', '11/21', '11/22'],
    data: [40, 30, 45, 34, 30, 41, 32, 38, 35, 40, 38, 32, 40, 30, 45, 34, 30, 41, 32, 38, 35, 40]
  },
  review: {
    labels: ['5星', '4星', '3星', '2星', '1星'],
    data: [32, 19, 10, 3, 2]
  },
  comments: [
    {
      name: 'Mike',
      text: '份量大，非常美味！',
      rating: 4.3
    },
    {
      name: 'John',
      text: '份量大，非常美味！',
      rating: 3.3
    },
    {
      name: 'Danny',
      text: '份量大，非常美味！',
      rating: 4.8
    },
    {
      name: 'Tao',
      text: '份量大，非常美味！',
      rating: 5.0
    },
    {
      name: 'Mike',
      text: '份量大，非常美味！',
      rating: 4.3
    }
  ]
}

export default {
  components: {
    OwnerSideNavBar,
    NavbarToggler,
    Loader,
    AdminDashboardToday,
    LineChartSpecific,
    BarChartHorizontal,
    DashboardCommentCard
  },
  data () {
    return {
      isLoading: true,
      navIsOpen: false,
      color: 'rgb(239, 75, 77)',
      ordersChartData: {
        datasets: [{
          data: dummyChartData.orders.data,
          borderColor: 'rgb(247,185,36)',
          backgroundColor: 'rgb(253,241,211)',
          pointBackgroundColor: 'rgb(255,255,255)',
          pointHoverBackgroundColor: 'rgb(255,255,255)',
          pointBorderWidth: 3,
          pointHoverBorderWidth: 2
        }]
      },
      customerChartData: {
        datasets: [{
          borderColor: 'rgb(138,226,183)',
          backgroundColor: 'rgb(242,251,247)',
          pointBackgroundColor: 'rgb(255,255,255)',
          pointHoverBackgroundColor: 'rgb(255,255,255)',
          pointBorderWidth: 3,
          pointHoverBorderWidth: 2
        }]
      },
      reviewChartData: {
        datasets: [{
          borderColor: 'rgb(62,160,252)',
          backgroundColor: 'rgb(62,160,252)',
          pointBackgroundColor: 'rgb(255,255,255)',
          pointHoverBackgroundColor: 'rgb(255,255,255)',
          pointBorderWidth: 3,
          pointHoverBorderWidth: 2
        }]
      },
      comments: []
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      // handle orders
      this.ordersChartData = {
        labels: dummyChartData.orders.labels,
        datasets: [{
          ...this.ordersChartData.datasets[0],
          data: dummyChartData.orders.data
        }]
      }
      // handle customers
      this.customerChartData = {
        labels: dummyChartData.customers.labels,
        datasets: [{
          ...this.customerChartData.datasets[0],
          data: dummyChartData.customers.data
        }]
      }
      // handle review
      this.reviewChartData = {
        labels: dummyChartData.review.labels,
        datasets: [{
          ...this.reviewChartData.datasets[0],
          data: dummyChartData.review.data
        }]
      }
      // handle comments
      this.comments = dummyChartData.comments
      // update loading status
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
@include slideAnimation;

.wrapper {
  background-color: color(quinary);
}

.dashboard {
  @include controlPanelLayout;

  &-review {
    height: 285.188px;
    overflow: scroll;
    background-color: color(quaternary);
  }
}
</style>
