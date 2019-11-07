<template>
  <nav
    class="sidenav shadow"
    :class="{opened: navIsOpen}"
  >
    <div class="sidenav-brand-container text-center py-5">
      <router-link
        :to="{name: 'home'}"
        class="sidenav-brand"
      >
        NextMeal
      </router-link>
    </div>
    <ul class="sidenav-nav px-0 text-center">
      <li class="nav-item">
        <router-link
          :to="{name: 'admin-restaurants'}"
          active-class="active"
          class="nav-link"
        >
          <span class="icon"><i class="fas fa-store" /></span>
          <span class="nav-link-description">餐廳</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link
          :to="{name: 'admin-users'}"
          active-class="active"
          class="nav-link"
        >
          <span class="icon"><i class="fas fa-utensils" /></span>
          <span class="nav-link-description">用戶</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link
          :to="{name: 'admin-orders'}"
          active-class="active"
          class="nav-link"
        >
          <span class="icon"><i class="fas fa-clipboard-list" /></span>
          <span class="nav-link-description">訂單</span>
        </router-link>
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
          role="button"
          class="nav-link"
          @click="logout"
        >
          <span class="icon"><i class="fas fa-sign-out-alt" /></span>
          <span class="nav-link-description">登出</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    navIsOpen: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    logout () {
      this.$store.commit('revokeAuthentication')
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.sidenav {
    @include brand(sidenav);
    position: fixed;
    height: 100vh;
    width: 0;
    white-space: nowrap;
    background-color: color(quaternary);
    transition: width .2s linear;
    overflow-y: scroll;
    overflow-x: hidden;
    z-index: 3;

    &-brand {
      @include visibleTransition(visible);

      @include response(sm) {
        @include visibleTransition(invisible);
      }

      @include response(md) {
        @include visibleTransition(visible);
      }
    }

    &-nav {
        list-style-type: none;
    }

    &.opened {
      @extend .sidenav;
      width: 100%;
    }

    @include response(sm) {
      width: 80px;
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

            &::before {
                background-color: transparent;

                @include response(sm) {
                    background-color: color(tertiary);
                }
            }
        }

        &-description {
          transition: opacity .1s linear;

          @include response(sm) {
            opacity: 0;
            display: none;
          }

          @include response(md) {
            display: unset;
            opacity: 1;
          }
        }
    }

    &-divider {
        display: none;
        border: .03rem solid lighten(color(secondary), 55%);
        margin: 0 .6rem;

        @include response(sm) {
          display: block;
        }
    }
}

.icon {
    display: inline-block;
    width: 30px;
    margin-right: .3rem;
    text-align: center;
}
</style>
