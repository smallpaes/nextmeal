<template>
  <section>
    <header>
      <Navbar />
    </header>
    <Footer />
  </section>
</template>

<script>
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default {
  components: {
    Navbar,
    Footer
  }
}
</script>
