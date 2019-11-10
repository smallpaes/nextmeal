<template>
  <div class="profile-card rounded-sm shadow-sm">
    <div class="profile-card-top">
      <img
        :src="currentUser.avatar | placeholderImage"
        alt="user avatar"
      >
      <h5 class="mt-3 profile-card-top-name">
        {{ currentUser.name }}
      </h5>
      <small class="profile-top-balance">
        {{ currentUser.subscriptionStatus | getSubscriptionStatus }} | 剩餘 {{ currentUser.subscriptionBalance }} 餐
      </small>
    </div>
    <hr class="m-0">
    <div class="profile-card-bottom">
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link
            class="nav-link"
            :to="{name: 'user-profile'}"
          >
            <span class="icon"><i class="fas fa-cog mr-1" /></span>
            帳戶設定
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            class="nav-link"
            :to="{name: 'user-order'}"
            active-class="active"
          >
            <span class="icon"><i class="fas fa-clipboard-list mr-1" /></span>
            訂單管理
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { placeholderImageFilter } from '../../utils/mixins'
import { mapState } from 'vuex'

export default {
  filters: {
    getSubscriptionStatus: status => {
      if (status) return '訂閱中'
      return '未訂閱'
    }
  },
  mixins: [placeholderImageFilter],
  computed: {
    ...mapState(['currentUser'])
  }
}
</script>

<style lang="scss" scoped>
.profile {
    &-card {
        background-color: color(quaternary);

        &-top {
            padding: 1.5rem;
            text-align: center;

            &-name {
                font-size: size(md);
                font-weight: weight(bold);
            }

            img {
                width: 120px;
                height: 120px;
                object-fit: cover;
                border-radius: 50%;
            }
        }

        &-bottom {
            padding: .5rem 0;
        }
    }

    &-form {
        border: 1px solid color(secondary);
    }
}

.nav {
    &-item {
        text-align: center;
    }

    &-link {
        @include linkStyling(lighten(color(secondary), 10%));
        padding: .5rem 1rem;
        font-size: size(sm);

        &:hover {
            color: color(primary);
        }

        &.active {
            @include pseudoStyling(before, primary, .3, 1.6);
            color: color(primary);
        }
    }
}

.icon {
    display: inline-block;
    width: 25px;
}

</style>
