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
              編輯餐點
            </h1>
            <h3
              class="banner-content-description"
            >
              更改數量或領餐時間
            </h3>
          </template>
        </ImageHeaderBanner>
      </header>
    </transition>
    <!--Display order form-->
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
            <OrderForm
              class="order-display mt-3"
              :order-info="{quantity: order.meal.quantity + order.orderData.quantity, timeSlots: order.timeSlots}"
              :initial-order="order.orderData"
              :initial-processing="isProcessing"
              :current-user="currentUser"
              @to-last-page="$router.go(-1)"
              @after-submit="handleAfterSubmit"
            >
              <template #submit>
                更新訂單
              </template>
            </OrderForm>
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
import OrderForm from '../components/OrderForm'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import orderAPI from '../apis/order'
import { Toast } from '../utils/helpers'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  components: {
    UserNavbar,
    ImageHeaderBanner,
    MealHorizontalCard,
    OrderForm,
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
          rating: -1
        },
        meal: {
          name: '',
          description: '',
          image: '',
          quantity: -1
        },
        orderData: {
          quantity: -1,
          time: ''
        },
        timeSlots: []
      },
      isLoading: true,
      isProcessing: false
    }
  },
  computed: {
    ...mapState(['currentUser'])
  },
  created () {
    const { order_id: orderId } = this.$route.params
    this.fetchOrder(orderId)
  },
  methods: {
    async fetchOrder (orderId) {
      try {
        // fetch order data from API
        const { data, statusText } = await orderAPI.getEditOrder({ orderId })
        // error handling
        if (statusText !== 'OK' || data.status !== 'success') throw new Error(data.message)
        // retrieve data
        const { order: { meals: { Restaurant: restaurant, ...meal }, amount: quantity, require_date: requireDate }, time_slots: timeSlots } = data
        const orderData = {
          quantity,
          time: moment(new Date(requireDate)).format('HH:mm')
        }

        // save data
        this.order = { ...this.order, restaurant, meal, orderData, timeSlots }
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
        // redirect back to order tomorrow page
        this.$router.push({ name: 'order-tomorrow' })
      }
    },
    async handleAfterSubmit (formData) {
      try {
        // send updated order data
        const { data, statusText } = await orderAPI.putEditOrder({ orderId: this.$route.params.order_id, formData })
        // error handling
        if (statusText !== 'OK' || data.status !== 'success') throw new Error(data.message)
        // update balance to Vuex
        const quantity = this.order.orderData.quantity - formData.quantity
        this.$store.commit('updateBalance', quantity)
        // redirect to order detail pageasx
        this.$router.push({ name: 'order', params: { order_id: this.$route.params.order_id } })
      } catch (error) {
        // update loading status
        this.isProcessing = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法更新訂購資料，請稍後再試'
        })
        // redirect back to last page
        this.$router.go(-1)
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
    max-width: 760px;
    margin: 0 auto;
  }
}
</style>
