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
        <!--Display data-->
        <tr
          v-for="order in orderData"
          :key="order.id"
        >
          <td>
            <SkelentonBox
              v-if="isLoading"
              :width="'35px'"
            />
            <template v-else>
              #{{ order.id }}
            </template>
          </td>
          <td>
            <SkelentonBox
              v-if="isLoading"
              :width="'48px'"
            />
            <template v-else>
              {{ order.User.name }}
            </template>
          </td>
          <td>
            <SkelentonBox
              v-if="isLoading"
              :width="'112px'"
            />
            <template v-else>
              {{ order.meals.Restaurant.name | textTruncate(10) }}
            </template>
          </td>
          <td>
            <SkelentonBox
              v-if="isLoading"
              :width="'35px'"
            />
            <template v-else>
              {{ order.date.slice(2, 6) }}
            </template>
          </td>
          <td>
            <SkelentonBox
              v-if="isLoading"
              :width="'40px'"
            />
            <template v-else>
              {{ order.time }}
            </template>
          </td>
          <td v-if="isLoading">
            <SkelentonBox
              v-if="isLoading"
              :width="'48px'"
            />
          </td>
          <template v-else>
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
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import adminAPI from '../apis/admin'
import SkelentonBox from './Placeholder/SkeletonBox'
import { textTruncateFilter } from '../utils/mixins'
import { Toast } from '../utils/helpers'

export default {
  components: {
    SkelentonBox
  },
  mixins: [textTruncateFilter],
  props: {
    orders: {
      type: Array,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isProcessing: false
    }
  },
  computed: {
    orderData () {
      if (this.isLoading) return 10
      return this.orders
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
