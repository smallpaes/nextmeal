<template>
  <section class="profile-container">
    <header>
      <Navbar />
    </header>
    <section class="container pt-4 pb-4 w-100">
      <div class="profile-wrapper row profil">
        <div class="profile-content-left col-12 col-md-3 p-2">
          <UserProfileCard />
        </div>
        <div class="col-12 col-md-9 p-2">
          <UserProfileForm />
        </div>
      </div>
    </section>
    <Footer class="w-100" />
  </section>
</template>

<script>
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import UserProfileCard from '../components/UserProfileCard'
import UserProfileForm from '../components/UserProfileForm'

export default {
  components: {
    Navbar,
    UserProfileCard,
    UserProfileForm,
    Footer
  },
  data () {
    return {
      user: {
        name: '',
        email: '',
        role: '',
        prefer: '',
        dob: '',
        avatar: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.profile {
    &-container {
        display: flex;
        flex-wrap: wrap;

        align-content: space-between;
        height: 100%;
    }

    &-wrapper {
        margin-top: 62px;
    }
}
</style>
