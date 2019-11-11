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
          <td>{{ order.meals.Restaurant.name | textTruncate(10) }}</td>
          <td>{{ order.date.slice(2, 6) }}</td>
          <td>{{ order.time }}</td>
          <td v-if="order.order_status === '取消'">
            已取消
          </td>
          <td
            v-else
            :class="{pointer: !isProcessing, wait: isProcessing}"
            @click="isProcessing ? null : cancelOrder(order.id)"
          >
            未取消
            <i class="fas fa-trash ml-1" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import adminAPI from '../apis/admin'
import { textTruncateFilter } from '../utils/mixins'
import { Toast } from '../utils/helpers'

export default {
  mixins: [textTruncateFilter],
  props: {
    orders: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isProcessing: false
    }
  },
  methods: {
    async cancelOrder (orderId) {
      try {
        // update processing status
        this.isProcessing = true
        // cancel the oreder
        const { data, statusText } = await adminAPI.orders.putOrder({ orderId })
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // notify parent
        this.$emit('after-cancel', orderId)
        // update processing status
        this.isProcessing = false
      } catch (error) {
        // update processing status
        this.isProcessing = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法取消訂單，請稍後再試'
        })
      }
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

.pointer {
  cursor: pointer;
}

.wait {
  cursor: wait;
}
</style>
