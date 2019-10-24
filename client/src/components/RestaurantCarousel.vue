<template>
  <div
    id="popularCarousel"
    class="carousel slide"
    data-ride="carousel"
  >
    <div class="carousel-inner">
      <div class="carousel-item active px-2">
        <div class="row justify-content-around">
          <RestaurantCard
            v-for="restaurant in popularRestaurants.slice(0,3)"
            :key="restaurant.id"
            :restaurant="restaurant"
          />
        </div>
      </div>
      <div class="carousel-item px-2">
        <div class="row justify-content-around">
          <RestaurantCard
            v-for="restaurant in popularRestaurants.slice(3,6)"
            :key="restaurant.id"
            :restaurant="restaurant"
          />
        </div>
      </div>
    </div>
    <a
      class="carousel-control-prev"
      href="#popularCarousel"
      role="button"
      data-slide="prev"
    >
      <span
        class="carousel-control-prev-icon"
        aria-hidden="true"
      />
      <span class="sr-only">Previous</span>
    </a>
    <a
      class="carousel-control-next"
      href="#popularCarousel"
      role="button"
      data-slide="next"
    >
      <span
        class="carousel-control-next-icon"
        aria-hidden="true"
      />
      <span class="sr-only">Next</span>
    </a>
  </div>
</template>

<script>
import RestaurantCard from '../components/RestaurantCard'

export default {
  components: {
    RestaurantCard
  },
  props: {
    popularRestaurants: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.carousel-control {
  &-prev {
    @include arrowStyling("\2039");
    left: -100px;

    &-icon {
      position: relative;
      background-image: none;

    }
  }

  &-next {
    @include arrowStyling("\203A");
    right: -90px;
    background-image: none;
  }
}
</style>
