<template>
  <section class="wrapper d-flex vh-100">
    <AdminSideNavBar :nav-is-open="navIsOpen" />
    <section class="user flex-fill">
      <!--Navbar toggler-->
      <NavbarToggler
        :nav-is-open="navIsOpen"
        @toggle-navbar="navIsOpen = !navIsOpen"
      />
      <h1 class="user-title">
        編輯用戶
      </h1>
      <hr class="user-divider">
      <UserProfileForm
        :initial-user="user"
        :roles="roles"
        :initial-processing="isProcessing"
        :categories="categories"
        @after-submit="handleAfterSubmit"
        @after-delete="handleAfterDelete"
      />
    </section>
  </section>
</template>

<script>
import AdminSideNavBar from '../components/Navbar/AdminSideNavBar'
import NavbarToggler from '../components/Navbar/NavbarToggler'
import UserProfileForm from '../components/UserProfileForm'
import adminAPI from '../apis/admin'
import { Toast } from '../utils/helpers'

export default {
  components: {
    AdminSideNavBar,
    NavbarToggler,
    UserProfileForm
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
      roles: [],
      isLoading: true,
      isProcessing: false,
      navIsOpen: false
    }
  },
  created () {
    const { user_id: userId } = this.$route.params
    this.fetchUser(userId)
  },
  methods: {
    async fetchUser (userId) {
      try {
        // fetch data from API
        const { data, statusText } = await adminAPI.users.getUser({ userId })
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
        this.roles = data.roles || this.roles
        // update loading status
        this.isLoading = false
      } catch (error) {
        // update loading status
        this.isLoading = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法取得用戶資料，請稍後再試'
        })
        // rediect back to last page
        this.$router.go(-1)
      }
    },
    async handleAfterSubmit ({ formData }) {
      try {
        // update processing status
        this.isProcessing = true
        // get user id
        const { user_id: userId } = this.$route.params
        // update profile
        const { data, statusText } = await adminAPI.users.putUser({ userId, formData })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // update processing
        this.isProcessing = false
        // redirect to admin users page
        this.$router.push({ name: 'admin-users' })
      } catch (error) {
        // update loading status
        this.isProcessing = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法更新用戶資料，請稍後再試'
        })
      }
    },
    async handleAfterDelete () {
      try {
        // update processing status
        this.isProcessing = true
        // get user id
        const { user_id: userId } = this.$route.params
        // update profile
        const { data, statusText } = await adminAPI.users.deleteUser({ userId })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // update processing
        this.isProcessing = false
        // redirect to admin users page
        this.$router.push({ name: 'admin-users' })
      } catch (error) {
        // update loading status
        this.isProcessing = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法刪除用戶資料，請稍後再試'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
    background-color: color(quinary);
}

.user {
    @include controlPanelLayout;
}
</style>
