<template>
  <section v-if="!isLoading">
    <header>
      <Navbar />
      <ImageHeaderBanner :background-photo="bannerImage">
        <template v-slot:header>
          <h1 class="banner-content-title">
            吃飯免煩惱
          </h1>
          <h3 class="banner-content-description">
            午餐不到 100 元
          </h3>
          <router-link
            :to="{name: 'signup'}"
            class="btn mt-2"
          >
            體驗看看
          </router-link>
        </template>
      </ImageHeaderBanner>
      <OrderProcess @learn-more="handleLearMore" />
    </header>
    <section class="popular">
      <div class="container pt-3 pb-5">
        <div class="popular-heading">
          <h1 class="popular-heading-title">
            熱門餐廳
          </h1>
          <p class="popular-heading-description">
            嘗試最受歡迎的餐廳
          </p>
        </div>
        <RestaurantCarousel :popular-restaurants="popularRestaurants" />
      </div>
    </section>
    <section class="districts">
      <div class="container pt-3 pb-5">
        <div class="districts-heading">
          <h1 class="districts-heading-title">
            熱門地區
          </h1>
          <p class="districts-heading-description">
            探索各地區熱門美食
          </p>
        </div>
        <Districts :districts="districts" />
      </div>
    </section>
    <Questions ref="question" />
    <Footer />
  </section>
</template>

<script>
import Navbar from '../components/Navbar'
import ImageHeaderBanner from '../components/Banner/ImageHeaderBanner'
import OrderProcess from '../components/OrderProcess'
import RestaurantCarousel from '../components/RestaurantCarousel'
import Districts from '../components/Districts'
import Questions from '../components/Questions'
import Footer from '../components/Footer'
import restaurantsAPI from '../apis/restaurants'
import { Toast } from '../utils/helpers'

export default {
  name: 'Home',
  components: {
    Navbar,
    ImageHeaderBanner,
    OrderProcess,
    RestaurantCarousel,
    Districts,
    Questions,
    Footer
  },
  data () {
    return {
      popularRestaurants: [],
      districts: [],
      isLoading: true,
      bannerImage: 'https://images.pexels.com/photos/929192/pexels-photo-929192.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    }
  },
  created () {
    this.fetchRestaurantAndDistrict()
  },
  methods: {
    async fetchRestaurantAndDistrict () {
      try {
        // fetch data from API
        const { data, statusText } = await restaurantsAPI.getHome()
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') {
          throw new Error(data.message)
        }

        // store data
        this.popularRestaurants = data.popular_restaurants
        this.districts = data.districts

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
      }
    },
    handleLearMore () {
      // get Q&A section position
      const question = this.$refs.question.$el
      const top = question.offsetTop
      // scroll to is currently not supported in IE, Edge, Safari
      window.scrollTo({ top: top, behavior: 'smooth' })
    }
  }
}
</script>

<style lang="scss" scoped>
.popular {
    @include headingStyling;
    &-heading {
      text-align: center;
    }
}
.districts {
  @include headingStyling;
    &-heading {
      text-align: center;
    }
}
</style>
