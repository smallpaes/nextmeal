<template>
  <section
    class="“banner"
  >
    <div
      class="banner-container"
      :style="{height: `${bannerHeight}px`}"
    >
      <div
        class="banner-img"
        :style="{backgroundImage: `url(${backgroundPhoto})`}"
      />
      <div
        class="banner-overlay"
      />
      <div class="banner-content">
        <slot name="header" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    backgroundPhoto: {
      type: String,
      required: true
    },
    bannerHeight: {
      type: Number,
      default: 550
    }
  }
}
</script>

<style lang="scss" scoped>
.banner {
  @include positionCenter;
  @include imgOverlay(.9);

  &-container {
    @include setBackground("../../assets/placeholder-image/plain/1260x750.png");
    margin-top: 62px;
  }

  &-img {
    @include setBackground("https://via.placeholder.com/800x800/d3d3d3");
  }
  &-content {
    width: 100%;
    color: color(quaternary);
    text-shadow: 1px 1px 1px #636161;

    &-title {
      font-size: size(xl);
      font-weight: weight(bold);
    }

    &-description {
      font-size: size(md);
      font-weight: weight(bold);
    }

    @include response(lg) {
      &-title {
        font-size: size(xxl);
        font-weight: weight(bold);
      }

      &-description {
        font-size: size(lg);
        font-weight: weight(bold);
      }
    }

    .btn { @include solidButton; }
  }
}
</style>
