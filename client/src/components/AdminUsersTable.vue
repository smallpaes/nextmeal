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
        <tr
          v-for="user in users"
          :key="user.id"
          @click="$router.push({name:'admin-user-edit', params: {user_id: user.id}})"
        >
          <td>{{ user.name }}</td>
          <td>{{ user.role }}</td>
          <td>
            <span
              :inner-html.prop="user.subscription_status | getStatusIcon"
              :class="{isTrue: user.subscription_status === 'active', isFalse: user.subscription_status === 'inactive'}"
            />
          </td>
          <td class="comment">
            {{ user.sub_description | getAmount }}
          </td>
          <td>
            {{ user.order_num }} 餐
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
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
