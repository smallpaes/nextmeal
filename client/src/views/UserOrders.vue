<template>
  <section class="order-container">
    <header>
      <Navbar />
    </header>
    <section class="container pt-4 pb-4 w-100">
      <div class="order-wrapper row profil">
        <div class="order-profile col-12 col-md-3 p-2">
          <UserProfileCard />
        </div>
        <div class="order-display col-12 col-md-9 p-2">
          <div class="order-display-wrapper rounded shadow-sm p-3">
            <OrderNavPill class="m-0" />
            <hr class="order-display-divider">
            <OrderCard
              v-for="order in orders"
              :key="order.id"
              :order="order"
              class="pb-2 px-0 mb-3"
            />
            <div class="btn-container">
              <button
                v-if="currentPage !== totalPage"
                class="btn"
                href="#"
                @click="fetchOrders(status, currentPage + 1)"
              >
                瀏覽更多
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer class="w-100" />
  </section>
</template>

<script>
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import OrderNavPill from '../components/Navbar/OrderNavPill'
import OrderCard from '../components/Card/OrderCard'
import UserProfileCard from '../components/UserProfileCard'

const dummyOrders = {
  orders: [
    {
      id: 2,
      require_date: '2019-10-27T12:12:32.000Z',
      order_status: 'today',
      amount: 2,
      hasComment: true,
      meals: {
        id: 2,
        name: '巨無霸套餐',
        description: '來自德州的巨無霸牛肉漢堡與特製醬料，搭配據杯可樂與現削現炸地瓜薯條，滿足你的味蕾',
        image: 'https://images.pexels.com/photos/2454533/pexels-photo-2454533.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        Restaurant: {
          id: 1,
          name: '美國家鄉菜',
          rating: 4.8
        },
        OrderItem: {
          OrderId: 2,
          MealId: 2,
          quantity: 2
        }
      }
    },
    {
      id: 3,
      require_date: '2019-10-27T12:12:32.000Z',
      order_status: 'today',
      amount: 1,
      hasComment: false,
      meals: {
        id: 1,
        name: '宮保雞丁套餐',
        description: '祖傳90年四川辣椒大火快炒放山雞,搭配健康糙米飯與新竹貢丸攤,午餐另外附贈知名淡水阿婆酸梅湯,幫助餐後解膩!祖傳90年四川辣椒大火快炒放山雞,搭配健康糙米飯與新竹貢丸攤!午餐另外附贈知名淡',
        image: 'https://images.pexels.com/photos/2454533/pexels-photo-2454533.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        Restaurant: {
          id: 1,
          name: '美國家鄉菜',
          rating: 4.8
        },
        OrderItem: {
          OrderId: 3,
          MealId: 1,
          quantity: 1
        }
      }
    }
  ],
  pages: 5
}

export default {
  components: {
    Navbar,
    UserProfileCard,
    OrderNavPill,
    OrderCard,
    Footer
  },
  data () {
    return {
      orders: [],
      currentPage: 0,
      currentStatus: '',
      totalPage: null
    }
  },
  created () {
    const { status } = this.$route.query
    this.currentStatus = status || 'today'
    this.fetchOrders(status, this.currentPage + 1)
  },
  beforeRouteUpdate (to, from, next) {
    // Reset current page
    this.currentPage = 0
    // clear existing orders
    this.orders = []
    // get the status
    const { status } = to.query
    this.currentStatus = status || 'today'
    this.fetchOrders(status)
    next()
  },
  methods: {
    fetchOrders (status, page) {
      this.isLoading = true
      // fetch order from API
      this.orders = [
        ...this.orders,
        ...dummyOrders.orders
      ]
      this.totalPage = dummyOrders.pages
      this.currentPage += 1
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.order {
    &-container {
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
        height: 100%;
    }

    &-wrapper {
        margin-top: 62px;
    }

    &-display {
        &-wrapper {
            background-color: color(quaternary);
        }

        &-divider {
            width: 100%;
            margin-top: 0;
        }
    }
}

.btn-container {
    text-align: center;
    .btn {
        @include solidButton(100, 1, secondary);
        padding: .2rem 0;

        @include response(md) {
            min-width: 150px;
            padding: .25em 0;
        }
    }
}
</style>
