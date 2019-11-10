<template>
  <section
    class="“banner"
  >
    <div class="banner-container">
      <div
        class="banner-img"
        :style="{backgroundImage: `url(${districtImage})`}"
      />
      <div class="banner-overlay" />
      <div class="banner-content">
        <h1 class="banner-content-title">
          {{ currentDistrict }}
        </h1>
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
              :class="{disabled: district.chinese_name === currentDistrict}"
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
export default {
  props: {
    districts: {
      type: Array,
      required: true
    },
    currentDistrict: {
      type: String,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      districtImage: ''
    }
  },
  watch: {
    districts (value) {
      this.getDistrictImage()
    }
  },
  created () {
    this.getDistrictImage()
  },
  methods: {
    getDistrictImage () {
      if (this.districts.length === 0) {
        this.districtImage = ''
        return
      }
      this.districtImage = this.districts.filter(district => district.chinese_name === this.currentDistrict)[0].image
    }
  }
}
</script>

<style lang="scss" scoped>
.banner {
  @include positionCenter;
  @include imgOverlay(0.9);

  &-container {
    margin-top: 62px;
  }

  &-img {
    @include setBackground("https://cdn.pixabay.com/photo/2019/09/23/14/34/nyc-4498752_1280.jpg", 300px);
  }
  &-content {
    color: color(quaternary);
    text-shadow: 1px 1px 1px #636161;

    &-title {
      font-size: size(xxl);
      font-weight: weight(bold);
    }
  }
}

.dropdown {
  &-toggle {
    color: color(quaternary);
  }

  &-menu {
    position: relative;
    transform: translate3d(15px, 32px, 0px) !important;
    background-color: color(quaternary);

    &::before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-bottom: 8px solid color(quaternary);
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
    }

    .disabled {
      color: color(primary);
    }
  }

  &-item {
    color: color(secondary);
    text-shadow: none;
  }
}
</style>
