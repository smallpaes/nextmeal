<template>
  <div class="media">
    <img
      :src="comment.User.avatar"
      class="media-avatar mr-3"
      alt="user avatar"
    >
    <div class="media-body ">
      <div class="m-0 media-title">
        <div class="media-title-left">
          <span class="mr-2">{{ comment.User.name }}</span>
          <RatingStars
            :rating="comment.rating"
            class="media-rating d-inline"
          />
        </div>
        <span class="media-title-right mb-2 mb-sm-0">{{ comment.createdAt | timeTransform }}</span>
      </div>
      <p class="media-description mb-0 mt-1">
        {{ comment.user_text }}
      </p>
      <img
        src="https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
        class="file-image file-image-small my-3"
        :class="{large: isZoomIn}"
        alt="評論照片"
        @click="isZoomIn = !isZoomIn"
      >
    </div>
  </div>
</template>

<script>
import RatingStars from '../components/RatingStars'
import { timeTransformFilter } from '../utils/mixins'

export default {
  components: {
    RatingStars
  },
  mixins: [timeTransformFilter],
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isZoomIn: false
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
        display: flex;
        flex-direction: column;
        color: darken(color(secondary), 15%);
        font-size: size(sm);

        &-right {
            font-size: size(xs);
            color: lighten(color(secondary), 40%);
        }

        @include response(sm) {
            flex-direction: row;
            justify-content: space-between;
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

.file {
    &-image {
        object-fit: cover;
        border-radius: .3rem;
        width: 80px;
        height: 60px;
        cursor: zoom-in;
        transition: all .2s ease-in;

        &.large {
            width: 200px;
            height: 150px;
            cursor: zoom-out;

            @include response(md) {
                width: 240px;
                height: 180px;
            }
        }
    }
}
</style>
