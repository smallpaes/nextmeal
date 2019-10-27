<template>
  <section>
    <header>
      <Navbar />
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
    <!--Display two meal options-->
    <section
      v-if="isChoosingMeal"
      class="meal-wrapper"
    >
      <div class="container meal-container">
        <div
          class="row meal-content align-items-stretch"
        >
          <div
            v-for="mealItem in meals"
            :key="mealItem.meal.id"
            class="col-12 col-md-6 col-lg-5 mb-4 meal-card"
          >
            <MealVerticalCard
              :order="mealItem"
            >
              <template v-slot:footer>
                <button
                  class="btn"
                  type="button"
                  @click.stop.prevent="handleOrder(mealItem)"
                >
                  訂購餐點
                </button>
              </template>
            </MealVerticalCard>
          </div>
        </div>
      </div>
    </section>
    <!--Display order form-->
    <section
      v-if="!isChoosingMeal"
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
            @change-order="isChoosingMeal = true"
            @after-submit="handleAfterSubmit"
          />
        </div>
      </div>
    </section>
    <Footer />
  </section>
</template>

<script>
import Navbar from '../components/Navbar'
import ImageHeaderBanner from '../components/Banner/ImageHeaderBanner'
import MealVerticalCard from '../components/Card/MealVerticalCard'
import MealHorizontalCard from '../components/Card/MealHorizontalCard'
import OrderForm from '../components/OrderForm'
import Footer from '../components/Footer'

const dummyMeals = [
  {
    id: 1,
    name: '美國家鄉菜',
    rating: 4.8,
    distance: 220,
    Meals: {
      id: 2,
      name: '巨無霸套餐',
      description: '來自德州的巨無霸牛肉漢堡與特製醬料，搭配據杯可樂與現削現炸地瓜薯條，滿足你的味蕾',
      image: 'https://images.pexels.com/photos/2454533/pexels-photo-2454533.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      quantity: 20 },
    time_slots: ['11:00', '11:30', '12:00', '12:30', '13:00']
  },
  {
    id: 2,
    name: '四川家鄉菜',
    rating: 4.4,
    distance: 300,
    Meals: {
      id: 1,
      name: '宮保雞丁套餐',
      description: '祖傳90年四川辣椒大火快炒放山雞,搭配健康糙米飯與新竹貢丸攤,午餐另外附贈知名淡水阿婆酸梅湯,幫助餐後解膩!祖傳90年四川辣椒大火快炒放山雞,搭配健康糙米飯與新竹貢丸攤!午餐另外附贈知名淡',
      image: 'https://images.pexels.com/photos/1860204/pexels-photo-1860204.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      quantity: 50 },
    time_slots: ['11:00', '11:30', '12:00', '12:30', '13:00', '13:30']
  }
]

export default {
  components: {
    Navbar,
    ImageHeaderBanner,
    MealVerticalCard,
    MealHorizontalCard,
    OrderForm,
    Footer
  },
  data () {
    return {
      banner: {
        image: 'https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        height: 450
      },
      meals: [],
      isChoosingMeal: true,
      chosenMeal: null
    }
  },
  created () {
    this.fetchMeals()
  },
  methods: {
    fetchMeals () {
      // fetch meal data from API

      this.meals = dummyMeals.map(mealData => {
        const { Meals: meal, time_slots: timeSlots, ...restaurant } = mealData
        return { meal, timeSlots, restaurant }
      })
    },
    handleOrder (mealItem) {
      this.isChoosingMeal = false
      this.chosenMeal = mealItem
    },
    handleAfterSubmit (formData) {
      // POST to /api/order/new
      const form = { ...formData, meal_id: this.chosenMeal.meal.id }
      console.log(form)
      // redirect to order detail page
      this.$router.push({ name: 'order', params: { order_id: 1 } })
    }
  }
}
</script>

<style lang="scss" scoped>
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
    margin: 0 auto;
    max-width: 760px;
  }
}
</style>
