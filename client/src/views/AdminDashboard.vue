<template>
  <section class="wrapper vh-100">
    <!--Left Side Navbar-->
    <AdminSideNavBar :nav-is-open="navIsOpen" />

    <!--Right Side Content-->
    <section class="dashboard">
      <!--Navbar toggler-->
      <NavbarToggler
        :nav-is-open="navIsOpen"
        @toggle-navbar="navIsOpen = !navIsOpen"
      />
      <h1 class="dashboard-title">
        平台分析
      </h1>
      <hr class="dashboard-divider">

      <!--Loader-->
      <Loader
        v-if="isLoading"
        :height="'300px'"
      />

      <transition
        name="slide"
      >
        <!--Today Overview-->
        <AdminDashboardToday
          v-if="!isLoading"
          :order-today="orderToday"
        />
      </transition>

      <transition
        name="slide"
      >
        <!--Chart Display-->
        <div
          v-if="!isLoading"
          class="row"
        >
          <!--Order Section-->
          <div class="col-md-6 mb-4">
            <LineChartCard
              :chart-data="data.singleData.orders"
              :height="160"
            >
              <template #header>
                <i class="fas fa-clipboard-list mr-2" />{{ data.singleData.orders.name }}
              </template>
              <template #title>
                平台{{ data.singleData.orders.name }}總數
              </template>
              <template #text>
                <span :style="{color: 'rgb(93,90,87)'}">{{ data.singleData.orders.total }}</span>
              </template>
              <template #subtext>
                <span><i class="fas fa-chevron-up mr-1" />{{ data.singleData.orders.thisMonth }} / 本月</span>
              </template>
            </LineChartCard>
          </div>
          <!--Customers Section-->
          <div class="col-md-6 mb-4">
            <LineChartCard
              :chart-data="data.singleData.restaurants"
              :height="160"
            >
              <template #header>
                <i class="fas fa-store mr-2" />{{ data.singleData.restaurants.name }}
              </template>
              <template #title>
                平台{{ data.singleData.restaurants.name }}總數
              </template>
              <template #text>
                <span :style="{color: 'rgb(93,90,87)'}">{{ data.singleData.restaurants.total }}</span>
              </template>
              <template #subtext>
                <span><i class="fas fa-chevron-up mr-1" />{{ data.singleData.restaurants.thisMonth }} / 本月</span>
              </template>
            </LineChartCard>
          </div>
          <!--Subscriptions Section-->
          <div class="col-md-6 mb-4">
            <LineChartCard
              :chart-data="data.multipleData.subscriptions"
              :height="160"
            >
              <template #header>
                <i class="far fa-credit-card mr-2" />{{ data.multipleData.subscriptions.name }}
              </template>
              <template #title>
                平台{{ data.multipleData.subscriptions.name }}總數
              </template>
              <template #text>
                <span :style="{color: 'rgb(93,90,87)'}">{{ data.multipleData.subscriptions.total }}</span>
              </template>
              <template #subtext>
                <span :style="{color: data.multipleData.subscriptions.datasets[0].borderColor}">・10餐</span>
                <span :style="{color: data.multipleData.subscriptions.datasets[1].borderColor}">・20餐</span>
              </template>
            </LineChartCard>
          </div>
          <!--User Section-->
          <div class="col-md-6 mb-4">
            <PieChartCard
              :chart-data="data.singleData.users"
              :height="160"
            >
              <template #header>
                <i class="fas fa-users mr-2" />{{ data.singleData.users.name }}
              </template>
              <template #title>
                平台{{ data.singleData.users.name }}總數
              </template>
              <template #text>
                <span :style="{color: 'rgb(93,90,87)'}">{{ data.singleData.users.total }}</span>
              </template>
            </PieChartCard>
          </div>
        </div>
      </transition>
    </section>
  </section>
</template>

<script>
import AdminSideNavBar from '../components/Navbar/AdminSideNavBar'
import NavbarToggler from '../components/Navbar/NavbarToggler'
import AdminDashboardToday from '../components/AdminDashboardToday'
import LineChartCard from '../components/Card/LineChartCard'
import PieChartCard from '../components/Card/PieChartCard'
import Loader from '../components/Loader'
import adminAPI from '../apis/admin'
import { Toast } from '../utils/helpers'

export default {
  components: {
    AdminSideNavBar,
    NavbarToggler,
    Loader,
    AdminDashboardToday,
    LineChartCard,
    PieChartCard
  },
  data () {
    return {
      isLoading: true,
      navIsOpen: false,
      orderToday: {},
      color: 'rgb(239, 75, 77)',
      data: {
        singleData: {
          orders: {
            datasets: [{
              borderColor: 'rgb(247,185,36)',
              backgroundColor: 'rgb(253,241,211)',
              pointBackgroundColor: 'rgb(255,255,255)',
              pointHoverBackgroundColor: 'rgb(255,255,255)',
              pointBorderWidth: 3,
              pointHoverBorderWidth: 2
            }]
          },
          restaurants: {
            datasets: [{
              borderColor: 'rgb(138,226,183)',
              backgroundColor: 'rgb(242,251,247)',
              pointBackgroundColor: 'rgb(255,255,255)',
              pointHoverBackgroundColor: 'rgb(255,255,255)',
              pointBorderWidth: 3,
              pointHoverBorderWidth: 2
            }]
          },
          users: {
            datasets: [{
              backgroundColor: ['rgb(255,140,52)', 'rgb(78,202,138)']
            }]
          }
        },
        multipleData: {
          subscriptions: {
            datasets: [
              {
                backgroundColor: 'rgba(255,255,255,0)',
                borderColor: 'rgb(62,160,252)',
                pointBackgroundColor: 'rgb(62,160,252)',
                pointBorderWidth: 2,
                pointHoverBorderWidth: 3
              },
              {
                backgroundColor: 'rgba(255,255,255,0)',
                borderColor: 'rgb(239,75,77)',
                pointBackgroundColor: 'rgb(239,75,77)',
                pointBorderWidth: 2,
                pointHoverBorderWidth: 3
              }
            ]
          }
        }
      }
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      try {
        // fetch data from API
        const { data: dashboardData, statusText } = await adminAPI.dashboard.getDashboard()
        // error handling
        if (dashboardData.status !== 'success' || statusText !== 'OK') throw new Error(dashboardData.message)
        // handle order today
        const { userIncreased, restIncreased, subtIncreased, order_num: orderNum } = dashboardData
        this.orderToday = { userIncreased, restIncreased, subtIncreased, orderNum }

        // handle orders, restaurats, users data
        for (let prop in this.data.singleData) {
        // retrieve data from response
          const { labels, data, total, thisMonth, tableName: name } = dashboardData[prop]
          // store data
          this.data.singleData[prop] = {
            ...this.data.singleData[prop],
            labels,
            total,
            thisMonth,
            name,
            datasets: [{ ...this.data.singleData[prop].datasets[0], data }]
          }
        }

        // handle subsciptions
        this.data.multipleData.subscriptions = {
          ...this.data.multipleData.subscriptions,
          total: dashboardData.subscriptions.total,
          labels: dashboardData.subscriptions.labels,
          name: dashboardData.subscriptions.tableName,
          datasets: [
            {
              ...this.data.multipleData.subscriptions.datasets[0],
              ...dashboardData.subscriptions.datasets[0]
            },
            {
              ...this.data.multipleData.subscriptions.datasets[1],
              ...dashboardData.subscriptions.datasets[1]
            }
          ]
        }

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
