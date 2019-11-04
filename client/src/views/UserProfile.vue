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
          <UserProfileForm
            :initial-user="user"
            :categories="categories"
            :initial-processing="isProcessing"
            @after-submit="handleAfterSubmit"
          />
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
import usersAPI from '../apis/users'
import { Toast } from '../utils/helpers'

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
        image: '',
        lng: '',
        lat: '',
        location: ''
      },
      categories: ['中式料理', '日本料理', '義大利料理', '墨西哥料理', '素食料理', '美式料理', '複合式料理'],
      isLoading: true,
      isProcessing: false
    }
  },
  created () {
    const { user_id: userId } = this.$route.params
    this.fetchUser(userId)
  },
  methods: {
    async fetchUser (userId = 19) {
      try {
        // fetch data from API
        const { data, statusText } = await usersAPI.getProfile({ userId })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // store data
        this.user = {
          ...this.user,
          ...data.user,
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
        // get user id
        const { user_id: userId = 7 } = this.$route.params
        // update profile
        const { data, statusText } = await usersAPI.putProfile({ userId, formData })
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
