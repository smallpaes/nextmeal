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
      default: 'https://images.pexels.com/photos/277253/pexels-photo-277253.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    }
  }
}
</script>

<style lang="scss" scoped>
.banner {
    @include positionCenter;
    @include imgOverlay(1);

    &-container {
        @include setBackground("../../assets/placeholder-image/logo/1260x750.png", 480px);
        margin-top: 62px;
    }

    &-img {
        @include setBackground("https://via.placeholder.com/800x800/d3d3d3", 480px);
    }
}
</style>
