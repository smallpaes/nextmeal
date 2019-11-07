<template>
  <section class="wrapper d-flex vh-100">
    <AdminSideNavBar :nav-is-open="navIsOpen" />
    <section class="users flex-fill">
      <!--Navbar toggler-->
      <NavbarToggler
        :nav-is-open="navIsOpen"
        @toggle-navbar="navIsOpen = !navIsOpen"
      />
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
        @after-date-pick="handleAfterFilter({ page: 0, order_id: currentSearchInput, order_status: currentFilterOption, date: $event })"
      >
        <template v-slot:filterOption>
          訂單狀態
        </template>
      </AdminFilterPanel>
      <template v-if="orders.length > 0">
        <AdminOrdersTable
          :orders="orders"
          @after-cancel="handleAfterCancel"
        />
        <div
          v-if="totalPage > 0 && currentPage !== totalPage"
          class="btn-container mt-3 mt-md-4"
        >
          <button
            class="btn"
            href="#"
            @click="fetchOrders(currentSearchInput, currentDate, currentFilterOption, currentPage + 1)"
          >
            瀏覽更多
          </button>
        </div>
      </template>
      <PlaceholderMessage v-else>
        <i class="fas fa-search mr-2" />沒有符合的結果
      </PlaceholderMessage>
    </section>
  </section>
</template>

<script>
import AdminSideNavBar from '../components/Navbar/AdminSideNavBar'
import NavbarToggler from '../components/Navbar/NavbarToggler'
import AdminFilterPanel from '../components/AdminFilterPanel'
import AdminOrdersTable from '../components/AdminOrdersTable.vue'
import PlaceholderMessage from '../components/Placeholder/Message'
import adminAPI from '../apis/admin'
import moment from 'moment'
import { Toast } from '../utils/helpers'

export default {
  components: {
    AdminSideNavBar,
    NavbarToggler,
    AdminFilterPanel,
    AdminOrdersTable,
    PlaceholderMessage
  },
  data () {
    return {
      orders: [],
      subscriptionStatus: ['未取消', '取消'],
      currentSearchInput: '',
      currentFilterOption: '',
      currentDate: '',
      currentPage: 0,
      totalPage: null,
      isLoading: true,
      navIsOpen: false
    }
  },
  created () {
    const { order_id: orderId, order_status: orderStatus, date } = this.$route.query
    this.currentFilterOption = orderStatus || ''
    this.currentDate = date || moment().format('YYYY-MM-DD')
    this.currentSearchInput = orderId || ''
    this.fetchOrders(this.currentSearchInput, this.currentDate, this.currentFilterOption, this.currentPage + 1)
  },
  beforeRouteUpdate (to, from, next) {
    // Reset current page
    this.currentPage = 0
    // clear existing data
    this.orders = []
    const { order_id: orderId, order_status: orderStatus, date } = to.query
    this.currentFilterOption = orderStatus || ''
    this.currentDate = date || moment().format('YYYY-MM-DD')
    this.currentSearchInput = orderId || ''
    this.fetchOrders(this.currentSearchInput, this.currentDate, this.currentFilterOption, this.currentPage + 1)
    next()
  },
  methods: {
    async fetchOrders (id, date, status, page) {
      try {
        this.isLoading = true
        // fetch data from API
        const { data, statusText } = await adminAPI.orders.getOrders({ id, date, status, page })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // fetch data from API
        this.orders = [...this.orders, ...data.orders]
        this.totalPage = data.pages
        this.currentPage += 1
        // update loading status
        this.isLoading = false
      } catch (error) {
        // update loading status
        this.isLoading = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法取得訂單資料，請稍後再試'
        })
      }
    },
    handleAfterFilter (data) {
      this.currentPage = 0
      this.currentSearchInput = data.order_id
      this.currentFilterOption = data.order_status
      this.currentDate = data.date
      this.orders = []
      this.fetchOrders(this.currentSearchInput, this.currentDate, this.currentFilterOption, this.currentPage)
    },
    handleAfterCancel (orderId) {
      this.orders = this.orders.map(order => {
        if (order.id !== orderId) { return order }
        return ({
          ...order,
          order_status: '取消'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
    background-color: color(quinary);
}

.users {
    @include controlPanelLayout;
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
