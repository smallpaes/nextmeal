<template>
  <section>
    <header>
      <Navbar />
      <ImageHeaderBanner
        :background-photo="banner.image"
        :banner-height="banner.height"
      >
        <template v-slot:header>
          <h1 class="banner-content-title">
            訂單憑證
          </h1>
          <h3
            class="banner-content-description"
          >
            訂單與領餐資訊
          </h3>
        </template>
      </ImageHeaderBanner>
    </header>
    <!--Display order detail-->
    <section
      class="order-wrapper"
    >
      <div class="container order-container">
        <div
          class="row order-content p-3"
        >
          <MealHorizontalCard
            :order="order"
            class="order-display"
          />
          <OrderDetail
            :order="order.orderDetail"
            class="order-display mt-3"
          />
          <OrderRestaurantDetail
            :restaurant="order.restaurant"
            class="order-display mt-3"
          />

          <!--Show buttons when it's tomorrow's order -->
          <div
            v-if="order.isEditable"
            class="btn-container text-center mt-4"
          >
            <router-link
              class="btn btn-edit"
              :to="{name: 'order-edit', params: {order_id: $route.params.order_id}}"
            >
              編輯訂單
            </router-link>

            <button
              class="btn btn-cancel"
              type="button"
              @click.stop.prevent="deleteOrder"
            >
              取消訂單
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
import ImageHeaderBanner from '../components/Banner/ImageHeaderBanner'
import MealHorizontalCard from '../components/Card/MealHorizontalCard'
import OrderDetail from '../components/OrderDetail'
import OrderRestaurantDetail from '../components/OrderRestaurantDetail'
import Footer from '../components/Footer'
import { isAfterTodayMethod } from '../utils/mixins'

const dummyOrder = {
  id: 1,
  require_date: '2019-10-28T11:30:00.000Z',
  meals: {
    id: 2,
    name: '巨無霸套餐',
    description: '來自德州的巨無霸牛肉漢堡與特製醬料，搭配據杯可樂與現削現炸地瓜薯條，滿足你的味蕾',
    image: 'https://images.pexels.com/photos/2454533/pexels-photo-2454533.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    quantity: 20,
    Restaurant: {
      id: 1,
      name: '美國家鄉菜',
      rating: 4.8,
      distance: 220,
      tel: '2333-3333',
      address: '台北市大安區延吉街100號',
      lat: 25.0340,
      lng: 121.5645
    },
    OrderItem: {
      OrderId: 2,
      MealId: 2,
      quantity: 3
    }
  }
}

export default {
  components: {
    Navbar,
    ImageHeaderBanner,
    MealHorizontalCard,
    OrderDetail,
    OrderRestaurantDetail,
    Footer
  },
  mixins: [isAfterTodayMethod],
  data () {
    return {
      banner: {
        image: 'https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        height: 450
      },
      order: {}
    }
  },
  beforeRouteUpdate (to, from, next) {
    const { order_id: orderId } = to.params
    this.fetchOrder(orderId)
    next()
  },
  created () {
    const { order_id: orderId } = this.$route.params
    this.fetchOrder(orderId)
  },
  methods: {
    fetchOrder (orderId) {
      // fetch order data from API

      // retrieve data
      const { meals: { Restaurant: restaurant, OrderItem, ...meal }, require_date: requireDate } = dummyOrder
      // save data
      this.order = {
        ...this.order,
        restaurant,
        meal,
        orderDetail: {
          ...OrderItem,
          time: requireDate.split('T')[1].slice(0, 5),
          date: requireDate.split('T')[0].slice(0, 10)
        },
        isEditable: this.isAfterToday(requireDate.split('T')[0].slice(0, 10))
      }
    },
    deleteOrder () {
      // PUT /api/order/:order_id/cancel
      console.log(this.$route.params.order_id)
      // redirect back to /user/order/tomorrow
      this.$router.push({ name: 'order-tomorrow' })
    }
  }
}
</script>

<style lang="scss" scoped>
.order {
  &-content {
    position: relative;
    top: -7rem;
  }

  &-display {
    margin: 0 auto;
    max-width: 760px;
  }
}

.btn-container {
    width: 100%;
    .btn {
        margin-left: .8rem;
        padding: .1rem;
        line-height: 1.8rem;

        &-edit {
            @include solidButton(80, .3, tertiary);
        }

        &-cancel {
            @include solidButton(80, .3, primary);
        }

        @include response(md) {
            min-width: 180px;
            padding: .2rem .5rem;
            margin-left: 1rem;
        }
    }
}
</style>
