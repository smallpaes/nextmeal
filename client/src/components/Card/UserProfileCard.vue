<template>
  <div class="profile-card rounded-sm shadow-sm">
    <!--User Info-->
    <div class="profile-card-top">
      <!--Avatar Placeholder Image-->
      <SkelentonBox
        :width="'120px'"
        :height="'120px'"
        class="rounded-circle skelenton-box"
      />
      <!--Avatar-->
      <ik-image
        :path="currentUser.avatar | placeholderAvatar"
        :lqip="{ active: true }"
        loading="lazy"
        alt="使用者大頭照"
      />
      <h5 class="mt-3 profile-card-top-name">
        {{ currentUser.name }}
      </h5>
      <small class="profile-top-balance">
        {{ currentUser.subscriptionStatus | getSubscriptionStatus }} | 剩餘 {{ currentUser.subscriptionBalance }} 餐
      </small>
    </div>
    <hr class="m-0">
    <!--Nav-->
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
import SkelentonBox from '../Placeholder/SkeletonBox'
import { placeholderAvatarFilter } from '../../utils/mixins'
import { mapState } from 'vuex'

export default {
  filters: {
    getSubscriptionStatus: status => {
      if (status) return '訂閱中'
      return '未訂閱'
    }
  },
  components: {
    SkelentonBox
  },
  mixins: [placeholderAvatarFilter],
  computed: {
    ...mapState(['currentUser'])
  }
}
</script>

<style lang="scss" scoped>
.profile {
  &-card {
    background-color: color(quaternary);

    /* User Info */
    &-top {
      padding: 1.5rem;
      text-align: center;

      &-name {
        font-size: size(md);
        font-weight: weight(bold);
      }

      img {
        position: relative;
        width: 120px;
        height: 120px;
        object-fit: cover;
        border-radius: 50%;
      }
    }

    /* Nav */
    &-bottom { padding: .5rem 0; }
  }
}

.nav {
  &-item { text-align: center; }

  &-link {
    @include linkStyling(lighten(color(secondary), 10%));
    padding: .5rem 1rem;
    font-size: size(sm);

    &:hover { color: color(primary); }

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

.skelenton-box { position: absolute; }
</style>
