<template>
  <ul class="nav nav-pills">
    <li class="nav-item">
      <router-link
        class="nav-link"
        :class="{active: !$route.query.order_status}"
        :to="{name: 'user-order', query: {order_status: 'today'}}"
      >
        今日<span class="d-none d-md-inline">訂單</span>
      </router-link>
    </li>
    <li class="nav-item">
      <router-link
        class="nav-link"
        :to="{name: 'user-order', query: {order_status: 'tomorrow'}}"
      >
        明日<span class="d-none d-md-inline">訂單</span>
      </router-link>
    </li>
    <li class="nav-item">
      <router-link
        class="nav-link"
        :to="{name: 'user-order', query: {order_status: 'cancel'}}"
      >
        取消<span class="d-none d-md-inline">訂單</span>
      </router-link>
    </li>
    <li class="nav-item">
      <router-link
        class="nav-link"
        :to="{name: 'user-order', query: {order_status: 'history'}}"
      >
        歷史<span class="d-none d-md-inline">訂單</span>
      </router-link>
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
