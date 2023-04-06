<template>
  <div class="media">
    <!--Avatar Placeholder Image-->
    <SkelentonBox
      :width="'50px'"
      :height="'50px'"
      class="rounded-circle skelenton-box"
    />
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
      <!--Comment-->
      <p class="media-description mb-0 mt-1">
        {{ comment.user_text }}
      </p>
      <!--Show placeholder review image while loading-->
      <ik-image
        v-if="comment.image"
        :path="placeholderImg"
        :lqip="{ active: true }"
        loading="lazy"
        class="file-image file-image-placeholder my-3"
        alt="評論照片"
      />
      <!--Show review image after-->
      <img
        v-if="comment.image"
        :src="comment.image"
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
import SkelentonBox from './Placeholder/SkeletonBox'
import { CARD_PLACEHOLDER_RELATIVE_URL } from '../utils/image-url'
import { timeTransformFilter } from '../utils/mixins'

export default {
  components: {
    RatingStars,
    SkelentonBox
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
      isZoomIn: false,
      placeholderImg: CARD_PLACEHOLDER_RELATIVE_URL
    }
  }
}
</script>

<style lang="scss" scoped>
.media {
  &-avatar {
    position: relative;
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
  }

  &-body {
    min-height: 80px;
    border-bottom: 1px solid lighten(color(secondary), 50%);
  }

  &-title {
    display: flex;
    flex-direction: column;
    font-size: size(sm);
    color: darken(color(secondary), 15%);

    @include response(sm) {
      flex-direction: row;
      justify-content: space-between;
    }

    &-right {
      font-size: size(xs);
      color: lighten(color(secondary), 40%);
    }
  }

  &-description { font-size: size(xs); }

  &-rating {
    font-size: size(sm);
    color: color(primary);
  }
}

.file {
  &-image {
    position: relative;
    width: 80px;
    height: 60px;
    cursor: zoom-in;
    object-fit: cover;
    border-radius: .3rem;
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

    &-placeholder {
      position: absolute;
      opacity: .9;
    }
  }
}

.skelenton-box {
  position: absolute;
}
</style>
