<template>
  <router-link
    class="img-wrapper col-12 col-md-6 col-lg-3 mb-3 px-2"
    :to="{name: 'restaurants', query: {dist: district.chinese_name}}"
  >
    <div class="img-container">
      <SkelentonBox
        v-if="isLoading"
        :width="'100%'"
        :height="'180px'"
      />
      <ik-image
        v-else
        :path="district.image || placeholderImg"
        :lqip="{ active: true }"
        width="500"
        loading="lazy"
        :alt="district.chinese_name + '的照片'"
        class="img-fluid shadow-sm rounded-sm"
        @error="handleOnError"
      />
      <div :class="{'img-overlay': !isLoading}" />
      <h3 class="img-content">
        <SkelentonBox
          v-if="isLoading"
          :width="'40px'"
        />
        <template v-else>
          {{ district.chinese_name }}
        </template>
      </h3>
    </div>
  </router-link>
</template>

<script>
import SkelentonBox from '../Placeholder/SkeletonBox'
import { CARD_PLACEHOLDER_RELATIVE_URL } from '../../utils/image-url'

export default {
  components: {
    SkelentonBox
  },
  props: {
    district: {
      type: Object,
      default: () => ({
        chinese_name: '',
        image: ''
      })
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    defaultSrc: {
      type: String,
      default: CARD_PLACEHOLDER_RELATIVE_URL
    }
  },
  data () {
    return {
      placeholderImg: CARD_PLACEHOLDER_RELATIVE_URL
    }
  },
  methods: {
    handleOnError (e) {
      e.target.src = this.defaultSrc
    }
  }
}
</script>

<style lang="scss" scoped>
.img {
  @include positionCenter;
  @include imgOverlay;

  &-container {
    transition: transform .2s linear;

    &:hover { transform: translateY(-2%); }
  }

  &-fluid {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }

  &-content { color: color(quaternary); }
}
</style>
