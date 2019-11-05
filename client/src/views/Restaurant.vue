<template>
  <section>
    <header>
      <UserNavbar />
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
          評論({{ comments.rows.length }})
        </h3>
        <div class="row mt-5">
          <CommentMedia
            v-for="comment in comments.rows"
            :key="comment.id"
            :comment="comment"
            class="col-12 col-md-10 col-lg-8 py-2"
          />
          <div
            v-if="totalPage > 0 && currentPage !== totalPage"
            class="btn-container col-12 col-md-10 col-lg-8 py-2"
          >
            <button
              class="btn mt-3"
              href="#"
              @click="fetchRestaurant(restaurant.id, currentPage + 1)"
            >
              瀏覽更多
            </button>
          </div>
          <div
            v-else
            class="col-12 col-md-10 col-lg-8 py-2 placeholder-message"
          >
            <i class="fas fa-ice-cream" />目前還沒有評論
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </section>
</template>

<script>
import UserNavbar from '../components/Navbar/UserNavbar'
import Footer from '../components/Footer'
import ImageBanner from '../components/Banner/ImageBanner'
import Breadcrumb from '../components/Breadcrumb'
import RestaurantInfo from '../components/RestaurantInfo'
import CommentMedia from '../components/CommentMedia'
import restaurantsAPI from '../apis/restaurants'
import { Toast } from '../utils/helpers'

export default {
  components: {
    UserNavbar,
    Footer,
    ImageBanner,
    Breadcrumb,
    RestaurantInfo,
    CommentMedia
  },
  data () {
    return {
      restaurant: {
        id: 1,
        image: '',
        name: '',
        rating: -1,
        Category: {
          name: ''
        },
        description: '',
        location: ''
      },
      comments: {
        rows: []
      },
      district: {},
      currentPage: 0,
      totalPage: null,
      isLoading: true
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
      try {
        // fetch data from API
        const { data, statusText } = await restaurantsAPI.getRestaurant({ restaurantId, page })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)

        // store data
        this.restaurant = data.restaurant || this.restaurant
        this.district = data.districts.filter(dis => dis.chinese_name === data.restaurant.location)[0] || this.district
        this.comments.rows = [
          ...this.comments.rows,
          ...data.comments.rows
        ]
        this.totalPage = data.comments.pages
        this.currentPage += 1
      } catch (error) {
        // update loading status
        this.isLoading = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法取得餐廳資料，請稍後再試'
        })
      }
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

.placeholder-message {
  color: lighten(color(secondary), 20%);
}

.btn-container {
    text-align: center;
    .btn {
        @include buttonOutline;
    }
}
</style>
