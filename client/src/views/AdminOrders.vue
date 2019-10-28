<template>
  <section class="wrapper d-flex vh-100">
    <AdminSideNavBar />
    <section class="users flex-fill">
      <h1 class="users-title">
        訂單管理
      </h1>
      <hr class="users-divider">
      <AdminFilterPanel
        :has-date="true"
        :options="subscriptionStatus"
        :input-placeholder="'搜尋編號'"
        @after-search="handleAfterFilter({ page: 0, order_id: $event, order_status: currentFilterOption, date: currentDate })"
        @after-filter="handleAfterFilter({ page: 0, order_id: currentSearchInput, order_status: $event, date: currentDate })"
        @after-date-pick="handleAfterFilter({ page: 0, order_id: currentSearchInput, order_status: currentFilterOption, date: $event.dob })"
      >
        <template v-slot:filterOption>
          訂單狀態
        </template>
      </AdminFilterPanel>
      <AdminOrdersTable
        :orders="orders"
        @after-cancel="handleAfterCancel"
      />
      <div class="btn-container mt-3 mt-md-4">
        <button
          v-if="currentPage !== totalPage"
          class="btn"
          href="#"
          @click="fetchOrders(currentSearchInput, currentDate, currentFilterOption, currentPage + 1)"
        >
          瀏覽更多
        </button>
      </div>
    </section>
  </section>
</template>

<script>
import AdminSideNavBar from '../components/Navbar/AdminSideNavBar'
import AdminFilterPanel from '../components/AdminFilterPanel'
import AdminOrdersTable from '../components/AdminOrdersTable.vue'

const dummyOrders = {
  orders: [
    {
      id: 1,
      require_date: '2019-10-28T03:00:00.000Z',
      order_status: '今日',
      date: '20191028',
      time: '11:00',
      meals: {
        id: 2,
        name: '巨無霸套餐',
        image: 'https://images.pexels.com/photos/2454533/pexels-photo-2454533.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        OrderItem: {
          OrderId: 1,
          MealId: 2,
          quantity: 2
        },
        Restaurant: {
          id: 1,
          name: '美國家鄉菜'
        }
      },
      User: {
        id: 1,
        name: 'Mike',
        email: 'mike@example.com'
      }
    },
    {
      id: 2,
      require_date: '2019-10-28T03:00:00.000Z',
      order_status: '今日',
      date: '20191028',
      time: '11:00',
      meals: {
        id: 2,
        name: '巨無霸套餐',
        image: 'https://images.pexels.com/photos/2454533/pexels-photo-2454533.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        OrderItem: {
          OrderId: 2,
          MealId: 2,
          quantity: 2
        },
        Restaurant: {
          id: 1,
          name: '美國家鄉菜'
        }
      },
      User: {
        id: 2,
        name: 'Micky',
        email: 'mike@example.com'
      }
    }
  ],
  pages: 3
}

export default {
  components: {
    AdminSideNavBar,
    AdminFilterPanel,
    AdminOrdersTable
  },
  data () {
    return {
      orders: [],
      subscriptionStatus: ['未取消', '取消'],
      currentSearchInput: '',
      currentFilterOption: '',
      currentDate: '',
      currentPage: 0,
      totalPage: null
    }
  },
  created () {
    const { order_id: orderId, order_status: orderStatus, date } = this.$route.query
    this.currentFilterOption = orderStatus || '非取消'
    this.currentDate = date || new Date()
    this.currentSearchInput = orderId || ''
    this.fetchOrders(this.currentSearchInput, this.currentDate, this.currentFilterOption, this.currentPage + 1)
  },
  beforeRouteUpdate (to, from, next) {
    // Reset current page
    this.currentPage = 0
    // clear existing data
    this.orders = []
    const { order_id: orderId, order_status: orderStatus, date } = to.query
    this.currentFilterOption = orderStatus || '非取消'
    this.currentDate = date || new Date()
    this.currentSearchInput = orderId || ''
    this.fetchOrders(this.currentSearchInput, this.currentDate, this.currentFilterOption, this.currentPage + 1)
    next()
  },
  methods: {
    fetchOrders (id, date, status, page) {
      // fetch data from API
      this.orders = [...this.orders, ...dummyOrders.orders]
      this.totalPage = dummyOrders.pages
    },
    handleAfterFilter (data) {
      this.currentPage = 0
      this.currentSearchInput = data.order_id
      this.currentFilterOption = data.order_status
      this.currentDate = data.date
      this.$router.push({ name: 'admin-orders', query: data })
    },
    handleAfterCancel (orderId) {
      console.log('from parent', orderId)
      this.orders = this.orders.filter(order => order.id !== orderId)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
    background-color: color(quinary);
}

.users {
    padding: 2.3rem 2rem;
    max-width: 800px;
    margin-left: 80px;
    transition: margin-left .1s linear;
    overflow-y: scroll;

    &-title {
        size: size(lg);
    }

    &-divider {
        width: 100%;
    }

    @include response(md) {
        margin-left: 145px;
    }
}

.btn-container {
    text-align: center;
    .btn {
        @include solidButton(150);

        @include response(md) {
            min-width: 200px;
        }
    }
}
</style>
