<template>
  <div
    class="placeholder-message p-2"
  >
    <h5 class="m-0">
      <slot />
    </h5>
  </div>
</template>

<style lang="scss" scoped>
.placeholder-message {
  @include flexPosition(center center row);
  h5 {
    font-size: size(sm);
    font-weight: weight(bold);
    color: lighten(color(secondary), 10%);
  }
}
</style>
