<template>
  <nav class="sidenav shadow-sm">
    <div class="sidenav-brand-container text-center py-5">
      <a
        href="#"
        class="sidenav-brand"
      >NextMeal</a>
    </div>
    <ul class="sidenav-nav px-0 text-center">
      <li class="nav-item">
        <router-link
          :to="{name: 'owner-info'}"
          class="nav-link"
          :class="{active: $route.name === 'owner-info'}"
        >
          <span class="icon"><i class="fas fa-store" /></span>
          <span class="nav-link-description">餐廳</span>
        </router-link>
      </li>
      <li class="nav-item">
        <a
          href="#"
          class="nav-link"
        >
          <span class="icon"><i class="fas fa-utensils" /></span>
          <span class="nav-link-description">餐點</span>
        </a>
      </li>
      <li class="nav-item">
        <a
          href="#"
          class="nav-link"
        >
          <span class="icon"><i class="fas fa-clipboard-list" /></span>
          <span class="nav-link-description">訂單</span>
        </a>
      </li>
      <li class="nav-item">
        <a
          href="#"
          class="nav-link"
        >
          <span class="icon"><i class="fas fa-chart-line" /></span>
          <span class="nav-link-description">分析</span>
        </a>
      </li>
      <li class="nav-divider" />
      <li class="nav-item">
        <a
          href="#"
          class="nav-link"
        >
          <span class="icon"><i class="fas fa-cog" /></span>
          <span class="nav-link-description">登出</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.sidenav {
    @include brand(sidenav);
    position: fixed;
    height: 100vh;
    width: 80px;
    white-space: nowrap;
    background-color: color(quaternary);
    transition: width .2s linear;
    overflow-y: scroll;

    &-brand {
      @include visibleTransition(invisible);

      @include response(md) {
        @include visibleTransition(visible);
      }
    }

    &-nav {
        list-style-type: none;
    }

    @include response(md) {
      width: 145px;
    }
}

.nav {
    &-item {
        padding: .9rem 0;
    }

    &-link {
        @include linkStyling(lighten(color(secondary), 20%));
        padding: 0;
        font-size: size(md);

        &.active {
            color: color(tertiary);
            @include pseudoStyling(before, tertiary, 0.4, 2.3);

        }

        &-description {
          display: none;
          opacity: 0;
          transition: opacity .1s linear;

          @include response(md) {
            display: unset;
            opacity: 1;
          }
        }
    }

    &-divider {
        border: .03rem solid lighten(color(secondary), 55%);
        margin: 0 .6rem;
    }
}

.icon {
    display: inline-block;
    width: 30px;
    margin-right: .3rem;
    text-align: center;
}
</style>
