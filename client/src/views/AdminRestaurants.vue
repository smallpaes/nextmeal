<template>
  <section class="wrapper d-flex vh-100">
    <AdminSideNavBar />
    <section class="restaurants flex-fill">
      <h1 class="restaurants-title">
        餐廳管理
      </h1>
      <hr class="restaurants-divider">
      <AdminFilterPanel
        :options="locations"
        @after-search="handleAfterSearch"
        @after-filter="handleAfterFilter"
      >
        <template v-slot:filterOption>
          搜尋名稱
        </template>
      </AdminFilterPanel>
      <AdminRestaurantsTable :restaurants="restaurants" />
    </section>
  </section>
</template>

<script>
import AdminSideNavBar from '../components/Navbar/AdminSideNavBar'
import AdminFilterPanel from '../components/AdminFilterPanel'
import AdminRestaurantsTable from '../components/AdminRestaurantsTable.vue'

const dummyRestaurants = {
  restaurants: [
    {
      id: '1',
      name: '餐廳一',
      rating: 4.6,
      commentCount: 0,
      Category: {
        name: '日本料理'
      },
      Comments: [],
      Meals: [],
      orderCount: 2
    },
    {
      id: '2',
      name: '餐廳二',
      rating: 3.4,
      commentCount: 3,
      Category: {
        name: '美式料理'
      },
      Comments: [],
      Meals: [],
      orderCount: 3
    },
    {
      id: '3',
      name: '餐廳三',
      rating: 4.2,
      commentCount: 10,
      Category: {
        name: '日本料理'
      },
      Comments: [],
      Meals: [],
      orderCount: 12
    },
    {
      id: '4',
      name: '餐廳四',
      rating: 2.4,
      commentCount: 1,
      Category: {
        name: '美式料理'
      },
      Comments: [],
      Meals: [],
      orderCount: 3
    }
  ],
  locations: ['信義區', '大安區', '松山區', '中山區']
}

export default {
  components: {
    AdminSideNavBar,
    AdminFilterPanel,
    AdminRestaurantsTable
  },
  data () {
    return {
      restaurants: [],
      locations: [],
      currentSearchInput: '',
      currentFilterOption: ''
    }
  },
  created () {
    this.fetchRestaurants()
  },
  beforeRouteUpdate () {
    this.fetchRestaurants()
  },
  methods: {
    fetchRestaurants (name, category) {
      // fetch data from API
      this.restaurants = dummyRestaurants.restaurants
      this.locations = dummyRestaurants.locations || this.locations
    },
    handleAfterSearch (searchInput) {
      this.currentSearchInput = searchInput
      this.fetchRestaurants(this.currentSearchInput, this.currentFilterOption)
    },
    handleAfterFilter (selectedOption) {
      this.currentFilterOption = selectedOption
      this.fetchRestaurants(this.currentSearchInput, this.currentFilterOption)
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
