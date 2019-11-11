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
        @after-search="handleAfterFilter({page: 0,searchInput: $event, selectedOption: currentFilterOption})"
        @after-filter="handleAfterFilter({page: 0, searchInput: currentSearchInput, selectedOption: $event})"
      >
        <template v-slot:filterOption>
          訂閱狀態
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
          <div
            v-if="users.length > 0"
            class="users-table"
          >
            <AdminUsersTable

              :users="users"
            />
            <div
              v-if="totalPage > 0 && currentPage !== totalPage"
              class="btn-container mt-3 mt-md-4"
            >
              <FetchMoreButton
                :is-fetching="isFetching"
                @fetch-more="fetchUsers(currentFilterOption, currentSearchInput, currentPage + 1)"
              />
            </div>
          </div>

          <!--Placeholder Messgae for Empty Data-->
          <PlaceholderMessage
            v-else
            class="users-placeholder"
          >
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
import FetchMoreButton from '../components/Button/FetchMoreButton'
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
    FetchMoreButton,
    Loader
  },
  data () {
    return {
      users: [],
      subscriptionStatus: ['active', 'inactive'],
      currentSearchInput: '',
      currentFilterOption: '',
      currentPage: 0,
      totalPage: null,
      isLoading: true,
      isFetching: false,
      navIsOpen: false
    }
  },
  created () {
    const { sub_status: subscriptionStatus = '', name = '' } = this.$route.query
    this.fetchUsers(subscriptionStatus, name, this.currentPage + 1)
  },
  beforeRouteUpdate (to, from, next) {
    // Reset current page
    this.currentPage = 0
    // clear existing data
    this.users = []
    const { sub_status: subscriptionStatus = '', name = '' } = to.query
    this.fetchUsers(subscriptionStatus, name, this.currentPage + 1)
    next()
  },
  methods: {
    async fetchUsers (subscriptionStatus, name, page) {
      try {
        // update fetching status
        this.isFetching = true
        // fetch data from API
        const { data, statusText } = await adminAPI.users.getUsers({ subscriptionStatus, name, page })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // store data
        this.users = [...this.users, ...data.users]
        this.subscriptionStatus = data.sub_status || this.subscriptionStatus
        // update page data
        this.totalPage = data.pages
        this.currentPage += 1
        // update loading status
        this.isLoading = false
        // update fetching status
        this.isFetching = false
      } catch (error) {
        // update loading status
        this.isLoading = false
        // update fetching status
        this.isFetching = false
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
      this.currentPage = 0
      this.users = []
      this.currentFilterOption = data.selectedOption
      this.currentSearchInput = data.searchInput
      this.fetchUsers(this.currentFilterOption, this.currentSearchInput, this.currentPage)
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

.btn-container {
  text-align: center;
  .btn {
    @include solidButton(150);

    @include response(md) {
      min-width: 200px;
    }
  }
}
</style>
