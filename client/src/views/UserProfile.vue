<template>
  <section>
    <header>
      <Navbar />
    </header>
    <section class="container pt-4 pb-4">
      <div class="profile-wrapper row profil">
        <div class="profile-content-left col-12 col-md-3 p-2">
          <UserProfileCard />
        </div>
        <div class="col-12 col-md-9 p-2">
          <UserProfileForm />
        </div>
      </div>
    </section>
    <Footer />
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
  },
  created () {

  },
  methods: {
    fetchUser () {
      // fetch full user data from API
    }
  }
}
</script>

<style lang="scss" scoped>
.profile {
    &-wrapper {
        margin-top: 62px;
    }
}

// .btn-container {
//     text-align: center;
//     .btn {
//         @include buttonOutline;
//     }
// }
</style>
