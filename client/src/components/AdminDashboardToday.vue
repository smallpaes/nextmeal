<template>
  <div class="card rounded-sm shadow-sm border-0 mb-4">
    <div class="card-header bg-white">
      <i class="fas fa-chart-area mr-2" />今日概況
    </div>
    <div class="card-body row">
      <div class="col-6 col-lg-3 card-item">
        <div class="card-item-left">
          <div class="card-item-icon">
            <i class="fas fa-clipboard-list" />
          </div>
        </div>
        <div class="card-item-right">
          <div class="card-item-title">
            訂單量
          </div>
          <div class="card-item-text">
            325
          </div>
        </div>
      </div>
      <div class="col-6 col-lg-3 card-item">
        <div class="card-item-left">
          <div class="card-item-icon">
            <i class="fas fa-users" />
          </div>
        </div>
        <div class="card-item-right">
          <div class="card-item-title">
            會員數
          </div>
          <div class="card-item-text">
            &#43; 32
          </div>
        </div>
      </div><div class="col-6 col-lg-3 card-item">
        <div class="card-item-left">
          <div class="card-item-icon">
            <i class="fas fa-store" />
          </div>
        </div>
        <div class="card-item-right">
          <div class="card-item-title">
            餐廳數
          </div>
          <div class="card-item-text">
            &#43; 120
          </div>
        </div>
      </div><div class="col-6 col-lg-3 card-item">
        <div class="card-item-left">
          <div class="card-item-icon">
            <i class="far fa-credit-card" />
          </div>
        </div>
        <div class="card-item-right">
          <div class="card-item-title">
            訂閱量
          </div>
          <div class="card-item-text">
            &#43; 30
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$icon-colors: (
  1: rgb(239,75,77),
  2: rgb(78,202,138),
  3: rgb(247,185,36),
  4: rgb(62,160,252)
);

.card {
  &-item {
    display: flex;

    &-left {
      @include flexPosition(center, center, row);
    }

    &-icon {
      @include flexPosition(center, center, row);
      border-radius: 50%;
      width: 46px;
      height: 46px;
      font-size: size(md);
      color: color(quaternary);
    }

    &-right {
      padding: 0 1rem;
    }

    &-title {
      font-size: size(xs);
      color: lighten(color(secondary), 30%);
    }

    &-text {
      font-size: size(lg);
      font-weight: weight(bold);
      color: color(secondary);
    }
  }
}

@for $i from 1 through 4 {
  .card-item:nth-of-type(#{$i}) {
    .card-item-icon {
      background-color: map-get($icon-colors, $i);
    }
  }
}

</style>
