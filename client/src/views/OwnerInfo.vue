<template>
  <section class="wrapper d-flex vh-100">
    <SideNavBar />
    <section class="info flex-fill">
      <h1 class="info-title">
        餐廳資訊
      </h1>
      <hr class="info-divider">
      <RestaurantInfoForm />
    </section>
  </section>
</template>

<script>
import SideNavBar from '../components/Navbar/SideNavBar'
import RestaurantInfoForm from '../components/RestaurantInfoForm'
export default {
  components: {
    SideNavBar,
    RestaurantInfoForm
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
