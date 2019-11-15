<template>
  <section class="wrapper d-flex vh-100">
    <!--Left Side Navbar-->
    <AdminSideNavBar :nav-is-open="navIsOpen" />

    <!--Right Side Content-->
    <section class="orders flex-fill">
      <!--Navbar toggler-->
      <NavbarToggler
        :nav-is-open="navIsOpen"
        @toggle-navbar="navIsOpen = !navIsOpen"
      />
      <h1 class="orders-title">
        訂單管理
      </h1>
      <hr class="orders-divider">

      <!--Filter And Search Panel-->
      <AdminFilterPanel
        :has-date="true"
        :options="subscriptionStatus"
        :input-placeholder="'搜尋編號'"
        :is-loading="isLoading"
        @after-search="handleAfterFilter({ order_id: $event, order_status: $route.query.order_status, date: $route.query.date })"
        @after-filter="handleAfterFilter({ order_id: $route.query.order_id, order_status: $event, date: $route.query.date })"
        @after-date-pick="handleAfterFilter({ order_id: $route.query.order_id, order_status: $route.query.order_status, date: $event })"
      >
        <template v-slot:filterOption>
          訂單狀態
        </template>
      </AdminFilterPanel>

      <!--User Data Table-->
      <transition
        name="slide"
        appear
      >
        <AdminOrdersTable
          v-if="isLoading || !isLoading && orders.length > 0"
          :orders="orders"
          :is-loading="isLoading"
          @after-cancel="handleAfterCancel"
        />
      </transition>

      <!--Pagination-->
      <transition name="fade">
        <Pagination
          v-if="totalPage > 1"
          class="mt-4"
          :total-page="totalPage"
          :current-page="Number($route.query.page) || 1"
          :query="{ order_id: $route.query.order_id, order_status: $route.query.order_status, date: $route.query.date }"
        />
      </transition>

      <!--Placeholder Messgae for Empty Data-->
      <PlaceholderMessage
        v-if="!isLoading && orders.length === 0"
        class="orders-placeholder"
      >
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
import Pagination from '../components/Pagination'
import adminAPI from '../apis/admin'
import moment from 'moment'
import { Toast } from '../utils/helpers'

export default {
  components: {
    AdminSideNavBar,
    NavbarToggler,
    AdminFilterPanel,
    AdminOrdersTable,
    PlaceholderMessage,
    Pagination
  },
  data () {
    return {
      orders: [],
      subscriptionStatus: ['未取消', '取消'],
      totalPage: null,
      isLoading: true,
      navIsOpen: false
    }
  },
  created () {
    const { order_id: orderId, order_status: orderStatus, date, page } = this.$route.query
    this.fetchOrders(orderId, date, orderStatus, page)
  },
  beforeRouteUpdate (to, from, next) {
    const { order_id: orderId, order_status: orderStatus, date, page } = to.query
    this.fetchOrders(orderId, date, orderStatus, page)
    next()
  },
  methods: {
    async fetchOrders (id = '', date = moment().format('YYYY-MM-DD'), status = '', page = 1) {
      try {
        // update loading status
        this.isLoading = true
        // fetch data from API
        const { data, statusText } = await adminAPI.orders.getOrders({ id, date, status, page })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // fetch data from API
        this.orders = data.orders
        this.totalPage = data.pages
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
    handleAfterFilter (query) {
      this.$router.push({ name: 'admin-orders', query })
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
@include slideAnimation(false);
@include fadeAnimation(false);

.wrapper {
  background-color: color(quinary);
}

.orders {
  @include controlPanelLayout;
}
</style>
