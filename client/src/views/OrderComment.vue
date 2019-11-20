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
              餐點評論
            </h1>
            <h3
              class="banner-content-description"
            >
              提供您對餐點的想法
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
            <OrderCommentForm
              class="order-display mt-3"
            />
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
import OrderCommentForm from '../components/OrderCommentForm'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import orderApi from '../apis/order'
import { Toast } from '../utils/helpers'

export default {
  components: {
    UserNavbar,
    ImageHeaderBanner,
    MealHorizontalCard,
    OrderCommentForm,
    Footer,
    Loader
  },
  data () {
    return {
      banner: {
        image: 'https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        height: 550
      },
      order: {},
      isLoading: true
    }
  },
  created () {
    const { order_id: orderId } = this.$route.params
    this.fetchOrder(orderId)
  },
  methods: {
    async fetchOrder (orderId) {
      try {
        // fetch order data from API
        const { data, statusText } = await orderApi.getComment({ orderId })
        // error handling
        if (statusText !== 'OK' || data.status !== 'success') throw new Error(data.message)
        // retrieve data
        const { order: { meals: { Restaurant: restaurant, ...meal } } } = data
        // save data
        this.order = { ...this.order, restaurant, meal }
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
        // redirect back
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
