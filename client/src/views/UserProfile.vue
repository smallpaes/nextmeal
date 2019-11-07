<template>
  <section class="profile-container">
    <!--Navbar-->
    <UserNavbar />
    <!--Loader-->
    <Loader
      v-if="isLoading"
      :height="'100vh'"
    />
    <transition name="slide">
      <section
        v-if="!isLoading"
        class="container pt-4 pb-4 w-100"
      >
        <div class="profile-wrapper row profil">
          <!--Profile Card-->
          <div class="profile-content-left col-12 col-md-3 p-2">
            <UserProfileCard />
          </div>
          <!--Profile Form-->
          <div class="col-12 col-md-9 p-2">
            <UserProfileForm
              :initial-user="user"
              :categories="categories"
              :initial-processing="isProcessing"
              @after-submit="handleAfterSubmit"
            />
          </div>
        </div>
      </section>
    </transition>
    <!--Footer-->
    <Footer class="w-100" />
  </section>
</template>

<script>
import UserNavbar from '../components/Navbar/UserNavbar'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import UserProfileCard from '../components/UserProfileCard'
import UserProfileForm from '../components/UserProfileForm'
import usersAPI from '../apis/users'
import { Toast } from '../utils/helpers'

export default {
  components: {
    UserNavbar,
    UserProfileCard,
    UserProfileForm,
    Footer,
    Loader
  },
  data () {
    return {
      user: {
        name: '',
        email: '',
        role: '',
        prefer: '',
        dob: '',
        image: '',
        lng: '',
        lat: '',
        location: ''
      },
      categories: [],
      isLoading: true,
      isProcessing: false
    }
  },
  created () {
    this.fetchUser()
  },
  methods: {
    async fetchUser () {
      try {
        // fetch data from API
        const { data, statusText } = await usersAPI.getProfile()
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // store data
        this.user = {
          ...this.user,
          ...data.user,
          dob: data.user.dob.slice(0, 10),
          image: data.user.avatar
        }
        this.categories = data.categories || this.categories
        // update loading status
        this.isLoading = false
      } catch (error) {
        // update loading status
        this.isLoading = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法取得資料，請稍後再試'
        })
      }
    },
    async handleAfterSubmit ({ formData, storedUserData }) {
      try {
        // update processing status
        this.isProcessing = true
        // update profile
        const { data, statusText } = await usersAPI.putProfile({ formData })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // update user state to Vuex
        this.$store.commit('setCurrentUser', storedUserData)
        // update processing
        this.isProcessing = false
        // notify user for successful update
        Toast.fire({
          type: 'success',
          title: '成功更新資料'
        })
      } catch (error) {
        // update loading status
        this.isProcessing = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法更新資料，請稍後再試'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@include slideAnimation;

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
