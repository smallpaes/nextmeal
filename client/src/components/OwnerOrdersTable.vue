<template>
  <div class="card rounded-sm border-0 shadow-sm">
    <div class="card-header">
      <h4 class="card-title mb-1">
        {{ timeSlot }}
      </h4>
      <p class="card-text">
        共需準備 {{ totalMeals }} 份餐點
      </p>
    </div>
    <div class="card-body p-0">
      <div class="table-wrapper table-borderless table-hover rounded-sm ">
        <table class="table m-0">
          <thead>
            <tr>
              <th scope="col">
                訂單編號
              </th>
              <th scope="col">
                取餐人
              </th>
              <th scope="col">
                餐點數量
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
              <td>{{ order.meals.OrderItem.quantity }} 份</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orders: {
      type: Array,
      required: true
    },
    timeSlot: {
      type: String,
      required: true
    }
  },
  computed: {
    totalMeals () {
      // Get total meals needed to be prepared
      return this.orders.reduce((acc, cur) => acc + cur.meals.OrderItem.quantity, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
$headers: (
  1: '編號',
  2: '客戶',
  3: '數量'
);

// table layout for small screen
@include tableMobile;
// table layout for large screen
@include tableFullSize;

.high-rating { color: color(tertiary); }
.low-rating { color: color(primary); }

.card {
  &-header { background-color: lighten(color(secondary), 10%); }

  &-title { color: color(quaternary); }

  &-text {
    font-size: size(xs);
    color: lighten(color(secondary), 50%);
  }
}

.table {
  tbody {
    tr {
      border-radius: 0;
      box-shadow: none;

      &:not(:last-child) {
        border-bottom: 1.5px dashed lighten(color(secondary), 40%);
        @include response(md) { border-bottom: none; }
      }

      &:hover {
        color: color(secondary);
        cursor: unset;
        box-shadow: none;
        transform: translateY(0);
        @include response(md) { font-weight: weight(bold); }
      }
    }
  }
}
</style>
