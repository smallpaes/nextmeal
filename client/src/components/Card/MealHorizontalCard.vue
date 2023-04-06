<template>
  <div
    class="card d-flex flex-row rounded-sm w-100 shadow-sm"
  >
    <div class="card-left">
      <ik-image
        :path="order.meal.image"
        :lqip="{ active: true }"
        loading="lazy"
        :alt="order.meal.name + '的照片'"
        class="card-img rounded-0 rounded-sm"
      />
    </div>
    <div class="card-right">
      <div class="card-body px-3 py-0">
        <h5 class="card-title m-0">
          {{ order.meal.name }}
        </h5>
        <p
          v-if="order.restaurant.rating"
          class="card-text mt-1"
        >
          <span class="rating">&#9733; {{ order.restaurant.rating | padEnd }}</span>
          <span class="mx-1">|</span>{{ order.restaurant.name }}
        </p>
        <p class="card-text d-none d-md-block">
          {{ order.meal.description | textTruncate }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { padEndFilter, textTruncateFilter } from '../../utils/mixins'

export default {
  mixins: [padEndFilter, textTruncateFilter],
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
  position: relative;
  height: 130px;
  overflow: hidden;
  border: none;

  @include response(sm) { height: 150px; }
  @include response(md) { height: 170px; }

  &-body {
    @include flexPosition(center, flex-start, column);
    width: 100%;
    height: 100%;
  }

  &-left {
    width: 130px;
    height: 100%;
    background-image: url('~@/assets/placeholder-image/logo/200x200.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;

    @include response(sm) { width: 150px; }
    @include response(md) { width: 170px; }
  }

  &-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &-title {
    font-size: size(sm);
    font-weight: weight(bold);
    color: color(secondary);
  }

  &-text {
    font-size: size(xs);
    color: lighten(color(secondary), 10%);

    .rating { color: color(primary); }
  }
}
</style>
