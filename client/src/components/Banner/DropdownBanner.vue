<template>
  <section
    class="“banner"
  >
    <div class="banner-container">
      <ik-image
        :path="currentDistrict.image"
        :lqip="{ active: true }"
        loading="lazy"
        :alt="currentDistrict.chinese_name + '的照片'"
        class="banner-img"
      />
      <div class="banner-overlay" />
      <div class="banner-content">
        <h1 class="banner-content-title">
          {{ currentDistrict.chinese_name }}
        </h1>
        <!--Dropdown menu for city switch-->
        <div class="dropdown">
          <button
            id="dropdownMenuButton"
            class="btn dropdown-toggle p-0"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            :disabled="isLoading"
          >
            切換地區
          </button>
          <div
            class="dropdown-menu rounded-sm"
            aria-labelledby="dropdownMenuButton"
          >
            <router-link
              v-for="district in districts"
              :key="district.eng_name"
              :to="{name: 'restaurants', query: {dist: district.chinese_name}}"
              class="dropdown-item text-center"
              :class="{disabled: district.chinese_name === currentDistrict.chinese_name}"
            >
              {{ district.chinese_name }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { CARD_PLACEHOLDER_ORIGINAL_RELATIVE_URL } from '../../utils/image-url'
export default {
  props: {
    districts: {
      type: Array,
      required: true
    },
    currentDistrict: {
      type: Object,
      default: () => ({
        chinese_name: '',
        eng_name: '',
        image: CARD_PLACEHOLDER_ORIGINAL_RELATIVE_URL
      })
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.banner {
  @include positionCenter;
  @include imgOverlay(.9);

  &-container {
    margin-top: 62px;
    height: 300px;
  }

  &-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &-content {
    color: color(quaternary);
    text-shadow: 1px 1px 1px #636161;

    &-title {
      font-size: size(xl);
      font-weight: weight(bold);
      line-height: size(xl);
      height: size(xl);
      margin-bottom: 1rem;

      @include response(sm) {
        font-size: size(xxl);
        line-height: size(xxl);
        height: size(xxl);
        margin-bottom: 1.5rem;
      }
    }
  }
}

/* Dropdown menu for city switch */
.dropdown {
  &-toggle {
    @include solidButton(140);
    color: color(quaternary);
  }

  &-menu {
    position: relative;
    background-color: color(quaternary);
    transform: translate3d(-10px, 32px, 0) !important;

    @include response(sm) { transform: translate3d(25px, 32px, 0) !important;}

    /* Create Arrow On Top Of The Menu: Up */
    &::before {
      position: absolute;
      bottom: 100%;
      left: 50%;
      width: 0;
      height: 0;
      content: '';
      border-right: 8px solid transparent;
      border-bottom: 8px solid color(quaternary);
      border-left: 8px solid transparent;
      transform: translateX(-50%);
    }

    .disabled { color: color(primary); }
  }

  &-item {
    color: color(secondary);
    text-shadow: none;
    &:active { background-color: color(quinary); }
  }
}
</style>
