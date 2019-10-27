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
            編輯餐點
          </h1>
          <h3
            class="banner-content-description"
          >
            更改數量或領餐時間
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
          <OrderForm
            class="order-display mt-3"
            :order-info="{quantity: order.meal.quantity + order.orderData.quantity, timeSlots: order.timeSlots}"
            :initial-order="order.orderData"
            @after-submit="handleAfterSubmit"
          >
            <template #submit>
              更新訂單
            </template>
          </OrderForm>
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
import OrderForm from '../components/OrderForm'
import Footer from '../components/Footer'

const dummyOrder = {
  order: {
    id: 1,
    amount: 9,
    require_date: '2019-10-27T13:30:00.000Z',
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
        distance: 220
      }
    },
    OrderItem: {
      OrderId: 2,
      Meal: 2
    }
  },
  time_slots: ['11:00', '11:30', '12:00', '12:30', '13:00', '13:30']
}

export default {
  components: {
    Navbar,
    ImageHeaderBanner,
    MealHorizontalCard,
    OrderForm,
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
      const { order: { meals: { Restaurant: restaurant, ...meal }, amount: quantity, require_date: requireDate }, time_slots: timeSlots } = dummyOrder
      const orderData = {
        quantity,
        time: requireDate.split('T')[1].slice(0, 5)
      }

      // save data
      this.order = { ...this.order, restaurant, meal, orderData, timeSlots }
    },
    handleOrder (mealItem) {
      this.chosenMeal = mealItem
    },
    handleAfterSubmit (formData) {
      // PUT /api/order/:order_id
      console.log(formData)
    }
  }
}
</script>

<style lang="scss" scoped>
.meal {
    &-content {
        position: relative;
        top: -7rem;
    }

    &-card {
        &:first-child {
            @include response(lg) {
                margin-left: 8.333333%;
            }
        }
    }
}

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
