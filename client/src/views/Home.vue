<template>
  <header>
    <Navbar />
    <HomeBanner />
  </header>
</template>

<script>
import Navbar from '../components/Navbar'
import HomeBanner from '../components/HomeBanner'
export default {
  name: 'Home',
  components: {
    Navbar,
    HomeBanner
  }
}
</script>
