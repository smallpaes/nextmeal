<template>
  <section
    class="“banner"
  >
    <div class="banner-container">
      <div
        class="banner-img"
        :style="{backgroundImage: `url(${backgroundPhoto})`}"
      />
      <div class="banner-overlay" />
    </div>
  </section>
</template>

<script>
export default {
  props: {
    backgroundPhoto: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.banner {
    @include positionCenter;
    @include imgOverlay(1);

    &-container {
        margin-top: 62px;
    }

    &-img {
        @include setBackground("https://via.placeholder.com/800x800/d3d3d3", 480px);
    }
}
</style>
