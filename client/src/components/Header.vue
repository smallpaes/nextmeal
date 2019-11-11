<template>
  <div class="header-heading">
    <h1 class="header-heading-title">
      <slot name="title" />
    </h1>
    <p class="header-heading-description">
      <slot name="description" />
    </p>
  </div>
</template>

<style lang="scss" scoped>
.header {
  @include headingStyling;

  &-heading {
    text-align: center;
  }
}
</style>
