<template>
  <div class="row">
    <router-link
      v-for="district in districts"
      :key="district.eng_name"
      class="img-wrapper col-12 col-md-6 col-lg-3 mb-3 px-2"
      :to="{name: 'restaurants', query: {dist: district.chinese_name}}"
    >
      <div class="img-container">
        <img
          :src="district.image"
          alt="Restaurant image"
          class="img-fluid shadow-sm rounded-sm"
        >
        <div class="img-overlay" />
        <h3 class="img-content">
          {{ district.chinese_name }}
        </h3>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    districts: {
      type: Array,
      required: true
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
        height: 180px;
        width: 100%;
        object-fit: cover;
    }

    &-content {
        color: color(quaternary);
    }
}
</style>
