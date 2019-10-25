<template>
  <div
    class="card d-flex flex-row rounded-sm"
  >
    <div class="card-left">
      <img
        :src="meal.image"
        class="card-img rounded-0 d-none d-md-inline rounded-sm"
        alt="Dish image"
      >
    </div>
    <div class="card-right">
      <div class="card-body px-3 py-0">
        <router-link
          :to="{name: 'owner-dish-edit', params: {dish_id: meal.id}}"
          class="edit-btn btn p-0"
        >
          <i class="fas fa-pencil-alt" />
        </router-link>
        <h5 class="card-title m-0">
          {{ meal.name }}
        </h5>
        <p class="card-text d-none d-md-inline mt-2">
          {{ meal.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    meal: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
    position: relative;
    height: 50px;
    overflow-y: scroll;

    &-body {
        @include flexPosition(center, flex-start, column);
        height: 100%;
        width: 100%;
    }

    &-img {
        width: 120px;
        height: 100%;
        object-fit: cover;
    }

    &-title {
        font-size: size(sm);
        color: color(secondary);

        @include response(md) {
            font-size: size(md);
        }
    }

    &-text {
        font-size: size(sm);
        color: lighten(color(secondary), 10%);
    }

    .edit-btn {
        position: absolute;
        right: 2%;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        color: lighten(color(secondary), 10%);

        @include response(md) {
            top: 17%;
        }
    }

    @include response(md) {
        height: 120px;
    }
}
</style>
