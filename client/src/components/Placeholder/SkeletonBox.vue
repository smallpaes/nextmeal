<template>
  <span
    :style="{height, width: computedWidth}"
    class="skelenton-box"
  />
</template>

<script>
export default {
  props: {
    maxWidth: {
      type: Number,
      default: 100
    },
    minWidth: {
      type: Number,
      default: 80
    },
    height: {
      type: String,
      default: '1rem'
    },
    width: {
      type: String,
      default: null
    }
  },
  computed: {
    computedWidth () {
      // use given width or random width
      return this.width || `${Math.floor(Math.random() * (this.maxWidth - this.minWidth)) + this.minWidth}%`
    }
  }
}
</script>

<style lang="scss" scoped>
.skelenton-box {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  background-color: lighten(color(secondary), 50%);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      transparent,
      rgba(color(quaternary), 0.2) 20%,
      transparent
    );
    animation: loading 1.5s infinite;
  }
}

@keyframes loading {
  100% {
    transform: translateX(100%);
  }
}
</style>
