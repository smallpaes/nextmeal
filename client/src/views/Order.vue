<template>
  <section>
    <!--Navbar-->
    <UserNavbar />
    <!--Loader-->
    <Loader
      v-if="isLoading"
      :height="'100vh'"
    />
    <!--Header-->
    <transition name="fade">
      <header v-if="!isLoading">
        <ImageHeaderBanner
          :background-photo="banner.image"
          :banner-height="banner.height"
        >
          <template v-slot:header>
            <h1 class="banner-content-title">
              訂單憑證
            </h1>
            <h3
              class="banner-content-description"
            >
              訂單與領餐資訊
            </h3>
          </template>
        </ImageHeaderBanner>
      </header>
    </transition>
    <!--Order Detail-->
    <transition name="slide">
      <section
        v-if="!isLoading"
        class="order-wrapper"
      >
        <div class="container order-container">
          <div
            class="row order-content p-3"
          >
            <MealHorizontalCard
              :order="order"
              class="order-display"
            />
            <OrderDetail
              :order="order.orderDetail"
              class="order-display mt-3"
            />
            <OrderRestaurantDetail
              :restaurant="order.restaurant"
              class="order-display mt-3"
            />

            <!--Show buttons when it's tomorrow's order -->
            <div
              v-if="order.isEditable"
              class="btn-container text-center mt-4"
            >
              <router-link
                class="btn btn-edit"
                :to="{name: 'order-edit', params: {order_id: $route.params.order_id}}"
              >
                編輯訂單
              </router-link>

              <button
                class="btn btn-cancel"
                type="button"
                :disabled="isProcessing"
                @click.stop.prevent="deleteOrder"
              >
                取消訂單
              </button>
            </div>
          </div>
        </div>
      </section>
    </transition>
    <!--Footer-->
    <transition name="fade">
      <Footer v-if="!isLoading" />
    </transition>
  </section>
</template>

<script>
import UserNavbar from '../components/Navbar/UserNavbar'
import ImageHeaderBanner from '../components/Banner/ImageHeaderBanner'
import MealHorizontalCard from '../components/Card/MealHorizontalCard'
import OrderDetail from '../components/OrderDetail'
import OrderRestaurantDetail from '../components/OrderRestaurantDetail'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import orderAPI from '../apis/order'
import { Toast } from '../utils/helpers'
import moment from 'moment'

export default {
  components: {
    UserNavbar,
    ImageHeaderBanner,
    MealHorizontalCard,
    OrderDetail,
    OrderRestaurantDetail,
    Footer,
    Loader
  },
  data () {
    return {
      banner: {
        image: 'https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        height: 550
      },
      order: {
        restaurant: {
          name: '',
          rating: -1,
          distance: -1,
          lat: -1,
          lng: -1
        },
        meal: {
          id: -1,
          name: '',
          description: '',
          image: '',
          quantity: -1
        },
        orderDetail: {
          time: '',
          date: ''
        },
        isEditable: false
      },
      isLoading: true,
      isProcessing: false
    }
  },
  beforeRouteUpdate (to, from, next) {
    const { order_id: orderId } = to.params
    this.fetchOrder(orderId)
    next()
  },
  created () {
    const { order_id: orderId } = this.$route.params
    this.fetchOrder(orderId)
  },
  methods: {
    async fetchOrder (orderId) {
      try {
        // fetch order data from API
        const { data, statusText } = await orderAPI.getOrder({ orderId })
        // error handling
        if (statusText !== 'OK' || data.status !== 'success') throw new Error(data.message)

        // retrieve data
        const { meals: { Restaurant: restaurant, OrderItem, ...meal }, require_date: requireDate, order_status: orderStatus } = data.order
        // save data
        this.order = {
          ...this.order,
          restaurant,
          meal,
          orderDetail: {
            ...OrderItem,
            time: moment(new Date(requireDate)).format('HH:mm'),
            date: moment(new Date(requireDate)).format('YYYY-MM-DD')
          },
          isEditable: orderStatus === '明日'
        }
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
        // redirect back to last page
        this.$router.go(-1)
      }
    },
    async deleteOrder () {
      try {
        // update processing status
        this.isProcessing = true
        // cancel order
        const { data, statusText } = await orderAPI.putCancelOrder({ orderId: this.$route.params.order_id })
        // error handling
        if (statusText !== 'OK' || data.status !== 'success') throw new Error(data.message)
        // update subscription balance to Vuex
        const quantity = this.order.orderDetail.quantity
        this.$store.commit('updateBalance', quantity)
        // redirect back to /user/order/tomorrow
        this.$router.push({ name: 'order-tomorrow' })
      } catch (error) {
        // update processing status
        this.isProcessing = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法取消資料，請稍後再試'
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
  &-content {
  position: relative;
  top: -7rem;
  }

  &-display {
  margin: 0 auto;
  max-width: 760px;
  }
}

.btn-container {
  width: 100%;
  .btn {
    margin-left: .8rem;
    padding: 0;
    line-height: 1.8rem;
    font-size: size(xs);

    &-edit {
      @include solidButton(80, .3, tertiary);
    }

    &-cancel {
      @include solidButton(80, .3, primary);
    }

    @include response(md) {
      min-width: 130px;
      padding: .1rem 0;
      margin-left: 1rem;
      font-size: size(sm);
    }
  }
}
</style>
