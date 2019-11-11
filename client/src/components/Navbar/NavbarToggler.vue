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
    right: 37px;
    top: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-size: size(md);
    padding: 8px 0;
    z-index: 6;
    width: 30px;
    height: 48px;
    transition: all .2s linear;

    &-line {
      width: 30px;
      height: 3px;
      background-color: lighten(color(secondary), 35%);
      transform-origin: right;
      transition: transform .2s .2s linear, opacity .2s .2s linear, background-color .2s linear;
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

    @include response(sm) {
      display: none;
    }
  }
}
</style>
