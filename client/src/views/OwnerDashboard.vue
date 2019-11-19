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

      <transition
        name="slide"
        appear
      >
        <template v-if="!isLoading">
          <!--Chart Display-->
          <div
            v-if="currentUser.hasRestaurant"
            class="row align-items-stretch"
          >
            <!--Order Section-->
            <div class="col-md-6 mb-4">
              <LineChartCard
                :chart-data="data.orders"
                :height="160"
              >
                <template #header>
                  <i class="fas fa-clipboard-list mr-2" />{{ data.orders.name }}
                </template>
                <template #title>
                  近一個月總{{ data.orders.name }}數
                </template>
                <template #text>
                  <span :style="{color: data.orders.datasets[0].borderColor}">{{ data.orders.total || 0 }}</span>
                </template>
              </LineChartCard>
            </div>
            <!--Customers Section-->
            <div class="col-md-6 mb-4">
              <PieChartCard
                :chart-data="data.users"
                :height="160"
              >
                <template #header>
                  <i class="fas fa-users mr-2" />{{ data.users.name }}
                </template>
                <template #title>
                  近一個月總{{ data.users.name }}數
                </template>
                <template #text>
                  <span :style="{color: 'rgb(93,90,87)'}">{{ data.users.total || 0 }}</span>
                </template>
              </PieChartCard>
            </div>
            <!--ratings Section-->
            <div class="col-md-6 mb-4">
              <BarChartHorizontal
                :chart-data="data.ratings"
                :height="160"
              >
                <template #header>
                  <i class="fas fa-smile mr-2" />{{ data.ratings.name }}
                </template>
                <template #title>
                  用戶平均{{ data.ratings.name }}
                </template>
                <template #text>
                  <span :style="{color: data.ratings.datasets[0].borderColor}">{{ data.ratings.average || 0 }}</span>
                </template>
              </BarChartHorizontal>
            </div>
            <!--Comments Section-->
            <div class="col-md-6 mb-4 ">
              <DashboardCommentCard :comments="comments" />
            </div>
          </div>
          <!--Placeholder Messgae when restaurat info is empty-->
          <PlaceholderMessage
            v-else
            class="placeholder-message col-12 py-4 text-center"
          >
            <h1><i class="fas fa-exclamation-circle" /></h1>
            請先至「餐廳」頁面填寫資料<br>完成開店流程
          </PlaceholderMessage>
        </template>
      </transition>
    </section>
  </section>
</template>

<script>
import OwnerSideNavBar from '../components/Navbar/OwnerSideNavBar'
import NavbarToggler from '../components/Navbar/NavbarToggler'
import LineChartCard from '../components/Card/LineChartCard'
import BarChartHorizontal from '../components/Card/BarChartHorizontal'
import DashboardCommentCard from '../components/Card/DashboardCommentCard'
import PieChartCard from '../components/Card/PieChartCard'
import PlaceholderMessage from '../components/Placeholder/Message'
import Loader from '../components/Loader'
import ownerAPI from '../apis/owner'
import { Toast } from '../utils/helpers'
import { mapState } from 'vuex'

export default {
  components: {
    OwnerSideNavBar,
    NavbarToggler,
    Loader,
    LineChartCard,
    BarChartHorizontal,
    DashboardCommentCard,
    PieChartCard,
    PlaceholderMessage
  },
  data () {
    return {
      isLoading: true,
      navIsOpen: false,
      color: 'rgb(239, 75, 77)',
      data: {
        orders: {
          name: '訂單',
          datasets: [{
            borderColor: 'rgb(247,185,36)',
            backgroundColor: 'rgb(253,241,211)',
            pointBackgroundColor: 'rgb(255,255,255)',
            pointHoverBackgroundColor: 'rgb(255,255,255)',
            pointBorderWidth: 3,
            pointHoverBorderWidth: 2
          }]
        },
        users: {
          name: '客群',
          datasets: [{
            backgroundColor: ['rgb(0,143,250)', 'rgb(119,93,207)', 'rgb(255,140,52)', 'rgb(239,75,77)', 'rgb(78,202,138)', 'rgb(247,185,37)']
          }]
        },
        ratings: {
          name: '滿意度',
          datasets: [{
            borderColor: 'rgb(62,160,252)',
            backgroundColor: 'rgb(62,160,252)',
            pointBackgroundColor: 'rgb(255,255,255)',
            pointHoverBackgroundColor: 'rgb(255,255,255)',
            pointBorderWidth: 3,
            pointHoverBorderWidth: 2
          }]
        }
      },
      comments: []
    }
  },
  computed: {
    ...mapState(['currentUser'])
  },
  created () {
    if (this.currentUser.hasRestaurant) return this.fetchData()
    this.isLoading = false
  },
  methods: {
    async fetchData () {
      try {
        // fetch data from API
        const { data: dashboardData, statusText } = await ownerAPI.dashboard.getDashboard()
        // error handling
        if (dashboardData.status !== 'success' || statusText !== 'OK') throw new Error(dashboardData.message)
        // handle orders, rating, users data
        for (let prop in this.data) {
        // retrieve data from response
          const { labels, data, average, total } = dashboardData[prop]
          // store data
          this.data[prop] = {
            ...this.data[prop],
            average,
            labels,
            total,
            datasets: [{ ...this.data[prop].datasets[0], data }]
          }
        }

        // handle comments
        this.comments = dashboardData.comments
        // update loading status
        this.isLoading = false
      } catch (error) {
        // update loading status
        this.isLoading = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法取得資料，請稍後再試'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@include slideAnimation;

.wrapper { background-color: color(quinary); }

.dashboard {
  @include controlPanelLayout;

  &-ratings {
    height: 285.188px;
    overflow: scroll;
    background-color: color(quaternary);
  }
}
</style>
