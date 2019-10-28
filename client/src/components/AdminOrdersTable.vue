<template>
  <div class="table-wrapper table-borderless table-hover rounded-sm ">
    <table class="table m-0">
      <thead>
        <tr>
          <th scope="col">
            編號
          </th>
          <th scope="col">
            訂餐人
          </th>
          <th scope="col">
            餐廳
          </th>
          <th scope="col">
            日期
          </th>
          <th scope="col">
            時段
          </th>
          <th scope="col">
            訂單狀態
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="order in orders"
          :key="order.id"
        >
          <td>#{{ order.id }}</td>
          <td>{{ order.User.name }}</td>
          <td>{{ order.meals.Restaurant.name }}</td>
          <td>{{ order.date.slice(4, 8) }}</td>
          <td>{{ order.time }}</td>
          <td v-if="order.order_status === '取消'">
            已取消
          </td>
          <td
            v-else
            class="cancel"
            @click="cancelOrder(order.id)"
          >
            <i
              class="fas fa-times"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    orders: {
      type: Array,
      required: true
    }
  },
  methods: {
    cancelOrder (orderId) {
      // PUT /api/admin/orders/:order_id
      console.log(orderId)
      this.$emit('after-cancel', orderId)
    }
  }
}
</script>

<style lang="scss" scoped>
$headers: (
    1: '編號',
    2: '訂餐人',
    3: '餐廳',
    4: '日期',
    5: '成交量',
    6: '狀態'
);

// table layout for small screen
@include tableMobile;
// table layout for large screen
@include tableFullSize;

.table tbody tr:hover {
    cursor: unset;
}

.cancel {
    .fa-times {
        color: color(primary);
        cursor: pointer;
    }
}
</style>
