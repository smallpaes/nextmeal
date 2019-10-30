<template>
  <section>
    <header>
      <Navbar />
      <ImageBanner
        :background-photo="restaurant.image"
      />
    </header>
    <div class="info bg-white">
      <div class="info-container container pt-4 pb-3">
        <Breadcrumb
          :restaurant="restaurant"
        />
        <RestaurantInfo :restaurant="restaurant" />
      </div>
    </div>
    <section class="comments">
      <div class="comments-wrapper container py-5">
        <h3 class="comments-heading">
          評論(25)
        </h3>
        <div class="row mt-5">
          <CommentMedia
            v-for="comment in comments.rows"
            :key="comment.id"
            :comment="comment"
            class="col-12 col-md-10 col-lg-8 py-2"
          />
          <div class="btn-container col-12 col-md-10 col-lg-8 py-2">
            <button
              v-if="currentPage !== totalPage"
              class="btn mt-3"
              href="#"
              @click="fetchRestaurant(restaurant.id, currentPage + 1)"
            >
              瀏覽更多
            </button>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </section>
</template>

<script>
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ImageBanner from '../components/Banner/ImageBanner'
import Breadcrumb from '../components/Breadcrumb'
import RestaurantInfo from '../components/RestaurantInfo'
import CommentMedia from '../components/CommentMedia'

const dummyRestaurantAndDistrict = {
  restaurant: {
    id: 1,
    image: 'https://cdn.pixabay.com/photo/2014/10/19/20/59/hamburger-494706_1280.jpg',
    name: '餐廳一號',
    rating: 3.4,
    category: {
      name: '美式料理'
    },
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in',
    location: '信義區'
  },
  comments: {
    count: 16,
    pages: 3,
    rows: [
      { id: 1,
        user_text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad mi',
        res_text: 'Thanks!',
        rating: 4.3,
        createdAt: '2019-10-15T13:25:59.000Z',
        User: {
          id: 1,
          name: 'root',
          avatar: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
        }
      },
      { id: 2,
        user_text: 'lamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum d',
        res_text: 'Thanks for you suggestion',
        rating: 2.1,
        createdAt: '2019-10-11T10:25:59.000Z',
        User: {
          id: 2,
          name: 'user1',
          avatar: 'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
        }
      },
      { id: 3,
        user_text: 'irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt i',
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
        user_text: 'xcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
  district: {
    'chinese_name': '大安區',
    'eng_name': "Da'an",
    'image': 'https://cdn.pixabay.com/photo/2013/11/13/21/14/san-francisco-210230_1280.jpg',
    'lng': '121.5434446',
    'lat': '25.02677012'
  }
}

export default {
  components: {
    Navbar,
    Footer,
    ImageBanner,
    Breadcrumb,
    RestaurantInfo,
    CommentMedia
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
  beforeRouteUpdate (to, from, next) {
    // Reset page number
    this.currentPage = 0
    // Clear comments
    this.comments.rows = []
    const { restaurant_id: restaurantId } = to.params
    this.fetchRestaurant(restaurantId, this.currentPage + 1)
  },
  methods: {
    async fetchRestaurant (restaurantId, page) {
      // Get data from API
      this.restaurant = dummyRestaurantAndDistrict.restaurant || this.restaurant
      this.district = dummyRestaurantAndDistrict.district || this.district
      this.comments.rows = [
        ...this.comments.rows,
        ...dummyRestaurantAndDistrict.comments.rows
      ]
      this.totalPage = dummyRestaurantAndDistrict.comments.pages
      this.currentPage += 1
    }
  }
}
</script>

<style lang="scss" scoped>
.comments {
    &-heading {
        padding-left: .6rem;
        position: relative;
        font-size: size(lg);

        &::before {
            content: '';
            position: absolute;
            width: 4px;
            left: 0;
            height: 80%;
            top: 50%;
            transform: translateY(-50%);
            background-color: color(primary);
        }
    }
}

.btn-container {
    text-align: center;
    .btn {
        @include buttonOutline;
    }
}
</style>
