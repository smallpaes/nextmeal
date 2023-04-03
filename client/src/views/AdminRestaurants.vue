<template>
  <section class="wrapper d-flex vh-100">
    <!--Left Side Navbar-->
    <AdminSideNavBar :nav-is-open="navIsOpen" />

    <!--Right Side Content-->
    <section class="restaurants flex-fill">
      <!--Navbar toggler-->
      <NavbarToggler
        :nav-is-open="navIsOpen"
        @toggle-navbar="navIsOpen = !navIsOpen"
      />
      <h1 class="restaurants-title">
        餐廳管理
      </h1>
      <hr class="restaurants-divider">

      <!--Filter And Search Panel-->
      <AdminFilterPanel
        :options="districts"
        :is-loading="isLoading"
        @after-search="handleAfterFilter({name: $event, dist: $route.query.dist})"
        @after-filter="handleAfterFilter({name: $route.query.name, dist: $event})"
      >
        <template v-slot:filterOption>
          篩選地區
        </template>
      </AdminFilterPanel>

      <!--Restaurant Data Table-->
      <transition
        name="slide"
        appear
      >
        <AdminRestaurantsTable
          v-if="isLoading || !isLoading && restaurants.length > 0"
          key="table"
          :is-loading="isLoading"
          :restaurants="restaurants"
        />
      </transition>

      <!--Pagination-->
      <transition name="fade">
        <Pagination
          v-if="totalPage > 1"
          class="mt-4"
          :total-page="totalPage"
          :current-page="Number($route.query.page) || 1"
          :query="{name: this.$route.query.name, dist: this.$route.query.dist}"
        />
      </transition>

      <!--Placeholder Messgae for Empty Data-->
      <PlaceholderMessage
        v-if="!isLoading && restaurants.length === 0"
        key="placeholder"
        class="restaurants-placeholder"
      >
        <i class="fas fa-search mr-2" />沒有符合的結果
      </PlaceholderMessage>
    </section>
  </section>
</template>

<script>
import AdminSideNavBar from '../components/Navbar/AdminSideNavBar'
import NavbarToggler from '../components/Navbar/NavbarToggler'
import AdminFilterPanel from '../components/AdminFilterPanel'
import AdminRestaurantsTable from '../components/AdminRestaurantsTable.vue'
import PlaceholderMessage from '../components/Placeholder/Message'
import Pagination from '../components/Pagination'
import adminAPI from '../apis/admin'
import { Toast } from '../utils/helpers'

export default {
  components: {
    AdminSideNavBar,
    NavbarToggler,
    AdminFilterPanel,
    AdminRestaurantsTable,
    PlaceholderMessage,
    Pagination
  },
  data () {
    return {
      restaurants: [],
      districts: [],
      totalPage: null,
      isLoading: true,
      navIsOpen: false
    }
  },
  created () {
    const { dist, name, page } = this.$route.query
    this.fetchRestaurants(dist, name, page)
  },
  beforeRouteUpdate (to, from, next) {
    const { dist, name, page } = to.query
    this.fetchRestaurants(dist, name, page)
    next()
  },
  methods: {
    async fetchRestaurants (dist = '', name = '', page = 1) {
      try {
        // update loading status
        this.isLoading = true
        // fetch data from API
        const { data, statusText } = await adminAPI.restaurants.getRestaurants({ dist, name, page })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // store data
        this.restaurants = data.restaurants.restaurants
        this.districts = data.districts.map(district => district.chinese_name)
        // update page data
        this.totalPage = data.restaurants.pages
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
    handleAfterFilter (query) {
      this.$router.push({ name: 'admin-restaurants', query })
    }
  }
}
</script>

<style lang="scss" scoped>
@include slideAnimation(false);
@include fadeAnimation(false);

.wrapper { background-color: color(quinary); }
.restaurants { @include controlPanelLayout; }
</style>
