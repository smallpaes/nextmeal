<template>
  <section
    class="“banner"
  >
    <div
      class="banner-container"
      :style="{height: `${bannerHeight}px`}"
    >
      <ik-image
        :path="backgroundPhoto"
        :lqip="{active:true}"
        loading="lazy"
        :alt="imageDescription"
        class="banner-img"
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
    },
    imageDescription: {
      type: String,
      default: 'Header image'
    }
  }
}
</script>

<style lang="scss" scoped>
.banner {
  @include positionCenter;
  @include imgOverlay(.9);

  &-container {
    @include setBackground(image('card'));
    margin-top: 62px;
  }

  &-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
