<template>
  <span class="tip">
    <slot name="icon" />
    <span
      class="tip-message"
      :style="{width}"
    ><slot name="message" /></span>
  </span>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      required: true
    },
    top: {
      type: String,
      required: true
    },
    left: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.tip {
  position: relative;
  display: inline-block;
  color: lighten(color(secondary), 40%);
  cursor: pointer;

  &-message {
    position: absolute;
    top: -5px;
    left: 160%;
    padding: .2rem .2rem;
    color: color(secondary);
    text-align: center;
    visibility: hidden;
    background-color: color(secondary);
    border-radius: .2rem;

    &::before {
      position: absolute;
      top: 50%;
      right: 100%;
      content: '';
      border-top: .3rem solid transparent;
      border-right: .3rem solid color(secondary);
      border-bottom: .3rem solid transparent;
      transform: translateY(-50%);
    }
  }

  &:hover .tip-message { visibility: visible; }
}
</style>
