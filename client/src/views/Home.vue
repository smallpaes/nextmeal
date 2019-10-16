<template>
  <header>
    <Navbar />
    <HomeBanner />
    <OrderProcess />
  </header>
</template>

<script>
import Navbar from '../components/Navbar'
import HomeBanner from '../components/HomeBanner'
import OrderProcess from '../components/OrderProcess'
export default {
  name: 'Home',
  components: {
    Navbar,
    HomeBanner,
    OrderProcess
  }
}
</script>
