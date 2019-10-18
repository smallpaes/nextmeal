<template>
  <section>
    <header>
      <Navbar />
      <ImageBanner
        :background-photo="restaurant.image"
      />
    </header>
    <Footer />
  </section>
</template>

<script>
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ImageBanner from '../components/Banner/ImageBanner'

const dummyRestaurantAndDistrict = {
  restaurant: { id: 1,
    image: 'https://cdn.pixabay.com/photo/2014/10/19/20/59/hamburger-494706_1280.jpg',
    name: '餐廳一號',
    rating: 3.4,
    category: '美式料理'
  },
  comments: {
    count: 16,
    pages: 3,
    rows: [
      { id: 1,
        user_text: 'Awesome!',
        res_text: 'Thanks!',
        rating: 4.3,
        createdAt: '2019-10-15T13:25:59.000Z',
        User: {
          id: 1,
          name: 'root',
          avatar: 'https://via.placeholder.com/300x300/d3d3d3'
        }
      },
      { id: 2,
        user_text: 'Not my favorite, too spicy!',
        res_text: 'Thanks for you suggestion',
        rating: 2.1,
        createdAt: '2019-10-11T10:25:59.000Z',
        User: {
          id: 2,
          name: 'user1',
          avatar: 'https://via.placeholder.com/300x300/d3d3d3'
        }
      },
      { id: 3,
        user_text: 'Good!',
        res_text: 'Thanks!',
        rating: 4.8,
        createdAt: '2019-09-15T13:25:59.000Z',
        User: {
          id: 3,
          name: 'user2',
          avatar: 'https://via.placeholder.com/300x300/d3d3d3'
        }
      },
      { id: 4,
        user_text: 'The best!',
        res_text: 'Thanks!',
        rating: 4.9,
        createdAt: '2019-10-13T13:25:59.000Z',
        User: {
          id: 2,
          name: 'user1',
          avatar: 'https://via.placeholder.com/300x300/d3d3d3'
        }
      }
    ]
  },
  district: [
    {
      'chinese_name': '大安區',
      'eng_name': "Da'an",
      'image': 'https://cdn.pixabay.com/photo/2013/11/13/21/14/san-francisco-210230_1280.jpg',
      'lng': '121.5434446',
      'lat': '25.02677012'
    }
  ]
}

export default {
  components: {
    Navbar,
    Footer,
    ImageBanner
  },
  data () {
    return {
      restaurant: {},
      comments: {
        rows: []
      },
      district: {},
      currentPage: 0,
      totalPage: null
    }
  },
  created () {
    const { restaurant_id: restaurantId } = this.$route.params
    this.fetchRestaurant(restaurantId, this.currentPage + 1)
  },
  methods: {
    fetchRestaurant () {
      // Get data from API
      this.restaurant = dummyRestaurantAndDistrict.restaurant || this.restaurant
      this.district = dummyRestaurantAndDistrict.district || this.district
      this.comments.rows = [
        ...this.comments.rows,
        dummyRestaurantAndDistrict.comments.rows
      ]
      this.totalPage = dummyRestaurantAndDistrict.comments.pages
      this.currentPage += 1
    }
  }
}
</script>
