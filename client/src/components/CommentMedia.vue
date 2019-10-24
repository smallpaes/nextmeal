<template>
  <div class="media">
    <img
      :src="comment.User.avatar"
      class="media-avatar mr-3"
      alt="user avatar"
    >
    <div class="media-body ">
      <h5 class="m-0 media-title d-flex justify-content-between">
        <span>{{ comment.User.name }}</span>
        <span class="time">{{ comment.createdAt | timeTransform }}</span>
      </h5>
      <p class="media-rating mb-2">
        <span class="rating">&#9733; {{ comment.rating }}</span>
      </p>
      <p class="media-description mb-4">
        {{ comment.user_text }}
      </p>
    </div>
  </div>
</template>

<script>
import { timeTransformFilter } from '../utils/mixins'

export default {
  mixins: [timeTransformFilter],
  props: {
    comment: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.media {
    &-avatar {
        height: 50px;
        width: 50px;
        object-fit: cover;
        border-radius: 50%;
    }

    &-body {
        border-bottom: 1px solid lighten(color(secondary), 50%);
    }

    &-title {
        color: darken(color(secondary), 15%);
        font-size: size(sm);

        .time {
            font-size: size(xs);
            color: lighten(color(secondary), 40%);
        }
    }

    &-description {
        font-size: size(xs);
    }

    &-rating {
        color: color(primary);
        font-size: size(sm);
    }
}
</style>
