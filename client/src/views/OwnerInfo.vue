<template>
  <section class="wrapper d-flex vh-100">
    <!--Left Side Navbar-->
    <OwnerSideNavBar :nav-is-open="navIsOpen" />

    <!--Right Side Content-->
    <section class="info flex-fill">
      <!--Navbar toggler-->
      <NavbarToggler
        :nav-is-open="navIsOpen"
        @toggle-navbar="navIsOpen = !navIsOpen"
      />
      <h1 class="info-title">
        餐廳資訊
      </h1>
      <hr class="info-divider">

      <!--Loader-->
      <Loader
        v-if="isLoading"
        :height="'300px'"
      />

      <!--Restaurant Info Edit Form-->
      <transition
        name="slide"
      >
        <RestaurantInfoForm
          v-if="!isLoading"
          class="info-form"
          :initial-restaurant="restaurant"
          :categories="categories"
          :initial-processing="isProcessing"
          @after-submit="hasRestaurantData ? updateRestaurant($event) : createRestaurant($event) "
        />
      </transition>
    </section>
  </section>
</template>

<script>
import OwnerSideNavBar from '../components/Navbar/OwnerSideNavBar'
import NavbarToggler from '../components/Navbar/NavbarToggler'
import RestaurantInfoForm from '../components/RestaurantInfoForm'
import Loader from '../components/Loader'
import ownerAPI from '../apis/owner'
import { Toast } from '../utils/helpers'

export default {
  components: {
    OwnerSideNavBar,
    NavbarToggler,
    RestaurantInfoForm,
    Loader
  },
  data () {
    return {
      restaurant: {},
      categories: [],
      hasRestaurantData: false,
      isLoading: true,
      isProcessing: false,
      navIsOpen: false
    }
  },
  created () {
    this.fetchRestaurantData()
  },
  methods: {
    async fetchRestaurantData (restaurantId) {
      try {
        const { data, statusText } = await ownerAPI.restaurants.get()

        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)

        // check if restaurant data alreadt exists
        if (!data.restaurant) {
          this.hasRestaurantData = false
          this.categories = data.categories
          // update loading status
          this.isLoading = false
          return
        }

        // retrieve data
        const {
          restaurant: [{ opening_hour: openingHour, closing_hour: closingHour, ...restData }],
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
      }
    },
    async createRestaurant (formData) {
      try {
        // update processing status
        this.isProcessing = true
        const { data, statusText } = await ownerAPI.restaurants.post(formData)

        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // update data to Vuex
        this.$store.commit('setCurrentUser', { hasRestaurant: true })
        // alert success message
        Toast.fire({
          type: 'success',
          title: '新增成功'
        })
        // update processing status
        this.isProcessing = false
      } catch (error) {
        // update processing status
        this.isProcessing = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法新增資料，請稍後再試'
        })
      }
    },
    async updateRestaurant (formData) {
      try {
        // update processing status
        this.isProcessing = true
        const { data, statusText } = await ownerAPI.restaurants.put(formData)
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // alert success message
        Toast.fire({
          type: 'success',
          title: '更新成功'
        })
        // update processing status
        this.isProcessing = false
      } catch (error) {
        // update processing status
        this.isProcessing = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法更新資料，請稍後再試'
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

.info {
  @include controlPanelLayout;
}
</style>
