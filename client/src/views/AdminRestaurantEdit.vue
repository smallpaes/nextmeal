<template>
  <section class="wrapper d-flex vh-100">
    <!--Left Side Navbar-->
    <AdminSideNavBar :nav-is-open="navIsOpen" />

    <!--Right Side Content-->
    <section class="restaurant flex-fill">
      <!--Navbar toggler-->
      <NavbarToggler
        :nav-is-open="navIsOpen"
        @toggle-navbar="navIsOpen = !navIsOpen"
      />
      <h1 class="restaurant-title">
        編輯餐廳
      </h1>
      <hr class="restaurant-divider">

      <!--Loader-->
      <Loader
        v-if="isLoading"
        :height="'300px'"
      />

      <!--Restaurant Edit Form-->
      <transition
        name="slide"
      >
        <RestaurantInfoForm
          v-if="!isLoading"
          class="restaurant-form"
          :initial-restaurant="restaurant"
          :categories="categories"
          :initial-processing="isProcessing"
          @after-submit="updateRestaurant"
          @after-delete="deleteRestaurant"
        />
      </transition>
    </section>
  </section>
</template>

<script>
import AdminSideNavBar from '../components/Navbar/AdminSideNavBar'
import NavbarToggler from '../components/Navbar/NavbarToggler'
import RestaurantInfoForm from '../components/RestaurantInfoForm'
import Loader from '../components/Loader'
import adminAPI from '../apis/admin'
import { Toast } from '../utils/helpers'

export default {
  components: {
    AdminSideNavBar,
    NavbarToggler,
    RestaurantInfoForm,
    Loader
  },
  data () {
    return {
      restaurant: {},
      categories: [],
      isLoading: true,
      isProcessing: false,
      navIsOpen: false
    }
  },
  created () {
    const { restaurant_id: restaurantId } = this.$route.params
    this.fetchRestaurantData(restaurantId)
  },
  beforeRouteUpdate (to, from, next) {
    const { restaurant_id: restaurantId } = to.params
    this.fetchRestaurantData(restaurantId)
    next()
  },
  methods: {
    async fetchRestaurantData (restaurantId) {
      try {
        const { data, statusText } = await adminAPI.restaurants.getRestaurant({ restaurantId })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)

        // retrieve data
        const {
          restaurant: { opening_hour: openingHour, closing_hour: closingHour, ...restData },
          categories
        } = data

        // save data
        this.restaurant = {
          ...this.restaurant,
          openingHour,
          closingHour,
          ...restData
        }
        this.categories = categories
        this.hasRestaurantData = true

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
        // rediect back to last page
        this.$router.go(-1)
      }
    },
    async updateRestaurant (formData) {
      try {
        // update processing status
        this.isProcessing = true

        const { restaurant_id: restaurantId } = this.$route.params

        // admin page
        const { data, statusText } = await adminAPI.restaurants.putRestaurant({ restaurantId, formData })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        this.$router.push('/admin')
      } catch (error) {
        // update processing status
        this.isProcessing = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法更新資料，請稍後再試'
        })
      }
    },
    async deleteRestaurant () {
      const { restaurant_id: restaurantId } = this.$route.params
      try {
        // update processing status
        this.isProcessing = true
        // delete restaurant
        const { data, statusText } = await adminAPI.restaurants.deleteRestaurant({ restaurantId })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // redirect to admin restaurant page
        this.$router.push('/admin')
      } catch (error) {
        // update processing status
        this.isProcessing = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法刪除資料，請稍後再試'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@include slideAnimation;

.wrapper {
    background-color: color(quinary);
}

.restaurant {
    @include controlPanelLayout;
}
</style>
