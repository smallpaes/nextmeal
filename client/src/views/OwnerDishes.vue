<template>
  <section
    class="wrapper d-flex vh-100"
  >
    <SideNavBar />
    <section class="dishes flex-fill">
      <router-link
        :to="{name: 'owner-dish-new'}"
        class="new-dish"
      >
        <i class="fas fa-plus" />
        <span class="ml-1 d-none d-md-inline">新增菜單</span>
      </router-link>
      <h1 class="dishes-title">
        餐點資訊
      </h1>
      <OwnerDishNavPill class="mt-4 ml-1" />
      <hr class="dishes-divider">
      <div class="dishes-card-container row px-3 pb-4">
        <OwnerDishCard
          v-for="meal in meals"
          :key="meal.id"
          :meal="meal"
          class="col-12 p-0"
        />
      </div>
    </section>
  </section>
</template>

<script>
import SideNavBar from '../components/Navbar/SideNavBar'
import OwnerDishNavPill from '../components/Navbar/OwnerDishNavPill'
import OwnerDishCard from '../components/OwnerDishCard'
import ownerAPI from '../apis/owner'
import { Toast } from '../utils/helpers'

export default {
  components: {
    SideNavBar,
    OwnerDishNavPill,
    OwnerDishCard
  },
  data () {
    return {
      meals: [],
      isLoading: true
    }
  },
  created () {
    this.fetchMeals()
  },
  methods: {
    async fetchMeals () {
      try {
        // fetch data from API
        const { data, statusText } = await ownerAPI.dishes.getDishes()
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)

        // store data
        this.meals = [
          ...this.meals,
          ...data.meals
        ]

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
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
    @include hideScrollBar;
    background-color: color(quinary);
}

.dishes {
    position: relative;
    padding: 2.3rem 2rem;
    max-width: 800px;
    margin-left: 80px;
    transition: margin-left .1s linear;

    &-title {
        size: size(lg);
    }

    &-divider {
        width: 100%;
        margin-top: 0;
    }

    // set max-heigt for tablet
    // &-card-container {
    //     max-height: 560px;
    //     overflow-y: scroll;
    // }

    .new-dish {
        @include linkStyling(color(primary));
        position: absolute;
        right: 40px;
        top: 112px;
        font-size: size(xs);
    }

    @include response(md) {
        margin-left: 145px;
    }
}
</style>
