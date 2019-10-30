<template>
  <router-link
    class="card col p-0 mx-2"
    :to="{name: 'restaurant', params: {restaurant_id: restaurant.id}}"
  >
    <img
      :src="restaurant.image"
      alt="photo of the restaurant"
      class="card-img-top"
    >
    <div class="card-body">
      <h5 class="card-title m-0">
        {{ restaurant.name }}
      </h5>
      <p class="card-text mt-1">
        <span class="rating">&#9733; {{ restaurant.rating }}</span>
        <span class="mx-1">|</span>{{ restaurant.category }}
      </p>
      <p class="card-text">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora unde corporis aliquid eaque quas iste.
      </p>
    </div>
  </router-link>
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
.card {
    transition: opacity .2s linear;

    &:hover {
        opacity: .9;
    }

    &-img-top {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }

    &-body {
        padding: .8rem;
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
}
</style>
