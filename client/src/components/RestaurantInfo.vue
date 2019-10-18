<template>
  <section class="info-wrapper mb-5">
    <h1 class="info-title">
      {{ restaurant.name }}
    </h1>
    <p class="info-sub-title">
      <span class="rating">&#9733; {{ restaurant.rating }}</span>
      <span class="mx-2">|</span>
      {{ restaurant.category.name }}
    </p>
    <div class="divider my-4" />
    <p class="info-description">
      {{ restaurant.description }}
    </p>
  </section>
</template>

<script>
export default {
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
    }
}

.divider {
    width: 20%;
    border-bottom: 1px solid lighten(color(secondary), 40%);
}
</style>
