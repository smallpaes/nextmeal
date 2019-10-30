<template>
  <section>
    <header>
      <Navbar />
      <DropdownBanner
        :districts="districts"
        :current-district="currentDistrict"
      />
    </header>
    <section class="popular">
      <div class="container pt-3 pb-5">
        <Header>
          <template v-slot:title>
            熱門餐廳
          </template>
          <template v-slot:description>
            嘗試最受歡迎的餐廳
          </template>
        </Header>
        <RestaurantCarousel :popular-restaurants="popular_restaurants" />
      </div>
    </section>
    <section class="restaurants">
      <div class="container pt-3 pb-5">
        <Header>
          <template v-slot:title>
            更多選擇
          </template>
          <template v-slot:description>
            探索更多在地餐廳
          </template>
        </Header>
        <!-- <div class="card-wrapper row">
          <div
            v-for="restaurant in more_restaurants.rows"
            :key="restaurant.id"
            class="col-12 col-md-6 col-lg-4 p-2"
          >
            <RestaurantCard :restaurant="restaurant" />
          </div>
        </div> -->
        <div class="btn-container">
          <button
            v-if="currentPage !== totalPage"
            class="btn mt-3"
            href="#"
            @click="fetchRestaurants(currentDistrict, currentPage + 1)"
          >
            瀏覽更多
          </button>
        </div>
      </div>
    </section>
    <section class="map bg-white">
      <div class="container pt-3 pb-5">
        <Header>
          <template v-slot:title>
            {{ currentDistrict }}餐廳
          </template>
          <template v-slot:description>
            探索最近的美食地圖
          </template>
        </Header>
        <GMap
          v-if="!isLoading"
          :center="{lat: parseFloat(map.center.lat), lng: parseFloat(map.center.lng)}"
          :locations="map.restaurants"
          :street-view-control="false"
          :map-type-control="false"
          :fullscreen-control="true"
          :zoom-control="true"
          class="shadow-sm rounded-sm"
        />
      </div>
    </section>
    <Footer />
  </section>
</template>

<script>
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DropdownBanner from '../components/Banner/DropdownBanner'
import RestaurantCarousel from '../components/RestaurantCarousel'
import RestaurantCard from '../components/RestaurantCard'
import GMap from '../components/GMap'
import Header from '../components/Header'
import restaurantsAPI from '../apis/restaurants'
import { Toast } from '../utils/helpers'

