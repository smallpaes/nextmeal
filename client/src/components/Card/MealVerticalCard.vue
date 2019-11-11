<template>
  <div
    class="card shadow"
    href="#"
  >
    <img
      :src="order.meal.image"
      alt="photo of the restaurant"
      class="card-img-top"
    >
    <div class="card-body">
      <h5 class="card-title m-0">
        {{ order.meal.name }}
      </h5>
      <p class="card-text mt-1">
        <span class="rating">&#9733; {{ order.restaurant.rating | padEnd }}</span>
        <span class="mx-1">|</span>{{ order.restaurant.name | textTruncate(15) }}
        <slot name="distance" />
      </p>
      <slot name="indicator" />
      <p class="card-text">
        {{ order.meal.description | textTruncate }}
      </p>
    </div>
    <div class="card-footer text-right">
      <slot name="footer" />
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
  transition: opacity .2s linear;
  border: none;

  &:hover {
    opacity: .9;
  }

  &-img-top {
    width: 100%;
    height: 350px;
    object-fit: cover;

    @include response(sm) {
      height: 300px;
    }

    @include response(md) {
      height: 340px;
    }

    @include response(lg) {
      height: 380px;
    }
  }

  &-body {
    position: relative;
    padding: .8rem;
    min-height: 145px;

    @include response(md) {
      height: 185px;
    }

    @include response(lg) {
      height: 167px;
    }
  }

  &-indicator {
    font-size: size(md);
    position: absolute;
    border-radius: 50%;
    display: inline-block;
    width: 36px;
    text-align: center;
    color: color(tertiary);
    border: 1px dotted color(tertiary);
    top: 1rem;
    right: 1.3rem;
  }

  &-title {
    font-size: size(sm);
    color: color(secondary);
  }

  &-text {
    font-size: size(xs);
    color: lighten(color(secondary), 10%);

    .rating {
      color: color(primary);
    }
  }

  &-footer {
    padding: .8rem;
    background-color: color(quaternary);
    border-top-color: lighten(color(secondary), 55%);
  }
}

.btn {
  @include solidButton(80, .3, primary);
  padding: 0;
  line-height: 1.8rem;
  font-size: size(xs);
}
</style>
