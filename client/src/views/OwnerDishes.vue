<template>
  <section
    class="wrapper d-flex vh-100"
  >
    <!--Left Side Navbar-->
    <OwnerSideNavBar :nav-is-open="navIsOpen" />

    <!--Right Side Content-->
    <section class="dishes flex-fill">
      <!--Navbar toggler-->
      <NavbarToggler
        :nav-is-open="navIsOpen"
        @toggle-navbar="navIsOpen = !navIsOpen"
      />
      <router-link
        v-if="currentUser.hasRestaurant"
        :to="{name: 'owner-dish-new'}"
        class="new-dish"
      >
        <i class="fas fa-plus" />
        <span class="ml-1 d-none d-md-inline">新增菜單</span>
      </router-link>
      <h1 class="dishes-title">
        餐點資訊
      </h1>

      <!--Menu and Order Navbar-->
      <OwnerDishNavPill class="mt-4 ml-1" />
      <hr class="dishes-divider">

      <!--Loader-->
      <Loader
        v-if="isLoading"
        :height="'300px'"
      />

      <!--Display Meals-->
      <transition
        name="slide"
        appear
      >
        <div
          v-if="!isLoading"
          class="dishes-card-container row mx-0 p-3 mb-4 rounded-sm shadow-sm"
        >
          <template v-if="meals.length > 0">
            <OwnerDishCard
              v-for="meal in meals"
              :key="meal.id"
              class="col-12 pb-0 pb-md-2 px-0 mb-0 mb-md-2"
              :image="meal.image"
              :edit-btn="true"
              @edit="$router.push({name: 'owner-dish-edit', params: {dish_id: meal.id}})"
            >
              <template #title>
                {{ meal.name }}
              </template>
              <template #primary-description>
                {{ meal.description | textTruncate(20) }}
              </template>
            </OwnerDishCard>
          </template>
          <PlaceholderMessage
            v-else
            class="placeholder-message col-12 py-4 text-center"
          >
            <template v-if="currentUser.hasRestaurant">
              <h1><i class="fas fa-utensils" /></h1>
              尚無菜單
            </template>
            <template v-else>
              <h1><i class="fas fa-exclamation-circle" /></h1>
              請先至「餐廳」頁面填寫資料<br>完成開店流程
            </template>
          </PlaceholderMessage>
        </div>
      </transition>
    </section>
  </section>
</template>

<script>
import OwnerSideNavBar from '../components/Navbar/OwnerSideNavBar'
import NavbarToggler from '../components/Navbar/NavbarToggler'
import OwnerDishNavPill from '../components/Navbar/OwnerDishNavPill'
import OwnerDishCard from '../components/Card/OwnerDishCard'
import Loader from '../components/Loader'
import PlaceholderMessage from '../components/Placeholder/Message'
import ownerAPI from '../apis/owner'
import { textTruncateFilter } from '../utils/mixins'
import { Toast } from '../utils/helpers'
import { mapState } from 'vuex'

export default {
  components: {
    OwnerSideNavBar,
    NavbarToggler,
    OwnerDishNavPill,
    OwnerDishCard,
    PlaceholderMessage,
    Loader
  },
  mixins: [textTruncateFilter],
  data () {
    return {
      meals: [],
      isLoading: true,
      navIsOpen: false
    }
  },
  computed: {
    ...mapState(['currentUser'])
  },
  created () {
    if (this.currentUser.hasRestaurant) return this.fetchMeals()
    this.isLoading = false
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
@include slideAnimation;

.wrapper {
  @include hideScrollBar;
  background-color: color(quinary);
}

.dishes {
  @include controlPanelLayout;

  &-card-container { background-color: color(quaternary); }

  &-divider {
    width: 100%;
    margin-top: 0;
  }

  .new-dish {
    @include linkStyling(color(primary));
    position: absolute;
    top: 112px;
    right: 40px;
    font-size: size(xs);
  }
}
</style>
