<template>
  <section>
    <header>
      <Navbar />
      <HomeBanner />
      <OrderProcess />
    </header>
    <section class="popular">
      <div class="container pt-3 pb-5">
        <div class="popular-heading">
          <h1 class="popular-heading-title">
            熱門餐廳
          </h1>
          <p class="popular-heading-description">
            嘗試最受歡迎的餐廳
          </p>
        </div>
        <RestaurantCarousel :popular-restaurants="popular_restaurants" />
      </div>
    </section>
    <section class="districts">
      <div class="container pt-3 pb-5">
        <div class="popular-heading">
          <h1 class="popular-heading-title">
            熱門地區
          </h1>
          <p class="popular-heading-description">
            探索各地區熱門美食
          </p>
        </div>
        <Districts :districts="districts" />
      </div>
    </section>
    <Questions />
  </section>
</template>

<script>
import Navbar from '../components/Navbar'
import HomeBanner from '../components/HomeBanner'
import OrderProcess from '../components/OrderProcess'
import RestaurantCarousel from '../components/RestaurantCarousel'
import Districts from '../components/Districts'
import Questions from '../components/Questions'

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
  name: 'Home',
  components: {
    Navbar,
    HomeBanner,
    OrderProcess,
    RestaurantCarousel,
    Districts,
    Questions
  },
  data () {
    return {
      popular_restaurants: [],
      districts: []
    }
  },
  created () {
    this.fetchRestaurantAndDistrict()
  },
  methods: {
    fetchRestaurantAndDistrict () {
      // fetch data from API
      this.popular_restaurants = dummyRestaurantAndDistrict.popular_restaurants
      this.districts = dummyRestaurantAndDistrict.districts
    }
  }
}
</script>

<style lang="scss" scoped>
.popular {
    @include headingStyling;

    &-heading {
      text-align: center;
    }
}
</style>
