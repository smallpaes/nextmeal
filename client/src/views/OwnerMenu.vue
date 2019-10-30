<template>
  <section class="wrapper d-flex vh-100">
    <SideNavBar />
    <section class="dishes flex-fill">
      <h1 class="dishes-title">
        餐點資訊
      </h1>
      <OwnerDishNavPill class="mt-4 ml-1" />
      <hr class="dishes-divider">
      <div class="dishes-card-container row mx-0 p-3 rounded-sm shadow-sm">
        <OwnerMenuCard
          v-for="day in days"
          :key="day"
          class="col-12 pb-0 pb-md-2 px-0 mb-0 mb-md-2"
          :meal="meal"
          :day="day"
          @edit-meal="handleEditMeal"
        />
      </div>
      <OwnerMenuForm
        v-if="$route.query.ran==='nextWeek'"
        ref="editForm"
        :initial-meal="meal"
        :options="options"
        @after-submit="handleAfterSubmit"
      />
    </section>
  </section>
</template>

<script>
import SideNavBar from '../components/Navbar/SideNavBar'
import OwnerDishNavPill from '../components/Navbar/OwnerDishNavPill'
import OwnerMenuCard from '../components/OwnerMenuCard'
import OwnerMenuForm from '../components/OwnerMenuForm'
import ownerAPI from '../apis/owner'
import { Toast } from '../utils/helpers'

export default {
  components: {
    SideNavBar,
    OwnerDishNavPill,
    OwnerMenuCard,
    OwnerMenuForm
  },
  data () {
    return {
      meal: {
        id: -1,
        name: '',
        description: '',
        image: '',
        quantity: 50,
        isServing: false,
        nextServing: false
      },
      options: [],
      days: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      isLoading: true
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
        // fetch data from API
        const { data, statusText } = await ownerAPI.menu.getMenu({ ran: range })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // store data
        this.meal = data.meals[0]
        if (data.options) this.options = [...this.options, ...data.options]
        // update loading status
        this.isLoading = false
      } catch (error) {
        // update loading status
        this.isLoading = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法本週菜單，請稍後再試'
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
      console.log(updatedMealData)
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

    &-card-container {
        background-color: color(quaternary);
    }

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
