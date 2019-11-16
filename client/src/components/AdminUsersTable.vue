<template>
  <div class="table-wrapper table-borderless table-hover rounded-sm ">
    <table class="table m-0">
      <thead>
        <tr>
          <th scope="col">
            名稱
          </th>
          <th scope="col">
            用戶權限
          </th>
          <th scope="col">
            訂閱狀態
          </th>
          <th scope="col">
            訂閱方案
          </th>
          <th scope="col">
            點餐量
          </th>
        </tr>
      </thead>
      <tbody>
        <!--Display data-->
        <tr
          v-for="user in userData"
          :key="user.id"
          :class="{loading: isLoading}"
          @click="isLoading ? null : $router.push({name:'admin-user-edit', params: {user_id: user.id}})"
        >
          <td>
            <SkelentonBox
              v-if="isLoading"
              :width="'50px'"
            />
            <template v-else>
              {{ user.name }}
            </template>
          </td>
          <td>
            <SkelentonBox
              v-if="isLoading"
              :width="'50px'"
            />
            <template v-else>
              {{ user.role }}
            </template>
          </td>
          <td>
            <SkelentonBox
              v-if="isLoading"
              :width="'16px'"
            />
            <template v-else>
              <span
                :inner-html.prop="user.sub_status | getStatusIcon"
                :class="{isTrue: user.sub_status === 'active', isFalse: user.sub_status === 'inactive'}"
              />
            </template>
          </td>
          <td class="comment">
            <SkelentonBox
              v-if="isLoading"
              :width="'50px'"
            />
            <template v-else>
              {{ user.sub_description | getAmount }}
            </template>
          </td>
          <td>
            <SkelentonBox
              v-if="isLoading"
              :width="'50px'"
            />
            <template v-else>
              {{ user.order_num }} 餐
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import SkelentonBox from './Placeholder/SkeletonBox'

export default {
  components: {
    SkelentonBox
  },
  filters: {
    getStatusIcon (status) {
      if (status === 'active') return `<i class="fas fa-check"></i>`
      return `<i class="fas fa-times"></i>`
    },
    getAmount (number) {
      if (!number) return '-'
      return `${number.slice(3, 5)} 餐`
    }
  },
  props: {
    users: {
      type: Array,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    userData () {
      if (this.isLoading) return 10
      return this.users
    }
  }
}
</script>

<style lang="scss" scoped>
$headers: (
  1: '名稱',
  2: '用戶權限',
  3: '訂閱狀態',
  4: '訂閱方案',
  5: '點餐量'
);

// table layout for small screen
@include tableMobile;
// table layout for large screen
@include tableFullSize;

.isTrue {
  color: color(tertiary);
}

.isFalse {
  color: color(primary);
}
</style>
