<template>
  <section
    class="“banner"
  >
    <div class="banner-container">
      <div class="banner-img" />
      <div class="banner-content">
        <h1 class="banner-content-title">
          吃飯免煩惱
        </h1>
        <h3 class="banner-content-description">
          午餐不到 100 元
        </h3>
        <button class="btn mt-2">
          體驗看看
        </button>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.banner {
    @include positionCenter;

    &-container {
        margin-top: 62px;
    }

    &-img {
        @include setBackground("https://images.pexels.com/photos/929192/pexels-photo-929192.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260", 550px);
    }
    &-content {
        color: color(quaternary);
        text-shadow: 1px 1px 1px #636161;

        &-title {
            font-size: size(xl);
            font-weight: weight(bold);
        }

        &-description {
            font-size: size(lg);
            font-weight: weight(bold);
        }

        .btn {
            @include solidButton;
        }
    }
}
</style>
