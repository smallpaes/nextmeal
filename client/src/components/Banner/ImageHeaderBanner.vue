<template>
  <section
    class="“banner"
  >
    <div class="banner-container">
      <div
        class="banner-img"
        :style="{backgroundImage: `url(${backgroundPhoto})`, height: `${bannerHeight}px`}"
      />
      <div class="banner-overlay" />
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
        margin-top: 62px;
    }

    &-img {
      @include setBackground("https://via.placeholder.com/800x800/d3d3d3", 550px);
    }
    &-content {
        color: color(quaternary);
        text-shadow: 1px 1px 1px #636161;
        width: 100%;

        &-title {
            font-size: size(xl);
            font-weight: weight(bold);
        }

        &-description {
            font-size: size(md);
            font-weight: weight(bold);
        }

        .btn {
            @include solidButton;
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
    }
}
</style>
