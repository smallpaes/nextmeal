<template>
  <carousel
    :per-page-custom="[[0, 1], [768, 2], [992, 3]]"
    :navigation-enabled="true"
    :navigation-next-label="'❯'"
    :navigation-prev-label="'❮'"
    :pagination-active-color="'#777371'"
    :speed="600"
  >
    <!--Show placeholder while loading-->
    <template v-if="isLoading">
      <slide
        v-for="index in 6"
        :key="index"
      >
        <div class="px-2">
          <RestaurantCard
            :is-loading="isLoading"
            class="mx-0"
          />
        </div>
      </slide>
    </template>
    <!--Show real data when data is loaded-->
    <slide
      v-for="restaurant in popularRestaurants"
      v-else
      :key="restaurant.id"
    >
      <div class="px-2">
        <RestaurantCard
          :restaurant="restaurant"
          class="mx-0"
        />
      </div>
    </slide>
  </carousel>
</template>

<script>
import RestaurantCard from '../components/RestaurantCard'

import { Carousel, Slide } from 'vue-carousel'

export default {
  components: {
    RestaurantCard,
    Carousel,
    Slide
  },
  props: {
    popularRestaurants: {
      type: Array,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .VueCarousel-navigation {

    &-button {
        display: none;
        border-radius: 50%;
        background-color: color(quaternary);
        line-height: 8px;
        color: lighten(color(secondary), 30%);
        box-shadow: 0 .125rem .25rem rgba(0,0,0,.075);

        &:focus {
            outline: none;
        }

        &:hover {
            color: lighten(color(secondary), 10%);
        }

        @include response(md) {
            display: block;
        }
    }

    &--disabled {
        display: none;
    }
}

/deep/ .VueCarousel-dot {

    &:focus {
        outline: none;
    }

    &-container {
        @include response(md) {
            display: none;
        }
    }
}

</style>
