<template>
  <section class="wrapper d-flex vh-100">
    <AdminSideNavBar />
    <section class="restaurant flex-fill">
      <h1 class="restaurant-title">
        編輯餐廳
      </h1>
      <hr class="restaurant-divider">
      <RestaurantInfoForm />
    </section>
  </section>
</template>

<script>
import AdminSideNavBar from '../components/Navbar/AdminSideNavBar'
import RestaurantInfoForm from '../components/RestaurantInfoForm'

export default {
  components: {
    AdminSideNavBar,
    RestaurantInfoForm
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
    background-color: color(quinary);
}

.restaurant {
    padding: 2.3rem 2rem;
    max-width: 800px;
    margin-left: 80px;
    overflow-y: scroll;
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
