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
  cursor: pointer;
  color: lighten(color(secondary), 40%);

  &-message {
    position: absolute;
    left: 160%;
    top: -5px;
    visibility: hidden;
    background-color: color(secondary);
    border-radius: .2rem;
    color: color(secondary);
    text-align: center;
    padding: .2rem .2rem;
    color: color(quaternary);

    &::before {
      content: '';
      position: absolute;
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-right: .3rem solid color(secondary);
      border-top: .3rem solid transparent;
      border-bottom: .3rem solid transparent;
    }
  }

  &:hover .tip-message {
    visibility: visible;
  }
}
</style>
