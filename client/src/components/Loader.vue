<template>
  <section
    class="icecream-container"
    :style="{height: height}"
  >
    <div class="icecream-content py-5">
      <h1
        v-for="i in 3"
        :key="i"
        class="icecream"
      >
        <i class="fas fa-ice-cream" />
      </h1>
      <small class="icecream-description">
        準備中
      </small>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: '100vh'
    }
  }
}
</script>

<style lang="scss" scoped>
.icecream {
  @include positionCenter;
  animation: jumping 1.2s linear infinite;

  &-container {
    width: 100%;
  }

  &-content {
    @include flexPosition(center, center, row);
    color: color(primary);
    flex-wrap: wrap;
  }

  &-description {
    width: 100%;
    text-align: center;
    font-size: size(sm);
    animation: twinkling 1.2s ease-out infinite;
    font-weight: weight(bold);
  }
}

@for $i from 1 through 3 {
  .icecream:nth-child(#{$i}) {
    animation-delay: #{$i * .2 - .2}s;
  }
}

@keyframes jumping {
  0% {
    transform: translateY(0px);
  }
  15% {
    transform: translateY(-15px);
  }
  33% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes twinkling {
  from {
    opacity: 1;
  }
  to {
    opacity: .5;
  }
}
</style>
