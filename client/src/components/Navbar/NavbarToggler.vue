<template>
  <button
    class="btn hamburger-menu"
    :class="{opened: navIsOpen}"
    @click="$emit('toggle-navbar')"
  >
    <div class="hamburger-menu-line hamburger-menu-line-1" />
    <div class="hamburger-menu-line hamburger-menu-line-2" />
    <div class="hamburger-menu-line hamburger-menu-line-3" />
  </button>
</template>

<script>
export default {
  props: {
    navIsOpen: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.hamburger {
  &-menu {
    position: absolute;
    top: 40px;
    right: 37px;
    z-index: 6;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 48px;
    padding: 8px 0;
    font-size: size(md);
    transition: all .2s linear;

    @include response(sm) {
      display: none;
    }

    &-line {
      width: 30px;
      height: 3px;
      background-color: lighten(color(secondary), 35%);
      transition: transform .2s .2s linear, opacity .2s .2s linear, background-color .2s linear;
      transform-origin: right;
    }

    &.opened {
      transform: rotateZ(90deg);

      .hamburger-menu-line-1 {
        transform: rotateZ(-40deg);
      }

      .hamburger-menu-line-2 {
        opacity: 0;
      }

      .hamburger-menu-line-3 {
        transform: rotateZ(40deg);
      }
    }

    &:hover .hamburger-menu-line {
      background-color: lighten(color(secondary), 20%);
    }
  }
}
</style>
