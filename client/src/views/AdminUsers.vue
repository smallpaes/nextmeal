<template>
  <section class="wrapper d-flex vh-100">
    <!--Left Side Navbar-->
    <AdminSideNavBar :nav-is-open="navIsOpen" />

    <!--Right Side Content-->
    <section class="users flex-fill">
      <!--Navbar toggler-->
      <NavbarToggler
        :nav-is-open="navIsOpen"
        @toggle-navbar="navIsOpen = !navIsOpen"
      />
      <h1 class="users-title">
        用戶管理
      </h1>
      <hr class="users-divider">

      <!--Filter And Search Panel-->
      <AdminFilterPanel
        :options="subscriptionStatus"
        :input-placeholder="'搜尋名稱'"
        :is-loading="isLoading"
        @after-search="handleAfterFilter({searchInput: $event, selectedOption: currentFilterOption})"
        @after-filter="handleAfterFilter({searchInput: currentSearchInput, selectedOption: $event})"
      >
        <template v-slot:filterOption>
          訂單狀態
        </template>
      </AdminFilterPanel>

      <!--Loader-->
      <Loader
        v-if="isLoading"
        :height="'300px'"
      />

      <transition
        name="slide"
        mode="out-in"
      >
        <template v-if="!isLoading">
          <!--User Data Table-->
          <AdminUsersTable
            v-if="users.length > 0"
            :users="users"
          />
          <!--Placeholder Messgae for Empty Data-->
          <PlaceholderMessage v-else>
            <i class="fas fa-search mr-2" />沒有符合的結果
          </PlaceholderMessage>
        </template>
      </transition>
    </section>
  </section>
</template>

<script>
import AdminSideNavBar from '../components/Navbar/AdminSideNavBar'
import NavbarToggler from '../components/Navbar/NavbarToggler'
import AdminFilterPanel from '../components/AdminFilterPanel'
import AdminUsersTable from '../components/AdminUsersTable.vue'
import PlaceholderMessage from '../components/Placeholder/Message'
import Loader from '../components/Loader'
import adminAPI from '../apis/admin'
import { Toast } from '../utils/helpers'

export default {
  components: {
    AdminSideNavBar,
    NavbarToggler,
    AdminFilterPanel,
    AdminUsersTable,
    PlaceholderMessage,
    Loader
  },
  data () {
    return {
      users: [],
      subscriptionStatus: ['active', 'inactive'],
      currentSearchInput: '',
      currentFilterOption: '',
      isLoading: true,
      navIsOpen: false
    }
  },
  created () {
    const { sub_status: subscriptionStatus = '', name = '' } = this.$route.query
    this.fetchUsers({ subscriptionStatus, name })
  },
  beforeRouteUpdate (to, from, next) {
    const { sub_status: subscriptionStatus = '', name = '' } = to.query
    this.fetchUsers({ subscriptionStatus, name })
    next()
  },
  methods: {
    async fetchUsers ({ subscriptionStatus, name }) {
      try {
        // fetch data from API
        const { data, statusText } = await adminAPI.users.getUsers({ subscriptionStatus, name })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // store data
        this.users = data.users
        this.subscriptionStatus = data.sub_status || this.subscriptionStatus
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
      }
    },
    handleAfterFilter (data) {
      // update loading status
      this.isLoading = true
      // reset data
      this.users = []
      this.currentFilterOption = data.selectedOption
      this.currentSearchInput = data.searchInput
      this.fetchUsers({ subscriptionStatus: this.currentFilterOption, name: this.currentSearchInput })
    }
  }
}
</script>

<style lang="scss" scoped>
@include slideAnimation(false);
@include fadeAnimation;

.wrapper {
    background-color: color(quinary);
}

.users {
    @include controlPanelLayout;
}
</style>
