<template>
  <section class="detail">
    <div
      class="detail-wrapper rounded-sm shadow-sm p-3"
    >
      <h2 class="detail-title mb-4">
        訂購資料
      </h2>
      <div class="detail-content row">
        <div class="col-md-6 my-3">
          <h5 class="detail-content-title">
            訂單編號
          </h5>
          <h2 class="detail-content-description">
            {{ order.MealId }}
          </h2>
        </div>
        <div class="col-md-6 my-3">
          <h5 class="detail-content-title">
            訂單數量
          </h5>
          <h2 class="detail-content-description">
            {{ order.quantity }}
          </h2>
        </div>
      </div>
      <div class="detail-content row">
        <div class="col-md-6 my-3">
          <h5 class="detail-content-title">
            領餐日期
          </h5>
          <h2 class="detail-content-description">
            {{ order.date | timeTransform }}
          </h2>
        </div>
        <div class="col-md-6 my-3">
          <h5 class="detail-content-title">
            領餐時間
          </h5>
          <h2 class="detail-content-description">
            {{ order.time }}
          </h2>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { timeTransformFilter } from '../utils/mixins'

export default {
  mixins: [timeTransformFilter],
  props: {
    order: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.detail {
    width: 100%;

    &-wrapper {
        background-color: color(quaternary);
    }

    &-title {
        font-size: size(md);
        font-weight: weight(bold);
        color: color(primary);
    }

    &-content {
        &-title {
            font-size: size(sm);
            color: lighten(color(secondary), 30%);
        }

        &-description {
            font-size: size(sm);
            font-weight: weight(bold);
        }
    }
}
</style>
