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
        @after-search="handleAfterFilter({sub_status: $route.query.sub_status, name: $event})"
        @after-filter="handleAfterFilter({sub_status: $event, name: $route.query.name})"
      >
        <template v-slot:filterOption>
          訂閱狀態
        </template>
      </AdminFilterPanel>

      <!--User Data Table-->
      <transition
        name="slide"
        appear
      >
        <AdminUsersTable
          v-if="isLoading || !isLoading && users.length > 0"
          :is-loading="isLoading"
          :users="users"
        />
      </transition>

      <!--Pagination-->
      <transition name="fade">
        <Pagination
          v-if="totalPage > 1"
          class="mt-4"
          :total-page="totalPage"
          :current-page="Number($route.query.page) || 1"
          :query="{sub_status: this.$route.query.sub_status, name: this.$route.query.name}"
        />
      </transition>

      <!--Placeholder Messgae for Empty Data-->
      <PlaceholderMessage
        v-if="!isLoading && users.length === 0"
        class="users-placeholder"
      >
        <i class="fas fa-search mr-2" />沒有符合的結果
      </PlaceholderMessage>
    </section>
  </section>
</template>

<script>
import AdminSideNavBar from '../components/Navbar/AdminSideNavBar'
import NavbarToggler from '../components/Navbar/NavbarToggler'
import AdminFilterPanel from '../components/AdminFilterPanel'
import AdminUsersTable from '../components/AdminUsersTable.vue'
import PlaceholderMessage from '../components/Placeholder/Message'
import Pagination from '../components/Pagination'
import adminAPI from '../apis/admin'
import { Toast } from '../utils/helpers'

export default {
  components: {
    AdminSideNavBar,
    NavbarToggler,
    AdminFilterPanel,
    AdminUsersTable,
    PlaceholderMessage,
    Pagination
  },
  data () {
    return {
      users: [],
      subscriptionStatus: ['active', 'inactive'],
      totalPage: null,
      isLoading: true,
      navIsOpen: false
    }
  },
  created () {
    const { sub_status: subscriptionStatus, name, page } = this.$route.query
    this.fetchUsers(subscriptionStatus, name, page)
  },
  beforeRouteUpdate (to, from, next) {
    const { sub_status: subscriptionStatus, name, page } = to.query
    this.fetchUsers(subscriptionStatus, name, page)
    next()
  },
  methods: {
    async fetchUsers (subscriptionStatus = '', name = '', page = 1) {
      try {
        // update loading status
        this.isLoading = true
        // fetch data from API
        const { data, statusText } = await adminAPI.users.getUsers({ subscriptionStatus, name, page })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // store data
        this.users = data.users
        this.subscriptionStatus = data.sub_status || this.subscriptionStatus
        // update page data
        this.totalPage = data.pages
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
    handleAfterFilter (query) {
      this.$router.push({ name: 'admin-users', query })
    }
  }
}
</script>

<style lang="scss" scoped>
@include slideAnimation(false);
@include fadeAnimation(false);

.wrapper { background-color: color(quinary); }
.users { @include controlPanelLayout; }
</style>
