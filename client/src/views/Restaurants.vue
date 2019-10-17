<template>
  <section>
    <header>
      <Navbar />
      <RestaurantBanner
        :districts="districts"
        :current-district="currentDistrict"
      />
    </header>
    <Footer />
  </section>
</template>

<script>
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RestaurantBanner from '../components/RestaurantBanner'

const dummyRestaurantAndDistrict = {
  popular_restaurants: [
    { id: 1,
      image: 'https://cdn.pixabay.com/photo/2014/10/19/20/59/hamburger-494706_1280.jpg',
      name: '餐廳一號',
      rating: 3.4,
      category: '美式料理'
    },
    { id: 2,
      image: 'https://cdn.pixabay.com/photo/2017/03/30/15/47/churros-2188871_1280.jpg',
      name: '餐廳二號',
      rating: 4.9,
      category: '韓式料理'
    },
    { id: 3,
      image: 'https://cdn.pixabay.com/photo/2016/10/03/23/15/ice-1713160_1280.jpg',
      name: '餐廳三號',
      rating: 4.4,
      category: '美式料理'
    },
    { id: 4,
      image: 'https://via.placeholder.com/400x400/d3d3d3?text=Temp+Image',
      name: '餐廳四號',
      rating: 2.3,
      category: '中東料理'
    },
    { id: 5,
      image: 'https://via.placeholder.com/400x400/d3d3d3?text=Temp+Image',
      name: '餐廳五號',
      rating: 5.4,
      category: '中東料理'
    },
    { id: 6,
      image: 'https://via.placeholder.com/400x400/d3d3d3?text=Temp+Image',
      name: '餐廳六號',
      rating: 3.4,
      category: '中東料理'
    }
  ],
  more_restaurants: {
    count: 16,
    page: 3,
    rows: [
      { id: 1,
        image: 'https://cdn.pixabay.com/photo/2014/10/19/20/59/hamburger-494706_1280.jpg',
        name: '餐廳一號',
        rating: 3.4,
        category: '美式料理'
      },
      { id: 2,
        image: 'https://cdn.pixabay.com/photo/2017/03/30/15/47/churros-2188871_1280.jpg',
        name: '餐廳二號',
        rating: 4.9,
        category: '韓式料理'
      },
      { id: 3,
        image: 'https://cdn.pixabay.com/photo/2016/10/03/23/15/ice-1713160_1280.jpg',
        name: '餐廳三號',
        rating: 4.4,
        category: '美式料理'
      },
      { id: 4,
        image: 'https://via.placeholder.com/400x400/d3d3d3?text=Temp+Image',
        name: '餐廳四號',
        rating: 2.3,
        category: '中東料理'
      },
      { id: 5,
        image: 'https://via.placeholder.com/400x400/d3d3d3?text=Temp+Image',
        name: '餐廳五號',
        rating: 5.4,
        category: '中東料理'
      },
      { id: 6,
        image: 'https://via.placeholder.com/400x400/d3d3d3?text=Temp+Image',
        name: '餐廳六號',
        rating: 3.4,
        category: '中東料理'
      }
    ]
  },
  map: {
    center: {
      'chinese_name': '信義區',
      'eng_name': 'Xinyi',
      'lng': '121.5716697',
      'lat': '25.03062083'
    },
    restaurants: [
      {
        'id': 1,
        'name': '餐廳一',
        'lat': 25.0340,
        'lng': 121.5645
      },
      {
        'id': 2,
        'name': '餐廳二',
        'lat': 25.036643,
        'lng': 121.567678
      },
      {
        'id': 3,
        'name': '餐廳三',
        'lat': 25.033643,
        'lng': 121.566678
      },
      {
        'id': 4,
        'name': '餐廳四',
        'lat': 25.031569,
        'lng': 121.568579
      }
    ]
  },
  districts: [
    {
      'chinese_name': '大安區',
      'eng_name': "Da'an",
      'image': 'https://cdn.pixabay.com/photo/2013/11/13/21/14/san-francisco-210230_1280.jpg',
      'lng': '121.5434446',
      'lat': '25.02677012'
    },
    {
      'chinese_name': '信義區',
      'eng_name': 'Xinyi',
      'image': 'https://cdn.pixabay.com/photo/2019/09/23/14/34/nyc-4498752_1280.jpg',
      'lng': '121.5716697',
      'lat': '25.03062083'
    },
    {
      'chinese_name': '中山區',
      'eng_name': 'Zhongshan',
      'image': 'https://cdn.pixabay.com/photo/2018/04/25/09/26/eiffel-tower-3349075_1280.jpg',
      'lng': '121.7308913',
      'lat': '25.14986365'
    },
    {
      'chinese_name': '松山區',
      'eng_name': 'Songshan',
      'image': 'https://cdn.pixabay.com/photo/2016/10/31/04/19/lan-yang-museum-1784871_1280.jpg',
      'lng': '121.5575876',
      'lat': '25.05999101'
    }
  ]
}

export default {
  components: {
    Navbar,
    Footer,
    RestaurantBanner
  },
  data () {
    return {
      popular_restaurants: [],
      more_restaurants: {},
      map: {},
      districts: [],
      currentDistrict: ''
    }
  },
  created () {
    const { dist } = this.$route.query
    this.currentDistrict = dist
    this.fetchRestaurants(dist)
  },
  methods: {
    fetchRestaurants (dist) {
      // fetch data from api
      this.popular_restaurants = dummyRestaurantAndDistrict.popular_restaurants
      this.more_restaurants = dummyRestaurantAndDistrict.more_restaurants
      this.map = dummyRestaurantAndDistrict.map
      this.districts = dummyRestaurantAndDistrict.districts
    }
  }
}
</script>
