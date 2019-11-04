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
            餐點評論
          </h1>
          <h3
            class="banner-content-description"
          >
            提供您對餐點的想法
          </h3>
        </template>
      </ImageHeaderBanner>
    </header>
    <!--Display order form-->
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
          <OrderCommentForm
            class="order-display mt-3"
            @after-submit="handleAfterSubmit"
          />
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
import OrderCommentForm from '../components/OrderCommentForm'
import Footer from '../components/Footer'

const dummyOrder = {
  order: {
    userIid: 1,
    amount: 9,
    order_date: '2019-10-27T13:30:00.000Z',
    require_date: '2019-10-27T13:30:00.000Z',
    meals: {
      name: '巨無霸套餐',
      description: '來自德州的巨無霸牛肉漢堡與特製醬料，搭配據杯可樂與現削現炸地瓜薯條，滿足你的味蕾',
      image: 'https://images.pexels.com/photos/2454533/pexels-photo-2454533.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      Restaurant: {
        id: 1,
        name: '美國家鄉菜'
      }
    },
    OrderItem: {
      OrderId: 2,
      MealId: 2,
      quantity: 9
    }
  }
}

export default {
  components: {
    Navbar,
    ImageHeaderBanner,
    MealHorizontalCard,
    OrderCommentForm,
    Footer
  },
  data () {
    return {
      banner: {
        image: 'https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        height: 450
      },
      order: {}
    }
  },
  created () {
    const { order_id: orderId } = this.$route.params
    this.fetchOrder(orderId)
  },
  methods: {
    fetchOrder (orderId) {
      // fetch order data from API

      // retrieve data
      const { order: { meals: { Restaurant: restaurant, ...meal } } } = dummyOrder

      // save data
      this.order = { ...this.order, restaurant, meal }
    },
    handleAfterSubmit (formData) {
      // PUT /api/order/:order_id
      console.log(formData)
      // redirect to order detail page
      this.$router.push({ name: 'order', params: { order_id: this.$route.params.order_id } })
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
</style>
