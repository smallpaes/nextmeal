<template>
  <section class="wrapper d-flex vh-100">
    <SideNavBar />
    <section class="info flex-fill">
      <h1 class="info-title">
        餐廳資訊
      </h1>
      <hr class="info-divider">
      <RestaurantInfoForm
        v-if="!isLoading"
        :initial-restaurant="restaurant"
        :categories="categories"
        :initial-processing="isProcessing"
        @after-submit="hasRestaurantData ? updateRestaurant($event) : createRestaurant($event) "
      />
    </section>
  </section>
</template>

<script>
import SideNavBar from '../components/Navbar/SideNavBar'
import RestaurantInfoForm from '../components/RestaurantInfoForm'
import ownerAPI from '../apis/owner'
import { Toast } from '../utils/helpers'

export default {
  components: {
    SideNavBar,
    RestaurantInfoForm
  },
  data () {
    return {
      restaurant: {},
      categories: [],
      hasRestaurantData: false,
      isLoading: true,
      isProcessing: false
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
.wrapper {
    background-color: color(quinary);
}

.info {
    padding: 2.3rem 2rem;
    max-width: 800px;
    margin-left: 80px;
    transition: margin-left .1s linear;

    &-title {
        size: size(lg);
    }

    &-divider {
        width: 100%;
    }

    @include response(md) {
        margin-left: 145px;
    }
}
</style>
