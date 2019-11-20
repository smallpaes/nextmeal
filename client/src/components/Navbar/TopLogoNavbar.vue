<template>
  <nav class="navbar navbar-expand-sm navbar-light bg-white fixed-top shadow-sm">
    <button
      class="navbar-brand btn"
      type="button"
      @click="$route.path === '/' ? $router.go() : $router.push('/')"
    >
      NextMeal
    </button>
  </nav>
</template>

<style lang="scss" scoped>
  .navbar{
    &-brand {
      margin-right: auto;
      margin-left: auto;
      font-family: 'Pacifico', cursive;
      font-size: size(md);
      color: color(primary);

      &:hover { @extend .navbar-brand; }
    }
  }
</style>
