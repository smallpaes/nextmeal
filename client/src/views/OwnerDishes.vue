<template>
  <section
    class="wrapper d-flex vh-100"
  >
    <OwnerSideNavBar :nav-is-open="navIsOpen" />
    <section class="dishes flex-fill">
      <!--Navbar toggler-->
      <NavbarToggler
        :nav-is-open="navIsOpen"
        @toggle-navbar="navIsOpen = !navIsOpen"
      />
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
import OwnerSideNavBar from '../components/Navbar/OwnerSideNavBar'
import NavbarToggler from '../components/Navbar/NavbarToggler'
import OwnerDishNavPill from '../components/Navbar/OwnerDishNavPill'
import OwnerDishCard from '../components/OwnerDishCard'
import ownerAPI from '../apis/owner'
import { Toast } from '../utils/helpers'

export default {
  components: {
    OwnerSideNavBar,
    NavbarToggler,
    OwnerDishNavPill,
    OwnerDishCard
  },
  data () {
    return {
      meals: [],
      isLoading: true,
      navIsOpen: false
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
    @include controlPanelLayout;

    &-divider {
        width: 100%;
        margin-top: 0;
    }

    .new-dish {
        @include linkStyling(color(primary));
        position: absolute;
        right: 40px;
        top: 112px;
        font-size: size(xs);
    }
}
</style>
