<template>
  <section class="wrapper d-flex vh-100">
    <OwnerSideNavBar :nav-is-open="navIsOpen" />
    <section class="order flex-fill">
      <!--Navbar toggler-->
      <NavbarToggler
        :nav-is-open="navIsOpen"
        @toggle-navbar="navIsOpen = !navIsOpen"
      />
      <h1 class="order-title">
        今日訂單
      </h1>
      <hr class="order-divider">
      <template v-if="Object.keys(orders).length > 0">
        <OwnerOrdersTable
          v-for="(timeSlotOrders, timeSlot) in orders"
          :key="timeSlot"
          :orders="timeSlotOrders"
          :time-slot="timeSlot"
          class="mb-3"
        />
      </template>
      <PlaceholderMessage
        v-else
        class="placeholder-message col-12 py-4 text-center"
      >
        <h1><i class="fas fa-utensils" /></h1>
        今日無訂單
      </PlaceholderMessage>
    </section>
  </section>
</template>

<script>
import OwnerSideNavBar from '../components/Navbar/OwnerSideNavBar'
import NavbarToggler from '../components/Navbar/NavbarToggler'
import OwnerOrdersTable from '../components/OwnerOrdersTable.vue'
import ownerAPI from '../apis/owner'
import PlaceholderMessage from '../components/Placeholder/Message'
import { Toast } from '../utils/helpers'

export default {
  components: {
    OwnerSideNavBar,
    NavbarToggler,
    OwnerOrdersTable,
    PlaceholderMessage
  },
  data () {
    return {
      orders: {},
      isLoading: true,
      navIsOpen: false
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
    @include controlPanelLayout;
}
</style>
