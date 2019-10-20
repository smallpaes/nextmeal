<template>
  <div
    class="card d-flex flex-row rounded-sm"
  >
    <div class="card-left">
      <img
        src="https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_1280.jpg"
        class="card-img rounded-0 d-none d-md-inline rounded-sm"
        alt="Dish image"
      >
    </div>
    <div class="card-right">
      <div class="card-body px-3 py-0">
        <a
          ref="#"
          class="edit-btn btn p-0"
        >
          <i class="fas fa-pencil-alt" />
        </a>
        <h5 class="card-title m-0">
          Card title
        </h5>
        <p class="card-text d-none d-md-inline mt-2">
          This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.
        </p>
      </div>
    </div>
  </div>
</template>

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

        @include response(md) {
            top: 17%;
        }
    }

    @include response(md) {
        height: 120px;
    }
}
</style>
