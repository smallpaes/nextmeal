<template>
  <section class="wrapper d-flex vh-100">
    <AdminSideNavBar />
    <section class="users flex-fill">
      <h1 class="users-title">
        用戶管理
      </h1>
      <hr class="users-divider">
      <AdminFilterPanel
        :options="subscriptionStatus"
        :input-placeholder="'搜尋名稱'"
        @after-search="handleAfterSearch"
        @after-filter="handleAfterFilter"
      >
        <template v-slot:filterOption>
          訂單狀態
        </template>
      </AdminFilterPanel>
      <AdminUsersTable
        v-if="users.length > 0"
        :users="users"
      />
      <PlaceholderMessage v-else>
        <i class="fas fa-search mr-2" />沒有符合的結果
      </PlaceholderMessage>
    </section>
  </section>
</template>

<script>
import AdminSideNavBar from '../components/Navbar/AdminSideNavBar'
import AdminFilterPanel from '../components/AdminFilterPanel'
import AdminUsersTable from '../components/AdminUsersTable.vue'
import PlaceholderMessage from '../components/Placeholder/Message'
import adminAPI from '../apis/admin'
import { Toast } from '../utils/helpers'

const dummyUsers = {
  users: [
    {
      id: 1,
      name: 'user1',
      role: 'Owner',
      subscription_status: true,
      sub_description: '10',
      order_num: 20
    },
    {
      id: 2,
      name: 'user2',
      role: 'User',
      subscription_status: true,
      sub_description: '20',
      order_num: 20
    },
    {
      id: 3,
      name: 'user3',
      role: 'User',
      subscription_status: true,
      sub_description: '10',
      order_num: 20
    },
    {
      id: 4,
      name: 'user4',
      role: 'Owner',
      subscription_status: false,
      sub_description: null,
      order_num: 30
    },
    {
      id: 5,
      name: 'user5',
      role: 'Owner',
      subscription_status: true,
      sub_description: '20',
      order_num: 20
    },
    {
      id: 6,
      name: 'user6',
      role: 'Owner',
      subscription_status: true,
      sub_description: '10',
      order_num: 20
    }
  ],
  subscription_status: ['已訂閱', '未訂閱']
}

export default {
  components: {
    AdminSideNavBar,
    AdminFilterPanel,
    AdminUsersTable,
    PlaceholderMessage
  },
  data () {
    return {
      users: [],
      subscriptionStatus: [],
      currentSearchInput: '',
      currentFilterOption: '',
      isLoading: true
    }
  },
  created () {
    const { payment_status: paymentStatus = '', name = '' } = this.$route.query
    this.fetchUsers({ paymentStatus, name })
  },
  beforeRouteUpdate (to, from, next) {
    const { payment_status: paymentStatus = '', name = '' } = to.query
    this.fetchUsers({ paymentStatus, name })
    next()
  },
  methods: {
    async fetchUsers ({ paymentStatus, name }) {
      try {
        // fetch data from API
        const { data, statusText } = await adminAPI.users.getUsers({ paymentStatus, name })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // store data
        this.users = data.users
        this.subscriptionStatus = data.subscription_status || this.subscriptionStatus
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
    handleAfterSearch (searchInput) {
      this.currentSearchInput = searchInput
      this.fetchUsers({ paymentStatus: this.currentFilterOption, name: this.currentSearchInput })
    },
    handleAfterFilter (selectedOption) {
      this.currentFilterOption = selectedOption
      this.fetchUsers({ paymentStatus: this.currentFilterOption, name: this.currentSearchInput })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
    background-color: color(quinary);
}

.users {
    padding: 2.3rem 2rem;
    max-width: 800px;
    margin-left: 80px;
    transition: margin-left .1s linear;
    overflow-y: scroll;

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
