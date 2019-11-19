<template>
  <section class="info-wrapper mb-5">
    <h1 class="info-title">
      {{ restaurant.name }}
    </h1>
    <p class="info-sub-title">
      <span class="rating">&#9733; {{ restaurant.rating | padEnd }}</span>
      <span class="mx-2">|</span>
      {{ restaurant.Category.name }}
    </p>
    <div class="divider my-4" />
    <p class="info-description">
      {{ restaurant.description }}
    </p>
  </section>
</template>

<script>
import { padEndFilter } from '../utils/mixins'

export default {
  mixins: [padEndFilter],
  props: {
    restaurant: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.info {
  &-title {
    font-size: size(lg);
    font-weight: weight(bold);
  }

  &-sub-title {
    color: lighten(color(secondary), 20%);
  }

  .rating {
    color: color(primary);
  }

  &-description {
    font-size: size(xs);
    line-height: 1.8rem;
  }
}

.divider {
  width: 20%;
  border-bottom: 1px solid lighten(color(secondary), 40%);
}
</style>
