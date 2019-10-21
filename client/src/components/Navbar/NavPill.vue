<template>
  <ul class="nav nav-pills">
    <li class="nav-item">
      <router-link
        class="nav-link active"
        :to="{name: 'owner-dishes'}"
      >
        全部<span class="d-none d-md-inline">菜單</span>
      </router-link>
    </li>
    <li class="nav-item">
      <a
        class="nav-link"
        href="#"
      >
        本週<span class="d-none d-md-inline">菜單</span>
      </a>
    </li>
    <li class="nav-item">
      <a
        class="nav-link"
        href="#"
      >
        下週<span class="d-none d-md-inline">菜單</span>
      </a>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.nav {

    &-link {
        @include linkStyling(lighten(color(secondary), 20%));
        padding: 0 1.1rem 0.7rem 0;
        font-size: size(sm);

        &.active {
          @include pseudoStyling(before, tertiary, 2.1, .15);
          color: color(tertiary);
          background-color: transparent;
          font-weight: weight(bold);

          &::before {
              top: 97%;
          }

          @include response(md) {
            @include pseudoStyling(before, tertiary, 4.2, .15);
          }
        }

        @include response(sm) {
          padding: 0 1.5rem 0.7rem 0;
        }
    }
}
</style>
