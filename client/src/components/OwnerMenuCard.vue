<template>
  <div
    class="card d-flex flex-row rounded-sm rounded-0"
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
        <button
          v-if="$route.query.ran === 'nextWeek' && currentDay !== 0"
          type="button"
          class="edit-btn btn p-0"
          @click="$emit('edit-meal')"
        >
          <i class="fas fa-pencil-alt" />
        </button>
        <h5 class="card-title m-0">
          {{ day }}
        </h5>
        <div class="card-description mt-2">
          <p class="m-0 d-inline d-md-block">
            <span class="d-none d-md-inline">餐點名稱：</span>
            {{ meal.name }}
          </p>
          <p class="m-0 d-inline d-md-block">
            <span class="d-none d-md-inline">供應數量</span>
            ：{{ ran === 'thisWeek' ? meal.quantity : meal.nextServing_quantity }}份
          </p>
        </div>
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
    },
    day: {
      type: String,
      required: true
    },
    ran: {
      type: String,
      required: true
    }
  },
  computed: {
    currentDay: function () {
      const date = new Date()
      return date.getDay()
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

    &-description {
        font-size: size(sm);
        color: lighten(color(secondary), 10%);
    }

    .edit-btn {
        position: absolute;
        right: 2%;
        top: 15%;
        cursor: pointer;
        color: lighten(color(secondary), 10%);

        @include response(md) {
            top: 10%;
        }
    }

    @include response(md) {
        height: 120px;
    }
}
</style>
