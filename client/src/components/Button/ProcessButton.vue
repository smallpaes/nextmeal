<template>
  <button
    class="btn"
    :class="'btn-' + color + '-color'"
    :disabled="isProcessing || v.$invalid"
    :style="{'border-radius': borderRadius}"
    @click.stop.prevent="$emit('after-click'); isCurrentButton = true"
  >
    <template v-if="!isProcessing || (isProcessing && !isCurrentButton)">
      <slot name="initial" />
    </template>
    <template v-if="isProcessing && isCurrentButton">
      處理中 ...
    </template>
  </button>
</template>

<script>
export default {
  props: {
    isProcessing: {
      type: Boolean,
      default: false
    },
    v: {
      type: Object,
      required: true
    },
    color: {
      type: String,
      default: 'primary'
    },
    borderRadius: {
      type: String,
      default: '1rem'
    }
  },
  data () {
    return {
      isCurrentButton: false
    }
  },
  watch: {
    isProcessing (isProcessing) {
      if (isProcessing) return
      this.isCurrentButton = false
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
  @include solidButton;
  min-width: 100px;
  margin: 0 .5rem;
  padding: .28rem .7rem;

  @include response(md) {
    min-width: 200px;
    padding: .375rem .75rem;
  }

  @each $color, $hex in $colors {
    &-#{$color}-color {
      @include solidButton(100, 1, $color);
    }
  }
}
</style>
