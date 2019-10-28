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
          搜尋地區
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
      location: '大安區',
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
      location: '信義區',
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
      location: '中山區',
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
      location: '松山區',
      Category: {
        name: '美式料理'
      },
      Comments: [],
      Meals: [],
      orderCount: 3
    }
  ],
  locations: [
    {
      'chinese_name': '大安區',
      'eng_name': "Da'an",
      'image': 'https://picsum.photos/1920/1080',
      'lng': '121.5434446',
      'lat': '25.02677012'
    },
    {
      'chinese_name': '信義區',
      'eng_name': 'Xinyi',
      'image': 'https://picsum.photos/1920/1080',
      'lng': '121.5716697',
      'lat': '25.03062083'
    },
    {
      'chinese_name': '中山區',
      'eng_name': 'Zhongshan',
      'image': 'https://picsum.photos/1920/1080',
      'lng': '121.7308913',
      'lat': '25.14986365'
    },
    {
      'chinese_name': '松山區',
      'eng_name': 'Songshan',
      'image': 'https://picsum.photos/1920/1080',
      'lng': '121.5575876',
      'lat': '25.05999101'
    }
  ]
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
      this.locations = dummyRestaurants.locations.map(location => location['chinese_name'])
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