// const dummyRestaurantAndDistrict = {
//   popular_restaurants: [
//     { id: 1,
//       image: 'https://cdn.pixabay.com/photo/2014/10/19/20/59/hamburger-494706_1280.jpg',
//       name: '餐廳一號',
//       rating: 3.4,
//       category: '美式料理'
//     },
//     { id: 2,
//       image: 'https://cdn.pixabay.com/photo/2017/03/30/15/47/churros-2188871_1280.jpg',
//       name: '餐廳二號',
//       rating: 4.9,
//       category: '韓式料理'
//     },
//     { id: 3,
//       image: 'https://cdn.pixabay.com/photo/2016/10/03/23/15/ice-1713160_1280.jpg',
//       name: '餐廳三號',
//       rating: 4.4,
//       category: '美式料理'
//     },
//     { id: 4,
//       image: 'https://via.placeholder.com/400x400/d3d3d3?text=Temp+Image',
//       name: '餐廳四號',
//       rating: 2.3,
//       category: '中東料理'
//     },
//     { id: 5,
//       image: 'https://via.placeholder.com/400x400/d3d3d3?text=Temp+Image',
//       name: '餐廳五號',
//       rating: 5.4,
//       category: '中東料理'
//     },
//     { id: 6,
//       image: 'https://via.placeholder.com/400x400/d3d3d3?text=Temp+Image',
//       name: '餐廳六號',
//       rating: 3.4,
//       category: '中東料理'
//     }
//   ],
//   more_restaurants: {
//     count: 16,
//     pages: 3,
//     rows: [
//       { id: 7,
//         image: 'https://cdn.pixabay.com/photo/2014/10/19/20/59/hamburger-494706_1280.jpg',
//         name: '餐廳一號',
//         rating: 3.4,
//         category: '美式料理'
//       },
//       { id: 8,
//         image: 'https://cdn.pixabay.com/photo/2017/03/30/15/47/churros-2188871_1280.jpg',
//         name: '餐廳二號',
//         rating: 4.9,
//         category: '韓式料理'
//       },
//       { id: 9,
//         image: 'https://cdn.pixabay.com/photo/2016/10/03/23/15/ice-1713160_1280.jpg',
//         name: '餐廳三號',
//         rating: 4.4,
//         category: '美式料理'
//       },
//       { id: 10,
//         image: 'https://via.placeholder.com/400x400/d3d3d3?text=Temp+Image',
//         name: '餐廳四號',
//         rating: 2.3,
//         category: '中東料理'
//       },
//       { id: 11,
//         image: 'https://via.placeholder.com/400x400/d3d3d3?text=Temp+Image',
//         name: '餐廳五號',
//         rating: 5.4,
//         category: '中東料理'
//       },
//       { id: 12,
//         image: 'https://via.placeholder.com/400x400/d3d3d3?text=Temp+Image',
//         name: '餐廳六號',
//         rating: 3.4,
//         category: '中東料理'
//       }
//     ]
//   },
//   map: {
//     center: {
//       'chinese_name': '信義區',
//       'eng_name': 'Xinyi',
//       'lng': '121.5716697',
//       'lat': '25.03062083'
//     },
//     restaurants: [
//       {
//         'id': 1,
//         'name': '餐廳一',
//         'lat': 25.0340,
//         'lng': 121.5645
//       },
//       {
//         'id': 2,
//         'name': '餐廳二',
//         'lat': 25.036643,
//         'lng': 121.567678
//       },
//       {
//         'id': 3,
//         'name': '餐廳三',
//         'lat': 25.033643,
//         'lng': 121.566678
//       },
//       {
//         'id': 4,
//         'name': '餐廳四',
//         'lat': 25.031569,
//         'lng': 121.568579
//       }
//     ]
//   },
//   districts: [
//     {
//       'chinese_name': '大安區',
//       'eng_name': "Da'an",
//       'image': 'https://cdn.pixabay.com/photo/2013/11/13/21/14/san-francisco-210230_1280.jpg',
//       'lng': '121.5434446',
//       'lat': '25.02677012'
//     },
//     {
//       'chinese_name': '信義區',
//       'eng_name': 'Xinyi',
//       'image': 'https://cdn.pixabay.com/photo/2019/09/23/14/34/nyc-4498752_1280.jpg',
//       'lng': '121.5716697',
//       'lat': '25.03062083'
//     },
//     {
//       'chinese_name': '中山區',
//       'eng_name': 'Zhongshan',
//       'image': 'https://cdn.pixabay.com/photo/2018/04/25/09/26/eiffel-tower-3349075_1280.jpg',
//       'lng': '121.7308913',
//       'lat': '25.14986365'
//     },
//     {
//       'chinese_name': '松山區',
//       'eng_name': 'Songshan',
//       'image': 'https://cdn.pixabay.com/photo/2016/10/31/04/19/lan-yang-museum-1784871_1280.jpg',
//       'lng': '121.5575876',
//       'lat': '25.05999101'
//     }
//   ]
// }

export default {
  components: {
    Navbar,
    Footer,
    DropdownBanner,
    RestaurantCarousel,
    RestaurantCard,
    GMap,
    Header
  },
  data () {
    return {
      popular_restaurants: [],
      more_restaurants: {
        rows: []
      },
      map: {},
      districts: [],
      currentDistrict: '',
      currentPage: 0,
      totalPage: null,
      isLoading: true
    }
  },
  created () {
    const { dist } = this.$route.query
    this.currentDistrict = dist || '信義區'
    this.fetchRestaurants(dist, this.currentPage + 1)
  },
  beforeRouteUpdate (to, from, next) {
    // Reset current page
    this.currentPage = 0
    // Clear existing restaurants
    this.more_restaurants.rows = []
    // Get the district name
    const { dist } = to.query
    this.currentDistrict = dist || '信義區'
    // Refetch the restaurant data
    this.fetchRestaurants(dist, this.currentPage + 1)
    next()
  },
  methods: {
    async fetchRestaurants (dist, page) {
      this.isLoading = true
      try {
        // fetch data from API
        const { data, statusText } = await restaurantsAPI.getRestaurants({ dist })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)

        // fetch data from api
        this.popular_restaurants = data.popular_restaurants || this.popular_restaurants
        this.more_restaurants.rows = [
          ...this.more_restaurants.rows,
          ...data.more_restaurants.rows
        ]
        this.totalPage = data.more_restaurants.pages

        this.map = data.map || this.map
        this.districts = data.districts || this.districts
        // update current page number
        this.currentPage += 1
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
    }
  }
}
</script>

<style lang="scss" scoped>
.google-map {
  width: 100%;
  height: 400px;
}

.btn-container {
    text-align: center;
    .btn {
        @include buttonOutline;
    }
}
</style>
