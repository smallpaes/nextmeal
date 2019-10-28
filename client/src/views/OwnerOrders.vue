<template>
  <section class="wrapper d-flex vh-100">
    <SideNavBar />
    <section class="info flex-fill">
      <h1 class="info-title">
        餐廳資訊
      </h1>
      <hr class="info-divider">
      <OwnerOrdersTable :restaurants="restaurants" />
    </section>
  </section>
</template>

<script>
import SideNavBar from '../components/Navbar/SideNavBar'
import OwnerOrdersTable from '../components/OwnerOrdersTable.vue'

const dummyOrders = {
  '11:00': [
    {
      id: 1,
      require_date: '2019-10-28T03:00:00.000Z',
      order_status: '今日',
      time: '11:00',
      meals: {
        id: 2,
        name: '巨無霸套餐',
        image: 'https://images.pexels.com/photos/2454533/pexels-photo-2454533.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        OrderItem: {
          OrderId: 1,
          MealId: 2,
          quantity: 2
        }
      },
      User: {
        id: 1,
        name: 'Mike',
        email: 'mike@example.com'
      }
    },
    {
      id: 2,
      require_date: '2019-10-28T03:00:00.000Z',
      order_status: '今日',
      time: '11:00',
      meals: {
        id: 2,
        name: '巨無霸套餐',
        image: 'https://images.pexels.com/photos/2454533/pexels-photo-2454533.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        OrderItem: {
          OrderId: 2,
          MealId: 2,
          quantity: 10
        }
      },
      User: {
        id: 2,
        name: 'Micky',
        email: 'micky@example.com'
      }
    }
  ],
  '11:30': [
    {
      id: 3,
      require_date: '2019-10-28T03:00:00.000Z',
      order_status: '今日',
      time: '11:30',
      meals: {
        id: 2,
        name: '巨無霸套餐',
        image: 'https://images.pexels.com/photos/2454533/pexels-photo-2454533.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        OrderItem: {
          OrderId: 3,
          MealId: 2,
          quantity: 1
        }
      },
      User: {
        id: 1,
        name: 'Mike',
        email: 'mike@example.com'
      }
    },
    {
      id: 4,
      require_date: '2019-10-28T03:00:00.000Z',
      order_status: '今日',
      time: '11:30',
      meals: {
        id: 2,
        name: '巨無霸套餐',
        image: 'https://images.pexels.com/photos/2454533/pexels-photo-2454533.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        OrderItem: {
          OrderId: 4,
          MealId: 2,
          quantity: 4
        }
      },
      User: {
        id: 2,
        name: 'Micky',
        email: 'micky@example.com'
      }
    }
  ]
}

export default {
  components: {
    SideNavBar,
    OwnerOrdersTable
  },
  data () {
    return {
      orders: {}
    }
  },
  created () {
    this.fetchOrders()
  },
  method: {
    fetchOrders () {
      this.orders = {
        ...this.orders

      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
    background-color: color(quinary);
}

.info {
    padding: 2.3rem 2rem;
    max-width: 800px;
    margin-left: 80px;
    transition: margin-left .1s linear;

    &-title {
        size: size(lg);
    }

    &-divider {
        width: 100%;
    }

    @include response(md) {
        margin-left: 145px;
    }
}
</style>
