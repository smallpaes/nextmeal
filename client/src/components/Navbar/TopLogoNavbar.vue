<template>
  <nav class="navbar navbar-expand-sm navbar-light bg-white fixed-top shadow-sm">
    <router-link
      class="navbar-brand"
      :to="{name: 'home'}"
    >
      NextMeal
    </router-link>
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
