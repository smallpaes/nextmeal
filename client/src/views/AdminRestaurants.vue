<template>
  <section class="wrapper d-flex vh-100">
    <AdminSideNavBar :nav-is-open="navIsOpen" />
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
      <AdminFilterPanel
        :options="districts"
        @after-search="handleAfterFilter({page: 0, searchInput: $event, selectedOption: currentFilterOption})"
        @after-filter="handleAfterFilter({page: 0, searchInput: currentSearchInput, selectedOption: $event})"
      >
        <template v-slot:filterOption>
          搜尋地區
        </template>
      </AdminFilterPanel>
      <template v-if="restaurants.length > 0">
        <AdminRestaurantsTable
          :restaurants="restaurants"
        />
        <div
          v-if="totalPage > 0 && currentPage !== totalPage"
          class="btn-container mt-3 mt-md-4"
        >
          <button
            class="btn"
            href="#"
            @click="fetchRestaurants(currentSearchInput, currentFilterOption, currentPage + 1)"
          >
            瀏覽更多
          </button>
        </div>
      </template>
      <PlaceholderMessage v-else>
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
import adminAPI from '../apis/admin'
import { Toast } from '../utils/helpers'

export default {
  components: {
    AdminSideNavBar,
    NavbarToggler,
    AdminFilterPanel,
    AdminRestaurantsTable,
    PlaceholderMessage
  },
  data () {
    return {
      restaurants: [],
      districts: [],
      currentSearchInput: '',
      currentFilterOption: '',
      currentPage: 0,
      totalPage: null,
      isLoading: true,
      navIsOpen: false
    }
  },
  created () {
    const { dist = '', name = '' } = this.$route.query
    this.fetchRestaurants(dist, name, this.currentPage + 1)
  },
  beforeRouteUpdate (to, from, next) {
    // Reset current page
    this.currentPage = 0
    // clear existing data
    this.restaurants = []
    const { dist = '', name = '' } = to.query
    this.fetchRestaurants(dist, name, this.currentPage + 1)
    next()
  },
  methods: {
    async fetchRestaurants (name, dist, page) {
      try {
        // fetch data from API
        const { data, statusText } = await adminAPI.restaurants.getRestaurants({ name, dist, page })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // store data
        this.restaurants = [...this.restaurants, ...data.restaurants.restaurants]
        this.districts = data.districts.map(district => district['chinese_name'])
        // update page data
        this.totalPage = data.restaurants.pages
        this.currentPage += 1
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
    handleAfterFilter (data) {
      this.currentPage = 0
      this.restaurants = []
      this.currentFilterOption = data.selectedOption
      this.currentSearchInput = data.searchInput
      this.fetchRestaurants(this.currentSearchInput, this.currentFilterOption, this.currentPage)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
    background-color: color(quinary);
}

.restaurants {
    @include controlPanelLayout;
}

.btn-container {
    text-align: center;
    .btn {
        @include solidButton(150);

        @include response(md) {
            min-width: 200px;
        }
    }
}
</style>
