<template>
  <div
    class="card d-flex flex-row justify-content-between rounded-0"
  >
    <div class="card-left">
      <div class="card-body px-0 py-0">
        <h5 class="card-title m-0">
          {{ order.meals.Restaurant.name }}
        </h5>
        <div class="card-description mt-2">
          <p class="m-0 d-inline d-md-block">
            <span class="d-none d-md-inline">餐點名稱：</span>
            {{ order.meals.name }}
          </p>
          <p class="m-0 d-inline d-md-block">
            <span class="d-none d-md-inline">訂購數量</span>
            {{ order.amount }}份
          </p>
        </div>
      </div>
    </div>
    <div class="card-right">
      <div class="card-right-top shadow-sm rounded text-center ml-auto">
        <h5 class="card-date">
          {{ order.require_date | timeTransform }}
        </h5>
        <h3 class="card-time">
          {{ order.require_date.split('T')[1].slice(0,5) }}
        </h3>
      </div>
      <router-link
        v-if="!order.hasComment && $route.query.status==='history'"
        class="btn mt-3"
        :to="{name: 'order-comment', params: {order_id: order.id}}"
      >
        評論
      </router-link>
      <router-link
        class="btn mt-3 ml-2"
        :to="{name: 'order', params: {order_id: order.id}}"
      >
        訂單
      </router-link>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  filters: {
    timeTransform (timestamp) {
      return moment(timestamp).format('MM/DD')
    }
  },
  props: {
    order: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
    min-height: 120px;
    border: none;
    border-bottom: 1px solid lighten(color(secondary), 50%);

    &-body {
        @include flexPosition('flex-start', flex-start, column);
        height: 100%;
        width: 100%;
    }

    &-title {
        font-size: size(sm);
        color: color(secondary);
        font-weight: weight(bold);
    }

    &-right {

        &-top {
          max-width: 80px;
          overflow: hidden;
        }
    }

    &-date {
        font-size: size(xs);
        background-color: color(primary);
        color: color(quaternary);
        padding: .15rem 0;
    }

    &-time {
      font-size: size(sm);
      font-weight: weight(bold);
    }

    &-description {
        font-size: size(xs);
        color: lighten(color(secondary), 10%);
    }
}

.btn {
    @include buttonOutline(80, 25, color(secondary), color(quaternary), color(secondary), .2);
    font-size: size(xs);
    padding: 0;
}
</style>
