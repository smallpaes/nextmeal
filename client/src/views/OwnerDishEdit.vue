<template>
  <section class="wrapper d-flex h-100">
    <!--Left Side Navbar-->
    <OwnerSideNavBar :nav-is-open="navIsOpen" />

    <!--Right Side Content-->
    <section class="dish flex-fill">
      <!--Navbar toggler-->
      <NavbarToggler
        :nav-is-open="navIsOpen"
        @toggle-navbar="navIsOpen = !navIsOpen"
      />
      <h1 class="dish-title">
        餐點資訊
      </h1>

      <!--Menu and Dish Navbar-->
      <OwnerDishNavPill class="mt-4 ml-1" />
      <hr class="dish-divider">

      <!--Loader-->
      <Loader
        v-if="isLoading"
        :height="'300px'"
      />

      <!--Restaurant Info Edit Form-->
      <transition
        name="slide"
      >
        <div
          v-if="!isLoading"
          class="dish-form-container pb-4"
        >
          <OwnerDishForm
            :initial-dish="dish"
            :initial-processing="isProcessing"
            @after-submit="handleAfterSubmit"
            @after-delete="handleAfterDelete"
          >
            <template v-slot:header>
              <span>編輯</span>
            </template>
            <template v-slot:submitBtn>
              <span>更新</span>
            </template>
          </OwnerDishForm>
        </div>
      </transition>
    </section>
  </section>
</template>

<script>
import OwnerSideNavBar from '../components/Navbar/OwnerSideNavBar'
import NavbarToggler from '../components/Navbar/NavbarToggler'
import OwnerDishNavPill from '../components/Navbar/OwnerDishNavPill'
import OwnerDishForm from '../components/OwnerDishForm'
import Loader from '../components/Loader'
import ownerAPI from '../apis/owner'
import { Toast } from '../utils/helpers'

export default {
  components: {
    OwnerSideNavBar,
    NavbarToggler,
    OwnerDishNavPill,
    OwnerDishForm,
    Loader
  },
  data () {
    return {
      dish: {
        name: '',
        description: '',
        image: ''
      },
      isLoading: true,
      isProcessing: false,
      navIsOpen: false
    }
  },
  created () {
    const { dish_id: dishId } = this.$route.params
    this.fetchDishData(dishId)
  },
  beforeRouteUpdate (to, from, next) {
    const { dish_id: dishId } = to.params
    this.fetchDishData(dishId)
    next()
  },
  methods: {
    async fetchDishData (dishId) {
      try {
        // fetch dish
        const { data, statusText } = await ownerAPI.dishes.getEdit({ dishId })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // sotre data
        this.dish = {
          ...this.dish,
          name: data.meal.name,
          description: data.meal.description,
          image: data.meal.image
        }
        // update processing status
        this.isLoading = false
      } catch (error) {
        // update processing status
        this.isLoading = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法取得餐點資料，請稍後再試'
        })
        // back to last page
        this.$router.go(-1)
      }
    },
    async handleAfterSubmit (formData) {
      // update processing status
      this.isProcessing = true

      try {
        const { dish_id: dishId } = this.$route.params
        // update dish data
        const { data, statusText } = await ownerAPI.dishes.putEdit({ dishId, formData })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // redirect to dishes page
        this.$router.push({ name: 'owner-dishes' })
      } catch (error) {
        // update processing status
        this.isProcessing = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法更新餐點，請稍後再試'
        })
      }
    },
    async handleAfterDelete () {
      // update processing status
      this.isProcessing = true

      try {
        const { dish_id: dishId } = this.$route.params
        // update dish data
        const { data, statusText } = await ownerAPI.dishes.deleteDish({ dishId })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // redirect to dishes page
        this.$router.push({ name: 'owner-dishes' })
      } catch (error) {
        // update processing status
        this.isProcessing = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法刪除餐點，請稍後再試'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@include slideAnimation;

.wrapper { background-color: color(quinary); }

.dish {
  @include controlPanelLayout;
  &-divider { margin-top: 0;}
}
</style>
