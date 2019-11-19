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
      <img
        v-else
        :src="district.image || '@/assets/placeholder-image/plain/1260x750.png'"
        alt="District image"
        class="img-fluid shadow-sm rounded-sm"
      >
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

    &:hover {
      transform: translateY(-2%);
    }
  }

  &-fluid {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }

  &-content {
    color: color(quaternary);
  }
}
</style>
