<template>
  <section class="order-container">
    <header>
      <UserNavbar />
    </header>
    <section class="container pt-4 pb-4 w-100">
      <div class="order-wrapper row profil">
        <div class="order-profile col-12 col-md-3 p-2">
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
            <PlaceholderMessage v-if="orders.length===0">
              <i class="fas fa-utensils mr-2" />目前沒有訂單
            </PlaceholderMessage>
            <div
              v-if="totalPage > 0 && currentPage !== totalPage"
              class="btn-container"
            >
              <button
                class="btn"
                href="#"
                @click="fetchOrders(status, currentPage + 1)"
              >
                瀏覽更多
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer class="w-100" />
  </section>
</template>

<script>
import UserNavbar from '../components/Navbar/UserNavbar'
import Footer from '../components/Footer'
import OrderNavPill from '../components/Navbar/OrderNavPill'
import OrderCard from '../components/Card/OrderCard'
import UserProfileCard from '../components/UserProfileCard'
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
    Footer
  },
  data () {
    return {
      orders: [],
      currentPage: 0,
      currentStatus: '',
      totalPage: null,
      isLoading: true
    }
  },
  created () {
    const { order_status: status = 'today' } = this.$route.query
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
    this.fetchOrders(status, this.currentPage + 1)
    next()
  },
  methods: {
    async fetchOrders (status, page) {
      try {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.order {
    &-container {
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
        height: 100%;
    }

    &-wrapper {
        margin-top: 62px;
    }

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
