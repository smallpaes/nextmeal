<template>
  <nav class="navbar navbar-expand-sm navbar-light bg-white fixed-top shadow-sm">
    <router-link
      class="navbar-brand"
      :to="{name: 'home'}"
    >
      NextMeal
    </router-link>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarContent"
      aria-controls="navbarContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>

    <div
      id="navbarContent"
      class="collapse navbar-collapse"
    >
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <a
            href="#"
            class="nav-link px-1"
          >登入 / 體驗</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
    .navbar{
        &-brand {
            font-family: 'Pacifico', cursive;
            color: color(primary);
            font-size: size(md);

            &:hover {
                @extend .navbar-brand;
            }
        }

        &-toggler {
            border-color: transparent;
            color: color(secondary);
        }
    }

    .nav {
        &-link {
            @include buttonAnimation;
            color:lighten(color(secondary), 20%);
            transition: color .2s linear;

            &:after {
                border-bottom: 2px solid color(primary);
            }

            &:hover {
                color: color(secondary);
            }
        }
    }
</style>
