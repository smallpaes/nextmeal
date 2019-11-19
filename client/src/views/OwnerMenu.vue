<template>
  <section class="wrapper d-flex vh-100">
    <!--Left Side Navbar-->
    <OwnerSideNavBar :nav-is-open="navIsOpen" />

    <!--Right Side Content-->
    <section class="menu flex-fill">
      <!--Navbar toggler-->
      <NavbarToggler
        :nav-is-open="navIsOpen"
        @toggle-navbar="navIsOpen = !navIsOpen"
      />
      <h1 class="menu-title">
        餐點資訊
      </h1>

      <!--Menu and Order Navbar-->
      <OwnerDishNavPill class="mt-4 ml-1" />
      <hr class="menu-divider">

      <!--Loader-->
      <Loader
        v-if="isLoading"
        :height="'300px'"
      />

      <transition
        name="slide"
      >
        <section
          v-if="!isLoading"
          class="menu-content mb-4"
        >
          <div class="menu-card-container row mx-0 p-3 rounded-sm shadow-sm">
            <!--Display Menu-->
            <template v-if="Object.keys(meal).length > 0 && ($route.query.ran === 'thisWeek' || $route.query.ran === 'nextWeek' && meal.nextServing_quantity)">
              <OwnerDishCard
                v-for="day in days"
                :key="day"
                class="col-12 pb-0 pb-md-2 px-0 mb-0 mb-md-2"
                :image="meal.image"
                :edit-btn="$route.query.ran === 'nextWeek' && currentDay !== 0"
                @edit="handleEditMeal"
              >
                <template #title>
                  {{ day }}
                </template>
                <template #primary-description>
                  <span class="d-none d-md-inline">餐點名稱：</span>
                  {{ meal.name }}
                </template>
                <template #secondary-description>
                  <span class="d-none d-md-inline">供應數量</span>
                  ：{{ $route.query.ran === 'thisWeek' ? meal.quantity : meal.nextServing_quantity || 0 }}份
                </template>
              </OwnerDishCard>
            </template>
            <PlaceholderMessage
              v-else
              class="placeholder-message col-12 py-4 text-center"
            >
              <template v-if="currentUser.hasRestaurant">
                <h1><i class="fas fa-utensils" /></h1>
                尚未提供餐點
              </template>
              <template v-else>
                <h1><i class="fas fa-exclamation-circle" /></h1>
                請先至「餐廳」頁面填寫資料<br>完成開店流程
              </template>
            </PlaceholderMessage>
          </div>
          <!--Form to Edit Next Week Meal-->
          <OwnerMenuForm
            v-if="$route.query.ran==='nextWeek' && currentUser.hasRestaurant"
            ref="editForm"
            class="menu-form"
            :initial-meal="Object.keys(meal).length > 0 ? meal : {}"
            :options="options"
            @after-submit="handleAfterSubmit"
          />
        </section>
      </transition>
    </section>
  </section>
</template>

<script>
import OwnerSideNavBar from '../components/Navbar/OwnerSideNavBar'
import NavbarToggler from '../components/Navbar/NavbarToggler'
import OwnerDishNavPill from '../components/Navbar/OwnerDishNavPill'
import OwnerDishCard from '../components/Card/OwnerDishCard'
import OwnerMenuForm from '../components/OwnerMenuForm'
import PlaceholderMessage from '../components/Placeholder/Message'
import Loader from '../components/Loader'
import ownerAPI from '../apis/owner'
import { Toast } from '../utils/helpers'
import { mapState } from 'vuex'

export default {
  components: {
    OwnerSideNavBar,
    OwnerDishNavPill,
    NavbarToggler,
    OwnerDishCard,
    OwnerMenuForm,
    PlaceholderMessage,
    Loader
  },
  data () {
    return {
      meal: {
        id: '',
        name: '',
        description: '',
        image: '',
        quantity: 0,
        nextServing_quantity: 0,
        isServing: false,
        nextServing: false
      },
      options: [],
      days: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      isLoading: true,
      navIsOpen: false
    }
  },
  computed: {
    ...mapState(['currentUser']),
    currentDay: function () {
      const date = new Date()
      return date.getDay()
    }
  },
  created () {
    const { ran } = this.$route.query
    // redirect to 404 page when query string is not valid
    if (!ran || (ran !== 'thisWeek' && ran !== 'nextWeek')) this.$router.push({ name: 'not-found' })
    this.fetchMeal(ran)
  },
  beforeRouteUpdate (to, from, next) {
    const { ran } = to.query
    // redirect to 404 page when query string is not valid
    if (!ran || (ran !== 'thisWeek' && ran !== 'nextWeek')) next({ name: 'not-found' })
    // fetch data
    this.fetchMeal(ran)
    next()
  },
  methods: {
    async fetchMeal (range) {
      try {
        // update loading status
        this.isLoading = true
        // fetch data from API
        const { data, statusText } = await ownerAPI.menu.getMenu({ ran: range })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // store data

        this.meal = !data.meals.length ? {} : data.meals[0]
        if (data.options) this.options = data.options
        // update loading status
        this.isLoading = false
      } catch (error) {
        // update loading status
        this.isLoading = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法取得本週菜單，請稍後再試'
        })
      }
    },
    handleEditMeal () {
      // get form position
      const form = this.$refs.editForm.$el
      const top = form.offsetTop
      // scroll to is currently not supported in IE, Edge, Safari
      window.scrollTo({ top: top, behavior: 'smooth' })
    },
    handleAfterSubmit (updatedMealData) {
      // update meal data
      this.meal = {
        ...this.meal,
        ...updatedMealData
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@include slideAnimation(false);

.wrapper {
  @include hideScrollBar;
  background-color: color(quinary);
}

/* Right Side Content */
.menu {
  @include controlPanelLayout;

  &-card-container { background-color: color(quaternary); }

  &-divider {
    width: 100%;
    margin-top: 0;
  }
}

.placeholder-message { border-bottom: 1px solid lighten(color(secondary), 50%); }
</style>
