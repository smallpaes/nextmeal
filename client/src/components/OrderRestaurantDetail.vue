<template>
  <section class="detail">
    <div
      class="detail-wrapper rounded-sm shadow-sm px-3 pt-3 pb-0"
    >
      <h2 class="detail-title mb-4">
        餐廳資訊
      </h2>
      <div class="detail-content row">
        <div class="col-md-6 my-3">
          <h5 class="detail-content-title">
            餐廳名稱
          </h5>
          <h2 class="detail-content-description">
            {{ restaurant.name }}
          </h2>
        </div>
        <div class="col-md-6 my-3">
          <h5 class="detail-content-title">
            餐廳電話
          </h5>
          <h2 class="detail-content-description">
            {{ restaurant.tel }}
          </h2>
        </div>
      </div>
      <div class="detail-content row">
        <div class="col my-3">
          <h5 class="detail-content-title">
            餐廳地址
          </h5>
          <h2 class="detail-content-description">
            {{ restaurant.address }}
          </h2>
        </div>
      </div>
      <div class="row">
        <GMap
          :center="{lat: parseFloat(restaurant.lat), lng: parseFloat(restaurant.lng)}"
          :locations="[restaurant]"
          :street-view-control="false"
          :map-type-control="false"
          :fullscreen-control="true"
          :zoom-control="true"
          :zoom="17"
          class="shadow-sm rounded-sm"
        />
      </div>
    </div>
  </section>
</template>

<script>
import GMap from '../components/GMap'
export default {
  components: {
    GMap
  },
  props: {
    restaurant: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.detail {
    width: 100%;

    &-wrapper {
        background-color: color(quaternary);
    }

    &-title {
        font-size: size(md);
        font-weight: weight(bold);
        color: color(primary);
    }

    &-content {
        &-title {
            font-size: size(sm);
            color: lighten(color(secondary), 30%);
        }

        &-description {
            font-size: size(sm);
            font-weight: weight(bold);
        }
    }
}

.google-map {
  width: 100%;
  height: 200px;
  transition: height .2s linear;

  @include response(md) {
    height: 300px;
  }
}
</style>
