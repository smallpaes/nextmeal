<template>
  <section class="wrapper d-flex vh-100">
    <AdminSideNavBar />
    <section class="user flex-fill">
      <h1 class="user-title">
        編輯用戶
      </h1>
      <hr class="user-divider">
      <UserProfileForm />
    </section>
  </section>
</template>

<script>
import AdminSideNavBar from '../components/Navbar/AdminSideNavBar'
import UserProfileForm from '../components/UserProfileForm'

export default {
  components: {
    AdminSideNavBar,
    UserProfileForm
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
    background-color: color(quinary);
}

.user {
    padding: 2.3rem 2rem;
    max-width: 800px;
    margin-left: 80px;
    overflow-y: scroll;
    transition: margin-left .1s linear;

    &-title {
        size: size(lg);
    }

    @include response(md) {
        margin-left: 145px;
    }
}
</style>
