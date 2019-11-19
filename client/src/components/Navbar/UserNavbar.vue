<template>
  <nav class="navbar navbar-expand-sm navbar-light bg-white fixed-top shadow-sm">
    <!--Left Side Logo-->
    <router-link
      class="navbar-brand"
      :to="{name: 'home'}"
    >
      NextMeal
    </router-link>

    <!--Navbar Toggler-->
    <button
      class="navbar-toggler border-0"
      type="button"
      data-toggle="collapse"
      data-target="#navbarContent"
      aria-controls="navbarContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>

    <!--Right Side Nav-->
    <div
      id="navbarContent"
      class="collapse navbar-collapse"
    >
      <ul class="navbar-nav ml-auto">
        <li
          v-if="!isAuthenticated"
          class="nav-item"
        >
          <router-link
            class="nav-link px-1"
            :to="{name: 'login'}"
          >
            登入 / 體驗
          </router-link>
        </li>
        <template v-else-if="isAuthenticated && currentUser.role === 'User'">
          <li
            v-if="currentUser.subscriptionStatus"
            class="nav-item"
          >
            <router-link
              class="nav-link px-1"
              :to="{name: controlPanelRouteName}"
            >
              明日訂單
            </router-link>
          </li>
          <li
            v-else
            class="nav-item"
          >
            <router-link
              class="nav-link px-1"
              :to="{name: controlPanelRouteName}"
            >
              購買方案
            </router-link>
          </li>

          <!--Nav Items shown on extra small size screen-->
          <li
            class="nav-item"
          >
            <router-link
              class="nav-link d-sm-none"
              :to="{name: 'user-profile'}"
            >
              帳戶設定
            </router-link>
          </li>
          <li
            class="nav-item"
          >
            <router-link
              class="nav-link d-sm-none"
              :to="{name: 'user-order'}"
            >
              訂單管理
            </router-link>
          </li>
          <li
            class="nav-item"
          >
            <button
              class="nav-link btn d-sm-none mx-auto"
              type="button"
              @click="logout"
            >
              登出帳號
            </button>
          </li>

          <!--Avatar Drop Down Menu Shown on Small Size Screen-->
          <li class="nav-item dropdown ml-0 ml-sm-3 d-none d-sm-inline">
            <a
              id="navbarDropdownMenuLink"
              class="dropdown-toggle p-0"
              href="#"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <!--Avatar Placeholder Image-->
              <SkelentonBox
                :width="'40px'"
                :height="'40px'"
                class="rounded-circle skelenton-box"
              />
              <!--Avatar-->
              <img
                class="dropdown-img"
                :src="currentUser.avatar"
              >
            </a>
            <!--Dropdown items-->
            <div
              class="dropdown-menu dropdown-menu-right shadow-sm mb-0"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <router-link
                class="dropdown-item py-2"
                :to="{name: 'user-profile'}"
              >
                <span class="icon"><i class="fas fa-cog mr-1" /></span>帳戶設定
              </router-link>
              <router-link
                class="dropdown-item py-2"
                :to="{name: 'user-order'}"
              >
                <span class="icon"><i class="fas fa-clipboard-list mr-1" /></span>訂單管理
              </router-link>

              <div class="dropdown-divider mb-0" />
              <button
                class="dropdown-item py-2"
                type="button"
                @click="logout"
              >
                <span class="icon"><i class="fas fa-cog mr-1" /></span>登出帳號
              </button>
            </div>
          </li>
        </template>
        <template v-else>
          <li class="nav-item">
            <router-link
              class="nav-link px-1"
              :to="{name: controlPanelRouteName}"
            >
              管理後台
            </router-link>
          </li>
          <li
            class="nav-item ml-0 ml-sm-3"
          >
            <a
              class="nav-link px-1"
              href="#"
              role="button"
              @click="logout"
            >登出帳號</a>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script>
import SkelentonBox from '../Placeholder/SkeletonBox'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    SkelentonBox
  },
  computed: {
    ...mapState(['currentUser', 'isAuthenticated']),
    ...mapGetters(['controlPanelRouteName'])
  },
  methods: {
    logout () {
      this.$store.commit('revokeAuthentication')
      if (this.$route.name !== 'home') return this.$router.push('/')
      // reload the page for root path to prevent NavigationDuplicated error
      this.$router.go()
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar{
  &-brand {
    font-family: 'Pacifico', cursive;
    font-size: size(md);
    color: color(primary);

    &:hover {
      @extend .navbar-brand;
    }

    &:focus {
      color: color(primary);
      outline: none;
    }
  }
}

.nav {
  &-link {
    color:lighten(color(secondary), 20%);
    text-align: center;
    transition: color .2s linear;

    &:after {
      border-bottom: 2px solid color(primary);
    }

    &:hover {
      font-weight: weight(bold);
      color: color(secondary);
    }

    @include response(sm) {
      @include buttonAnimation;
    }
  }
}

.dropdown {
  &-img {
    position: relative;
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
  }

  &-toggle {
    cursor: pointer;
    &::after {
      border-top: none;
      border-right: none;
      border-left: none;
    }
  }

  &-menu {
    position: relative;
    top: 48.35px;
    background-color: lighten(color(secondary),65%);
    border: 1px solid lighten(color(secondary), 55%);
    border-radius: .2rem;

    &::before {
      position: absolute;
      right: 8%;
      bottom: 100%;
      content: '';
      border-right: 10px solid transparent;
      border-bottom: 10px solid lighten(color(secondary), 55%);
      border-left: 10px solid transparent;
     }

     &::after {
      @extend .dropdown-menu::before;
      bottom: 99.5%;
      border-bottom: 10px solid white;
     }
  }

  &-item {
    color: color(secondary);
    text-align: center;
    cursor: pointer;

    &.active {
      background-color: unset;

      &:hover {
        background-color: #f8f9fa;
      }
    }

    &:active {
      @extend .dropdown-item.active
    }
  }

  .skelenton-box {
    position: absolute;
  }
}

.icon {
  display: inline-block;
  width: 25px;
}

.navbar-light .navbar-nav .nav-link.active {
  color:lighten(color(secondary), 20%);
}

.navbar-light .navbar-nav .nav-link.active:hover {
  color: color(secondary);
}
</style>
