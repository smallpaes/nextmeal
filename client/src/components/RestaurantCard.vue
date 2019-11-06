<template>
  <router-link
    class="card col p-0"
    :to="{name: 'restaurant', params: {restaurant_id: restaurant.id}}"
  >
    <SkelentonBox
      v-if="isLoading"
      :width="'100%'"
      :height="'200px'"
    />
    <img
      v-else
      :src="restaurant.image"
      alt="photo of the restaurant"
      class="card-img-top"
    >
    <div class="card-body">
      <h5 class="card-title m-0">
        <SkelentonBox
          v-if="isLoading"
          :width="'20%'"
        />
        <template v-else>
          {{ restaurant.name }}
        </template>
      </h5>
      <p class="card-text mt-1">
        <SkelentonBox
          v-if="isLoading"
          :width="'30%'"
        />
        <template v-else>
          <span class="rating">&#9733; {{ restaurant.rating | padEnd }}</span>
          <span class="mx-1">|</span>{{ restaurant.Category.name }}
        </template>
      </p>
      <p class="card-text">
        <SkelentonBox
          v-if="isLoading"
          :width="'90%'"
        />
        <template v-else>
          {{ restaurant.description | textTruncate }}
        </template>
      </p>
    </div>
  </router-link>
</template>

<script>
import SkelentonBox from './Placeholder/SkeletonBox'
import { padEndFilter, textTruncateFilter } from '../utils/mixins'

export default {
  components: {
    SkelentonBox
  },
  mixins: [padEndFilter, textTruncateFilter],
  props: {
    restaurant: {
      type: Object,
      default: () => ({
        id: -1,
        rating: -1,
        description: '',
        Category: {
          name: ''
        }
      })
    },
    isLoading: {
      type: Boolean,
      default: false
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
        min-height: 125px;

        @include response(md) {
          min-height: 145px;
        }
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
