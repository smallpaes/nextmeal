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
            font-family: 'Pacifico', cursive;
            color: color(primary);
            font-size: size(md);
            margin-left: auto;
            margin-right: auto;

            &:hover {
                @extend .navbar-brand;
            }
        }
    }
</style>
