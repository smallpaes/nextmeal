<template>
  <section class="restaurant-container">
    <header>
      <UserNavbar />
      <ImageBanner
        v-if="!isLoading"
        :background-photo="restaurant.image"
      />
    </header>
    <Loader v-if="isLoading" />
    <transition name="slide">
      <section
        v-if="!isLoading"
        class="restaurant-container-bottom"
      >
        <!--Restaurant Info Section-->
        <div
          class="info bg-white"
        >
          <div class="info-container container pt-4 pb-3">
            <Breadcrumb :restaurant="restaurant" />
            <RestaurantInfo
              :restaurant="restaurant"
              :is-loading="isLoading"
            />
          </div>
        </div>
        <!--Comment Section-->
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
                v-if="comments.rows.length === 0"
                class="col-12 col-md-10 col-lg-8 py-2 placeholder-message"
              >
                <i class="fas fa-ice-cream" />目前還沒有評論
              </div>
            </div>
          </div>
        </section>
      </section>
    </transition>
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
import Loader from '../components/Loader'
import restaurantsAPI from '../apis/restaurants'
import { Toast } from '../utils/helpers'

export default {
  components: {
    UserNavbar,
    Footer,
    ImageBanner,
    Breadcrumb,
    RestaurantInfo,
    CommentMedia,
    Loader
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
        // update loading status
        this.isLoading = false
      } catch (error) {
        // update loading status
        this.isLoading = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法取得餐廳資料，請稍後再試'
        })
        // rediect back to last page
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@include slideAnimation;

.restaurant {
  &-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
}

.comments {
  &-heading {
    position: relative;
    padding-left: .6rem;
    font-size: size(lg);

    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      width: 4px;
      height: 80%;
      content: '';
      background-color: color(primary);
      transform: translateY(-50%);
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
