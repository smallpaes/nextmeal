<template>
  <section class="wrapper d-flex vh-100">
    <AdminSideNavBar />
    <section class="restaurants flex-fill">
      <h1 class="restaurants-title">
        餐廳管理
      </h1>
      <hr class="restaurants-divider">
      <AdminFilterPanel
        :options="districts"
        @after-search="handleAfterSearch"
        @after-filter="handleAfterFilter"
      >
        <template v-slot:filterOption>
          搜尋地區
        </template>
      </AdminFilterPanel>
      <AdminRestaurantsTable
        v-if="restaurants.length > 0"
        :restaurants="restaurants"
      />
      <PlaceholderMessage v-else>
        <i class="fas fa-search mr-2" />沒有符合的結果
      </PlaceholderMessage>
    </section>
  </section>
</template>

<script>
import AdminSideNavBar from '../components/Navbar/AdminSideNavBar'
import AdminFilterPanel from '../components/AdminFilterPanel'
import AdminRestaurantsTable from '../components/AdminRestaurantsTable.vue'
import PlaceholderMessage from '../components/Placeholder/Message'
import adminAPI from '../apis/admin'
import { Toast } from '../utils/helpers'

export default {
  components: {
    AdminSideNavBar,
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
      isLoading: true
    }
  },
  created () {
    const { dist = '', name = '' } = this.$route.query
    this.fetchRestaurants({ dist, name })
  },
  beforeRouteUpdate (to, from, next) {
    const { dist = '', name = '' } = to.query
    this.fetchRestaurants({ dist, name })
    next()
  },
  methods: {
    async fetchRestaurants ({ name, dist }) {
      try {
        // fetch data from API
        const { data, statusText } = await adminAPI.restaurants.getRestaurants({ name, dist })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // store data
        this.restaurants = data.restaurants
        this.districts = data.districts.map(district => district['chinese_name'])
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
    handleAfterSearch (searchInput) {
      this.currentSearchInput = searchInput
      this.fetchRestaurants({ name: this.currentSearchInput, dist: this.currentFilterOption })
    },
    handleAfterFilter (selectedOption) {
      this.currentFilterOption = selectedOption
      this.fetchRestaurants({ name: this.currentSearchInput, dist: this.currentFilterOption })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
    background-color: color(quinary);
}

.restaurants {
    padding: 2.3rem 2rem;
    max-width: 800px;
    margin-left: 80px;
    transition: margin-left .1s linear;
    overflow-y: scroll;

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
