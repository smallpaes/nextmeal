<template>
  <section>
    <header>
      <UserNavbar />
      <DropdownBanner
        :is-loading="isLoading"
        :districts="districts"
        :current-district="currentDistrict"
      />
    </header>
    <section class="popular">
      <div class="container pt-3 pb-0 pb-md-5">
        <Header>
          <template v-slot:title>
            熱門餐廳
          </template>
          <template v-slot:description>
            嘗試最受歡迎的餐廳
          </template>
        </Header>
        <CustomCarousel
          :is-loading="isLoading"
          :popular-restaurants="popular_restaurants"
        />
      </div>
    </section>
    <section class="restaurants">
      <div class="container pt-3 pb-5">
        <Header>
          <template v-slot:title>
            更多選擇
          </template>
          <template v-slot:description>
            探索更多在地餐廳
          </template>
        </Header>
        <div class="card-wrapper row px-3">
          <template v-if="!isLoading">
            <div
              v-for="restaurant in more_restaurants.restaurants"
              :key="restaurant.id"
              class="col-12 col-md-6 col-lg-4 p-2"
            >
              <RestaurantCard :restaurant="restaurant" />
            </div>
          </template>
          <template v-if="isLoading || isFetching">
            <div
              v-for="index in 6"
              :key="index"
              class="col-12 col-md-6 col-lg-4 p-2"
            >
              <RestaurantCard :is-loading="isLoading || isFetching" />
            </div>
          </template>
        </div>
        <div
          v-if="!isLoading"
          class="btn-container"
        >
          <button
            v-if="currentPage !== totalPage"
            class="btn mt-3"
            href="#"
            @click="fetchRestaurants(currentDistrict, currentPage + 1); isFetching = true"
          >
            瀏覽更多
          </button>
        </div>
      </div>
    </section>
    <section class="map bg-white">
      <div class="container pt-3 pb-5">
        <Header>
          <template v-slot:title>
            {{ currentDistrict }}餐廳
          </template>
          <template v-slot:description>
            探索最近的美食地圖
          </template>
        </Header>
        <SkelentonBox
          v-if="isLoading"
          :width="'100%'"
          :height="'400px'"
        />
        <GMap
          v-else
          :center="{lat: parseFloat(map.center.lat), lng: parseFloat(map.center.lng)}"
          :locations="map.restaurants"
          :street-view-control="false"
          :map-type-control="false"
          :fullscreen-control="true"
          :zoom-control="true"
          class="shadow-sm rounded-sm"
        />
      </div>
    </section>
    <Footer />
  </section>
</template>

<script>
import UserNavbar from '../components/Navbar/UserNavbar'
import Footer from '../components/Footer'
import DropdownBanner from '../components/Banner/DropdownBanner'
import CustomCarousel from '../components/CustomCarousel'
import RestaurantCard from '../components/RestaurantCard'
import GMap from '../components/GMap'
import Header from '../components/Header'
import restaurantsAPI from '../apis/restaurants'
import SkelentonBox from '../components/Placeholder/SkeletonBox'
import { Toast } from '../utils/helpers'

export default {
  components: {
    UserNavbar,
    Footer,
    DropdownBanner,
    CustomCarousel,
    RestaurantCard,
    GMap,
    Header,
    SkelentonBox
  },
  data () {
    return {
      popular_restaurants: [],
      more_restaurants: {
        restaurants: []
      },
      map: {},
      districts: [],
      currentDistrict: '',
      currentPage: 0,
      totalPage: null,
      isLoading: true,
      isFetching: false
    }
  },
  created () {
    const { dist } = this.$route.query
    this.currentDistrict = dist || '信義區'
    this.fetchRestaurants(dist, this.currentPage + 1)
  },
  beforeRouteUpdate (to, from, next) {
    // Reset current page
    this.currentPage = 0
    // Clear existing restaurants
    this.more_restaurants.restaurants = []
    // clear districts
    this.districts = []
    // Get the district name
    const { dist } = to.query
    this.currentDistrict = dist || '信義區'
    // update loading status
    this.isLoading = true
    // Refetch the restaurant data
    this.fetchRestaurants(dist, this.currentPage + 1)
    next()
  },
  methods: {
    async fetchRestaurants (dist, page) {
      try {
        // fetch data from API
        const { data, statusText } = await restaurantsAPI.getRestaurants({ dist, page })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)

        // fetch data from api
        this.popular_restaurants = data.popular_restaurants || this.popular_restaurants
        this.more_restaurants.restaurants = [
          ...this.more_restaurants.restaurants,
          ...data.more_restaurants.restaurants
        ]
        this.totalPage = data.more_restaurants.pages

        this.map = data.map || this.map
        this.districts = data.districts || this.districts
        // update current page number
        this.currentPage += 1
        this.isLoading = false
        this.isFetching = false
      } catch (error) {
        // update loading status
        this.isLoading = false
        // update fetching status
        this.isFetching = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法取得餐廳資料，請稍後再試'
        })
        // rediect back to home page
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.google-map {
  width: 100%;
  height: 400px;
}

.btn-container {
  text-align: center;
  .btn {
    @include buttonOutline;
  }
}
</style>
