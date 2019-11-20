<template>
  <section class="order-container">
    <!--Navbar-->
    <UserNavbar />
    <!--Loader-->
    <Loader
      v-if="isLoading"
      :height="'100vh'"
    />
    <transition name="slide">
      <section
        v-if="!isLoading"
        class="container pt-4 pb-4 w-100"
      >
        <div class="order-wrapper row profil">
          <div class="order-profile col-12 col-md-3 p-2">
            <!--Profile Card-->
            <UserProfileCard />
          </div>
          <div class="order-display col-12 col-md-9 p-2">
            <div class="order-display-wrapper rounded shadow-sm p-3">
              <OrderNavPill class="m-0" />
              <hr class="order-display-divider">
              <OrderCard
                v-for="order in orders"
                :key="order.id"
                :order="order"
                class="pb-2 px-0 mb-3"
              />
              <PlaceholderMessage v-if="orders.length === 0 && !isProcessing">
                <i class="fas fa-utensils mr-2" />目前沒有訂單
              </PlaceholderMessage>
              <!--Skeleton box while loading more-->
              <template v-if="!isLoading && isProcessing">
                <OrderCard
                  :is-processing="isProcessing"
                  class="pb-2 px-0 mb-3"
                />
              </template>
              <div
                v-if="totalPage > 0 && currentPage !== totalPage"
                class="btn-container"
              >
                <button
                  class="btn"
                  href="#"
                  :disabled="isProcessing"
                  @click="fetchOrders(currentStatus, currentPage + 1)"
                >
                  瀏覽更多
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </transition>
    <Footer class="w-100" />
  </section>
</template>

<script>
import UserNavbar from '../components/Navbar/UserNavbar'
import Footer from '../components/Footer'
import OrderNavPill from '../components/Navbar/OrderNavPill'
import OrderCard from '../components/Card/OrderCard'
import UserProfileCard from '../components/Card/UserProfileCard'
import Loader from '../components/Loader'
import PlaceholderMessage from '../components/Placeholder/Message'
import usersAPI from '../apis/users'
import { Toast } from '../utils/helpers'

export default {
  components: {
    UserNavbar,
    UserProfileCard,
    OrderNavPill,
    OrderCard,
    PlaceholderMessage,
    Footer,
    Loader
  },
  data () {
    return {
      orders: [],
      currentPage: 0,
      currentStatus: '',
      totalPage: null,
      isLoading: true,
      isProcessing: false
    }
  },
  created () {
    const { order_status: status = 'today' } = this.$route.query
    this.currentStatus = status
    this.fetchOrders(status, this.currentPage + 1)
  },
  beforeRouteUpdate (to, from, next) {
    // Reset  page
    this.currentPage = 0
    this.totalPage = null
    // clear existing orders
    this.orders = []
    // get the status
    const { order_status: status = 'today' } = to.query
    // update current status
    this.currentStatus = status
    this.fetchOrders(status, this.currentPage + 1)
    next()
  },
  methods: {
    async fetchOrders (status, page) {
      try {
        // update processing status
        this.isProcessing = true
        // fetch order data
        const { data, statusText } = await usersAPI.getOrders({ status, page })
        // error handling
        if (statusText !== 'OK' || data.status !== 'success') throw new Error(data.message)
        // fetch order from API
        this.orders = [
          ...this.orders,
          ...data.orders
        ]
        this.totalPage = data.pages
        this.currentPage += 1
        // update loading status
        this.isLoading = false
        // update processing status
        this.isProcessing = false
      } catch (error) {
        // update loading status
        this.isLoading = false
        // update processing status
        this.isProcessing = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法取得訂單資料，請稍後再試'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@include slideAnimation;
@include fadeAnimation;

.order {
  &-container {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    height: 100%;
  }

  &-wrapper { margin-top: 62px; }

  &-display {
    &-wrapper {
      background-color: color(quaternary);
    }

    &-divider {
      width: 100%;
      margin-top: 0;
    }
  }
}

.btn-container {
  text-align: center;
  .btn {
    @include solidButton(100, 1, secondary);
    padding: .2rem 0;

    @include response(md) {
      min-width: 150px;
      padding: .25em 0;
    }
  }
}
</style>
