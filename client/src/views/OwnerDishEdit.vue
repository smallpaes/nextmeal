<template>
  <section class="wrapper d-flex h-100">
    <SideNavBar />
    <section class="dish flex-fill">
      <h1 class="dish-title">
        餐點資訊
      </h1>
      <OwnerDishNavPill class="mt-4 ml-1" />
      <hr class="dish-divider">
      <div class="dish-form-container pb-4">
        <OwnerDishForm
          :initial-dish="dish"
          :initial-loading="isLoading"
          @after-submit="handleAfterSubmit"
        >
          <template v-slot:header>
            <span>編輯</span>
          </template>
          <template v-slot:submitBtn>
            <span>更新</span>
          </template>
        </OwnerDishForm>
      </div>
    </section>
  </section>
</template>

<script>
import SideNavBar from '../components/Navbar/SideNavBar'
import OwnerDishNavPill from '../components/Navbar/OwnerDishNavPill'
import OwnerDishForm from '../components/OwnerDishForm'
import ownerAPI from '../apis/owner'
import { Toast } from '../utils/helpers'

export default {
  components: {
    SideNavBar,
    OwnerDishNavPill,
    OwnerDishForm
  },
  data () {
    return {
      dish: {
        name: '',
        description: '',
        image: ''
      },
      isLoading: true,
      isProcessing: false
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
      // update processing status
      this.isLoading = true

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
          title: '無法取得資料，請稍後再試'
        })
      }
    },
    async handleAfterSubmit (formData) {
      // update processing status
      this.isLoading = true

      try {
        const { dish_id: dishId } = this.$route.params
        // update dish data
        const { data, statusText } = await ownerAPI.dishes.putEdit({ dishId, formData })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // redirect to dishes page
        this.$router.push({ name: 'owner-dishes' })
      } catch (error) {
        // update loading status
        this.isLoading = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法更新餐點，請稍後再試'
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

.dish {
    padding: 2.3rem 2rem;
    max-width: 800px;
    overflow-y: scroll;
    margin-left: 80px;
    transition: margin-left .1s linear;

    &-title {
        size: size(lg);
    }

    &-divider {
        width: 100%;
        margin-top: 0;
    }

    @include response(md) {
        margin-left: 145px;
    }
}
</style>
