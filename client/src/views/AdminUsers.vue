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
      <AdminUsersTable :users="users" />
    </section>
  </section>
</template>

<script>
import AdminSideNavBar from '../components/Navbar/AdminSideNavBar'
import AdminFilterPanel from '../components/AdminFilterPanel'
import AdminUsersTable from '../components/AdminUsersTable.vue'

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
    AdminUsersTable
  },
  data () {
    return {
      users: [],
      subscriptionStatus: [],
      currentSearchInput: '',
      currentFilterOption: ''
    }
  },
  created () {
    this.fetchUsers()
  },
  beforeRouteUpdate () {
    this.fetchUsers()
  },
  methods: {
    fetchUsers (name, status) {
      // fetch data from API
      this.users = dummyUsers.users
      this.subscriptionStatus = dummyUsers.subscription_status || this.subscriptionStatus
    },
    handleAfterSearch (searchInput) {
      this.currentSearchInput = searchInput
      this.fetchUsers(this.currentSearchInput, this.currentFilterOption)
    },
    handleAfterFilter (selectedOption) {
      this.currentFilterOption = selectedOption
      this.fetchUsers(this.currentSearchInput, this.currentFilterOption)
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
