<template>
  <div
    class="card d-flex flex-row rounded-sm rounded-0"
  >
    <div class="card-left d-none d-md-inline">
      <!--Placeholder image when image is still loading-->
      <SkelentonBox
        class="skelenton-box"
        :width="'120px'"
        :height="'111px'"
      />
      <ik-image
        :path="image"
        :lqip="{ active: true }"
        loading="lazy"
        alt="菜單餐點照片"
        class="card-img rounded-0 rounded-sm"
      />
    </div>
    <div class="card-right">
      <div class="card-body px-3 py-0">
        <button
          v-if="editBtn"
          type="button"
          class="edit-btn btn p-0"
          @click="$emit('edit')"
        >
          <i class="fas fa-pencil-alt" />
        </button>
        <h5 class="card-title m-0">
          <slot name="title" />
        </h5>
        <div class="card-description mt-2">
          <p class="m-0 d-inline d-md-block">
            <slot name="primary-description" />
          </p>
          <p class="m-0 d-inline d-md-block">
            <slot name="secondary-description" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SkelentonBox from '../Placeholder/SkeletonBox'

export default {
  components: {
    SkelentonBox
  },
  props: {
    image: {
      type: String,
      required: true
    },
    editBtn: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  height: 80px;
  overflow-y: scroll;
  border: none;
  border-bottom: 1px solid lighten(color(secondary), 50%);

  @include response(md) { height: 120px; }

  &-body {
    @include flexPosition(center, flex-start, column);
    width: 100%;
    height: 100%;
  }

  &-left {
    position: relative;
    .skelenton-box { position: absolute; }
  }

  &-img {
    position: relative;
    width: 120px;
    height: 100%;
    object-fit: cover;
  }

  &-title {
    font-size: size(sm);
    font-weight: weight(bold);
    color: color(secondary);

    @include response(md) {
      font-size: size(md);
      font-weight: weight(normal);
    }
  }

  &-description {
    font-size: size(sm);
    color: lighten(color(secondary), 10%);
  }

  .edit-btn {
    position: absolute;
    top: 15%;
    right: 2%;
    color: lighten(color(secondary), 10%);
    cursor: pointer;

    @include response(md) { top: 10%; }
  }
}
</style>
