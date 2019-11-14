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
      >
        <!--Chart Display-->
        <div
          v-if="!isLoading"
          class="row"
        >
          <!--Order Section-->
          <div class="col-md-6">
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
                325
              </template>
            </LineChartCard>
          </div>
          <!--Customers Section-->
          <div class="col-md-6">
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
                <span :style="{color: 'rgb(93,90,87)'}">82</span>
              </template>
            </PieChartCard>
          </div>
          <!--ratings Section-->
          <div class="col-md-6">
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
                <span :style="{color: data.ratings.datasets[0].borderColor}">{{ data.ratings.average }}</span>
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
import LineChartCard from '../components/Card/LineChartCard'
import BarChartHorizontal from '../components/Card/BarChartHorizontal'
import DashboardCommentCard from '../components/Card/DashboardCommentCard'
import PieChartCard from '../components/Card/PieChartCard'
import Loader from '../components/Loader'

const dummyChartData = {
  orders: {
    labels: ['11/1', '11/2', '11/3', '11/4', '11/5', '11/6', '11/7', '11/8', '11/9', '11/10', '11/11', '11/12', '11/13', '11/14', '11/15', '11/16', '11/17', '11/18', '11/19', '11/20', '11/21', '11/22'],
    data: [40, 30, 45, 34, 30, 41, 32, 38, 35, 40, 38, 32, 40, 30, 45, 34, 30, 41, 32, 38, 35, 40]
  },
  users: {
    labels: ['<20', '20-30', '30-40', '40-50', '50-60', '>60'],
    data: [12, 32, 40, 20, 25, 10],
    total: 553
  },
  ratings: {
    labels: ['5星', '4星', '3星', '2星', '1星'],
    data: [32, 19, 10, 3, 2],
    average: '3.4'
  },
  comments: [
    {
      name: 'Mike',
      user_text: '份量大，非常美味！',
      rating: 4.3,
      createdAt: '2019-10-15T05:00:00.000Z'
    },
    {
      name: 'John',
      user_text: '份量大，非常美味！',
      rating: 3.3,
      createdAt: '2019-06-12T03:00:00.000Z'
    },
    {
      name: 'Danny',
      user_text: '份量大，非常美味！',
      rating: 4.8,
      createdAt: '2019-02-02T03:30:00.000Z'
    },
    {
      name: 'Tao',
      user_text: '份量大，非常美味！',
      rating: 5.0,
      createdAt: '2018-12-12T03:00:00.000Z'
    },
    {
      name: 'Mike',
      user_text: '份量大，非常美味！',
      rating: 4.3,
      createdAt: '2018-12-12T03:00:00.000Z'
    }
  ]
}

export default {
  components: {
    OwnerSideNavBar,
    NavbarToggler,
    Loader,
    LineChartCard,
    BarChartHorizontal,
    DashboardCommentCard,
    PieChartCard
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
            data: dummyChartData.orders.data,
            borderColor: 'rgb(247,185,36)',
            backgroundColor: 'rgb(253,241,211)',
            pointBackgroundColor: 'rgb(255,255,255)',
            pointHoverBackgroundColor: 'rgb(255,255,255)',
            pointBorderWidth: 3,
            pointHoverBorderWidth: 2
          }]
        },
        users: {
          name: '會員',
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
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      // handle orders, rating, users data
      for (let prop in this.data) {
        // retrieve data from response
        const { labels, data, average, total } = dummyChartData[prop]
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

  &-ratings {
    height: 285.188px;
    overflow: scroll;
    background-color: color(quaternary);
  }
}
</style>
