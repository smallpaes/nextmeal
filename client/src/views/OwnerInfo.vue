<template>
  <section class="wrapper d-flex h-100">
    <SideNavBar />
    <section class="info flex-fill">
      <h1 class="info-title">
        餐廳資訊
      </h1>
      <hr class="info-divider">
      <OwnerInfoForm />
    </section>
  </section>
</template>

<script>
import SideNavBar from '../components/Navbar/SideNavBar'
import OwnerInfoForm from '../components/OwnerInfoForm'
export default {
  components: {
    SideNavBar,
    OwnerInfoForm
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

    &-title {
        size: size(lg);
    }

    &-divider {
        width: 100%;
    }
}
</style>
