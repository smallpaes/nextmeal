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
            明日餐點
          </h1>
          <h3 class="banner-content-description">
            午餐免煩惱
          </h3>
        </template>
      </ImageHeaderBanner>
    </header>
    <section class="order-wrapper">
      <div class="container order-container">
        <div class="row order-content align-items-stretch">
          <div
            v-for="meal in [lunch, dinner]"
            :key="meal.indicator"
            class="col-12 col-md-6 col-lg-5 mb-4 order-card"
          >
            <MealVerticalCard
              v-if="Object.keys(meal.order).length && !meal.isCommingSoon"
              :order="meal.order"
            >
              <template v-slot:indicator>
                <span class="card-indicator">{{ meal.indicator }}</span>
              </template>
            </MealVerticalCard>
            <NewOrderCard
              v-else
              :style="{backgroundImage: !meal.isCommingSoon ? `url(${image.order})` : `url(${image.commingSoon})`}"
            >
              <template
                v-if="!meal.isCommingSoon"
                v-slot:content
              >
                <h5 class="card-title">
                  <span class="card-indicator">{{ meal.indicator }}餐</span>
                </h5>
                <router-link
                  :to="{name: 'order-new'}"
                  class="btn"
                >
                  訂購
                </router-link>
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
    <Footer />
  </section>
</template>

<script>
import Navbar from '../components/Navbar'
import ImageHeaderBanner from '../components/Banner/ImageHeaderBanner'
import MealVerticalCard from '../components/Card/MealVerticalCard'
import NewOrderCard from '../components/Card/NewOrderCard'
import Footer from '../components/Footer'

const dummyOrders = [
  {
    id: 1,
    meal: {
      name: '宮保雞丁套餐',
      description: '祖傳 90 年四川辣椒大火快炒放山雞，搭配健康糙米飯與新竹貢丸攤。午餐另外附贈知名淡水阿婆酸梅湯，幫助餐後解膩！祖傳 90 年四川辣椒大火快炒放山雞，搭配健康糙米飯與新竹貢丸攤。午餐另外附贈知名淡',
      image: 'https://images.pexels.com/photos/1860204/pexels-photo-1860204.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      restaurant: {
        id: 2,
        name: '四川家鄉菜',
        rating: 4.4
      }
    }
  }
]

export default {
  components: {
    Navbar,
    ImageHeaderBanner,
    MealVerticalCard,
    NewOrderCard,
    Footer
  },
  data () {
    return {
      banner: {
        image: 'https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        height: 450
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
        order: 'https://cdn.pixabay.com/photo/2017/06/11/17/03/dumplings-2392893_1280.jpg',
        commingSoon: 'https://images.unsplash.com/photo-1549409466-c6449df8e23b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=4000&q=80'
      }
    }
  },
  created () {
    this.fetchOrders()
  },
  methods: {
    fetchOrders () {
      // fetch order data from API
      const { id: lunchOrderId, meal: { restaurant: lunchRestaurant, ...lunchMeal } } = dummyOrders[0]
      this.lunch.order = { id: lunchOrderId, restaurant: lunchRestaurant, meal: lunchMeal }

      // upcoming dinner order
      //   const { id: dinnerOrderId, meal: { restaurant: dinnerRestaurant, ...dinnerMeal } } = dummyOrders[1]
      //   this.dinner.order = { id: dinnerOrderId, restaurant: dinnerRestaurant, meal: dinnerMeal }
    }
  }
}
</script>

<style lang="scss" scoped>
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
