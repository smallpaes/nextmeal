<template>
  <div
    class="card shadow"
    href="#"
  >
    <div class="card-img-top-container">
      <transition name="fade">
        <img
          v-show="imgLoaded"
          :src="order.meal.image"
          alt="photo of the restaurant"
          class="card-img-top"
          @load="imgLoaded = true"
        >
      </transition>
    </div>
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
  },
  data () {
    return {
      imgLoaded: false
    }
  }
}
</script>

<style lang="scss" scoped>
@include fadeAnimation;

.card {
  border: none;
  transition: opacity .2s linear;

  &:hover { opacity: .9; }

  &-img-top-container {
    width: 100%;
    height: 350px;
    background-image: url('~@/assets/placeholder-image/logo/1260x750.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;

    @include response(sm) { height: 300px; }
    @include response(md) { height: 340px; }
    @include response(lg) { height: 380px; }
  }

  &-img-top {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &-body {
    position: relative;
    min-height: 145px;
    padding: .8rem;

    @include response(md) { height: 185px; }
    @include response(lg) { height: 167px; }
  }

  &-indicator {
    position: absolute;
    top: 1rem;
    right: 1.3rem;
    display: inline-block;
    width: 36px;
    font-size: size(md);
    color: color(tertiary);
    text-align: center;
    border: 1px dotted color(tertiary);
    border-radius: 50%;
  }

  &-title {
    font-size: size(sm);
    color: color(secondary);
  }

  &-text {
    font-size: size(xs);
    color: lighten(color(secondary), 10%);

    .rating { color: color(primary); }
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
  font-size: size(xs);
  line-height: 1.8rem;
}
</style>
