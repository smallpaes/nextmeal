<template>
  <div class="table-wrapper table-borderless table-hover rounded-sm ">
    <table class="table m-0">
      <thead>
        <tr>
          <th scope="col">
            名稱
          </th>
          <th scope="col">
            類別
          </th>
          <th scope="col">
            狀態
          </th>
          <th scope="col">
            方案
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
              :class="{isTrue: user.subscription_status, isFalse: !user.subscription_status}"
            />
          </td>
          <td class="comment">
            {{ user.sub_description | getAmount }}
          </td>
          <td>
            {{ user.order_num | getAmount }}
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
      if (status) return `<i class="fas fa-check"></i>`
      return `<i class="fas fa-times"></i>`
    },
    getAmount (number) {
      if (!Number(number)) return '-'
      return `${number} 餐`
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
    2: '類別',
    3: '狀態',
    4: '方案',
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
