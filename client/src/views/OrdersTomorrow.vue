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
          :image-description="banner.description"
        >
          <template v-slot:header>
            <h1 class="banner-content-title">
              明日餐點
            </h1>
            <h3 class="banner-content-description">
              午餐免煩惱
            </h3>
          </template>
        </ImageHeaderBanner>
      </header>
    </transition>
    <!--Order Section-->
    <transition name="slide">
      <section
        v-if="!isLoading"
        class="order-wrapper"
      >
        <div
          class="container order-container"
        >
          <div
            class="row order-content align-items-stretch"
          >
            <div
              v-for="meal in [lunch, dinner]"
              :key="meal.indicator"
              class="col-12 col-md-6 col-lg-5 mb-4 order-card"
            >
              <MealVerticalCard
                v-if="Object.keys(meal.order).length && !meal.isCommingSoon"
                :is-loading="isLoading"
                :order="meal.order"
              >
                <template v-slot:indicator>
                  <span class="card-indicator">{{ meal.indicator }}</span>
                </template>
                <template v-slot:footer>
                  <router-link
                    :to="{name: 'order', params: {order_id: meal.order.id}}"
                    class="btn"
                  >
                    查看訂單
                  </router-link>
                </template>
              </MealVerticalCard>
              <NewOrderCard
                v-else
                :style="formOrderCardBgStyle(meal)"
              >
                <template
                  v-if="!meal.isCommingSoon"
                  v-slot:content
                >
                  <h5 class="card-title">
                    <span class="card-indicator">{{ meal.indicator }}餐</span>
                  </h5>
                  <router-link
                    v-if="currentUser.subscriptionBalance > 0"
                    :to="{name: 'order-new'}"
                    class="btn"
                  >
                    訂購
                  </router-link>
                  <span
                    v-else
                    class="card-warning"
                  ><i class="far fa-surprise mr-1" />無餘額囉</span>
                </template>
                <template
                  v-else
                  v-slot:content
                >
                  <h5 class="card-title text-center">
                    <i class="fas fa-glass-cheers" />
                    <span class="card-indicator d-block">Comming Soon</span>
                  </h5>
                </template>
              </NewOrderCard>
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
import MealVerticalCard from '../components/Card/MealVerticalCard'
import NewOrderCard from '../components/Card/NewOrderCard'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import usersAPI from '../apis/users'
import { formFullUrl, BANNER_PLACEHOLDER_RELATIVE_URL } from '../utils/image-url'
import { Toast } from '../utils/helpers'
import { mapState } from 'vuex'

export default {
  components: {
    UserNavbar,
    ImageHeaderBanner,
    MealVerticalCard,
    NewOrderCard,
    Footer,
    Loader
  },
  data () {
    return {
      banner: {
        image: BANNER_PLACEHOLDER_RELATIVE_URL,
        height: 550,
        description: '明日餐點頁面水果優格封面照'
      },
      lunch: {
        indicator: '午',
        isCommingSoon: false,
        order: {}
      },
      dinner: {
        indicator: '晚',
        isCommingSoon: true,
        order: {}
      },
      image: {
        order: formFullUrl('/Banner/neworder.jpg'),
        commingSoon: formFullUrl('/Banner/upcoming.jpeg')
      },
      isLoading: true
    }
  },
  computed: {
    ...mapState(['currentUser'])
  },
  created () {
    this.fetchOrders()
  },
  methods: {
    async fetchOrders () {
      try {
        // fetch order data
        const { data, statusText } = await usersAPI.getOrdersTomorrow()
        // error handling
        if (statusText !== 'OK' || data.status !== 'success') throw new Error(data.message)
        // store order data if order exists
        if (data.order.length > 0) {
          const { id: lunchOrderId, meals: [{ Restaurant: lunchRestaurant, ...lunchMeal }] } = data.order[0]
          this.lunch.order = { id: lunchOrderId, restaurant: lunchRestaurant, meal: lunchMeal }
        }
        // update loading status
        this.isLoading = false
      } catch (error) {
        // update loading status
        this.isLoading = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法取得餐點資料，請稍後再試'
        })
      }
    },
    formOrderCardBgStyle (meal) {
      const { order, commingSoon } = this.image
      const imageUrl = !meal.isCommingSoon ? order : commingSoon
      return { backgroundImage: `url(${imageUrl})` }
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

  &-card {
    &:first-child {
      @include response(lg) {
        margin-left: 8.333333%;
      }
    }
  }
}
</style>
