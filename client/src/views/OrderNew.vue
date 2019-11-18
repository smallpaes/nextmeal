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
              訂購餐點
            </h1>
            <h3
              v-if="isChoosingMeal"
              class="banner-content-description"
            >
              餐點二選一
            </h3>
            <h3
              v-else
              class="banner-content-description"
            >
              選擇數量與領餐時間
            </h3>
          </template>
        </ImageHeaderBanner>
      </header>
    </transition>

    <transition
      name="slide"
      mode="out-in"
    >
      <!--Display two meal options-->
      <section
        v-if="isChoosingMeal && !isLoading"
        key="meals"
        class="meal-wrapper"
      >
        <div class="container meal-container">
          <div
            class="row meal-content align-items-stretch"
          >
            <div
              v-for="index in 2"
              :key="index"
              class="col-12 col-md-6 col-lg-5 mb-4 meal-card"
            >
              <!--Display meal-->
              <MealVerticalCard
                v-if="meals[index - 1]"
                :order="meals[index - 1]"
              >
                <template v-slot:footer>
                  <button
                    class="btn"
                    type="button"
                    @click.stop.prevent="handleOrder(meals[index - 1])"
                  >
                    訂購餐點
                  </button>
                </template>
                <template v-slot:distance>
                  ({{ meals[index - 1].restaurant.distance }}公尺)
                </template>
              </MealVerticalCard>
              <!--Display warning message-->
              <NewOrderCard
                v-else
                :style="{backgroundImage: `url(${image})`}"
              >
                <template
                  v-slot:content
                >
                  <h5 class="card-title">
                    <span class="card-indicator">附近無其他美食</span>
                  </h5>
                  <router-link
                    :to="{name: 'user-profile'}"
                    class="btn"
                  >
                    改地點
                  </router-link>
                </template>
              </NewOrderCard>
            </div>
          </div>
        </div>
      </section>
      <!--Display order form-->
      <section
        v-if="!isChoosingMeal"
        key="form"
        class="order-wrapper"
      >
        <div class="container order-container">
          <div
            class="row order-content p-3"
          >
            <MealHorizontalCard
              :order="chosenMeal"
              class="order-display"
            />
            <OrderForm
              class="order-display mt-3"
              :order-info="{quantity: chosenMeal.meal.quantity, timeSlots: chosenMeal.timeSlots}"
              :initial-processing="isProcessing"
              :current-user="currentUser"
              @change-order="isChoosingMeal = true"
              @after-submit="handleAfterSubmit"
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
import MealVerticalCard from '../components/Card/MealVerticalCard'
import MealHorizontalCard from '../components/Card/MealHorizontalCard'
import NewOrderCard from '../components/Card/NewOrderCard'
import OrderForm from '../components/OrderForm'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import orderAPI from '../apis/order'
import { Toast } from '../utils/helpers'
import { mapState } from 'vuex'

export default {
  components: {
    UserNavbar,
    ImageHeaderBanner,
    MealVerticalCard,
    NewOrderCard,
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
      meals: [],
      isChoosingMeal: true,
      chosenMeal: null,
      isLoading: true,
      isProcessing: false,
      image: 'https://cdn.pixabay.com/photo/2017/06/11/17/03/dumplings-2392893_1280.jpg'
    }
  },
  computed: {
    ...mapState(['currentUser'])
  },
  created () {
    this.fetchMeals()
  },
  methods: {
    async fetchMeals () {
      try {
        // fetch meal data from API
        const { data, statusText } = await orderAPI.getNewOrder()
        // error handling
        if (statusText !== 'OK' || data.status !== 'success') throw new Error(data.message)
        // store data
        this.meals = data.restaurants.map(mealData => {
          const { Meals: meal, time_slots: timeSlots, ...restaurant } = mealData
          return { meal, timeSlots, restaurant }
        })
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
        // redirect back to order tomorrow page
        this.$router.push({ name: 'order-tomorrow' })
      }
    },
    async handleOrder (mealItem) {
      this.isChoosingMeal = false
      this.chosenMeal = mealItem
    },
    async handleAfterSubmit (formData) {
      try {
        // prepare form data
        const form = { ...formData, meal_id: this.chosenMeal.meal.id }
        // create new order
        const { data, statusText } = await orderAPI.postNewOrder(form)
        // error handling
        if (statusText !== 'OK' || data.status !== 'success') throw new Error(data.message)
        // update balance to Vuex
        const quantity = formData.quantity * (-1)
        this.$store.commit('updateBalance', quantity)
        // redirect to order detail page
        this.$router.push({ name: 'order', params: { order_id: data.order_id } })
      } catch (error) {
        // update loading status
        this.isProcessing = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法成功訂餐，請稍後再試'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@include slideAnimation;
@include fadeAnimation;

.meal {
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
