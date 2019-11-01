<template>
  <section class="wrapper d-flex vh-100">
    <SideNavBar />
    <section class="order flex-fill">
      <h1 class="order-title">
        今日訂單
      </h1>
      <hr class="order-divider">
      <OwnerOrdersTable
        v-for="(timeSlotOrders, timeSlot) in orders"
        :key="timeSlot"
        :orders="timeSlotOrders"
        :time-slot="timeSlot"
        class="mb-3"
      />
    </section>
  </section>
</template>

<script>
import SideNavBar from '../components/Navbar/SideNavBar'
import OwnerOrdersTable from '../components/OwnerOrdersTable.vue'
import ownerAPI from '../apis/owner'
import { Toast } from '../utils/helpers'

export default {
  components: {
    SideNavBar,
    OwnerOrdersTable
  },
  data () {
    return {
      orders: {},
      isLoading: true
    }
  },
  created () {
    this.fetchOrders()
  },
  methods: {
    async fetchOrders () {
      try {
        // fetch data from API
        const { data, statusText } = await ownerAPI.orders.getOrders()
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // store data
        this.orders = {
          ...this.orders,
          ...data.orders
        }
      } catch (error) {
        // update loading status
        this.isLoading = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法取得訂單，請稍後再試'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
    background-color: color(quinary);
}

.order {
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
