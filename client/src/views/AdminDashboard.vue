<template>
  <section class="wrapper d-flex vh-100">
    <!--Left Side Navbar-->
    <AdminSideNavBar :nav-is-open="navIsOpen" />

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
      <AdminDashboardToday :order-today="orderToday" />

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
          <div class="col-md-6">
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
          <div class="col-md-6">
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
          <div class="col-md-6">
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

const dummyChartData = {
  userIncreased: 50,
  restIncreased: 12,
  subIncreased: 15,
  order_num: 80,
  orders: {
    labels: ['11/1', '11/2', '11/3', '11/4', '11/5', '11/6', '11/7', '11/8', '11/9', '11/10', '11/11', '11/12', '11/13', '11/14', '11/15', '11/16', '11/17', '11/18', '11/19', '11/20', '11/21', '11/22'],
    data: [40, 30, 45, 34, 30, 41, 32, 38, 35, 40, 38, 32, 40, 30, 45, 34, 30, 41, 32, 38, 35, 40],
    total: 353,
    thisMonth: 321
  },
  restaurants: {
    labels: ['11/1', '11/2', '11/3', '11/4', '11/5', '11/6', '11/7', '11/8', '11/9', '11/10', '11/11', '11/12', '11/13', '11/14', '11/15', '11/16', '11/17', '11/18', '11/19', '11/20', '11/21', '11/22'],
    data: [40, 30, 45, 34, 30, 41, 32, 38, 35, 40, 38, 32, 40, 30, 45, 34, 30, 41, 32, 38, 35, 40],
    total: 453,
    thisMonth: 321
  },
  subscriptions: {
    labels: ['11/1', '11/2', '11/3', '11/4', '11/5', '11/6', '11/7', '11/8', '11/9', '11/10', '11/11', '11/12', '11/13', '11/14', '11/15', '11/16', '11/17', '11/18', '11/19', '11/20', '11/21', '11/22'],
    datasets: [
      {
        label: '10 餐',
        data: [10, 11, 13, 15, 18, 20, 22, 23, 25, 26, 26, 28, 30, 30, 31, 33, 33, 33, 35, 38, 39, 40]
      },
      {
        label: '20 餐',
        data: [2, 3, 4, 6, 8, 10, 12, 14, 15, 17, 18, 19, 22, 22, 23, 24, 25, 25, 27, 28, 29, 30]
      }
    ],
    total: 100
  },
  users: {
    labels: ['訂閱中', '為訂閱'],
    data: [80, 20],
    total: 100
  }
}

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
            name: '訂單',
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
          restaurants: {
            name: '餐廳',
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
            name: '會員',
            datasets: [{
              backgroundColor: ['rgb(255,140,52)', 'rgb(78,202,138)']
            }]
          }
        },
        multipleData: {
          subscriptions: {
            name: '訂閱',
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
    fetchData () {
      // handle order today
      const { userIncreased, restIncreased, subIncreased, order_num: orderNum } = dummyChartData
      this.orderToday = { userIncreased, restIncreased, subIncreased, orderNum }

      // handle orders, restaurats, users data
      for (let prop in this.data.singleData) {
        // retrieve data from response
        const { labels, data, total, thisMonth } = dummyChartData[prop]
        // store data
        this.data.singleData[prop] = {
          ...this.data.singleData[prop],
          labels,
          total,
          thisMonth,
          datasets: [{ ...this.data.singleData[prop].datasets[0], data }]
        }
      }

      // handle subsciptions
      this.data.multipleData.subscriptions = {
        ...this.data.multipleData.subscriptions,
        total: dummyChartData.subscriptions.total,
        labels: dummyChartData.subscriptions.labels,
        datasets: [
          {
            ...this.data.multipleData.subscriptions.datasets[0],
            ...dummyChartData.subscriptions.datasets[0]
          },
          {
            ...this.data.multipleData.subscriptions.datasets[1],
            ...dummyChartData.subscriptions.datasets[1]
          }
        ]
      }

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
