<template>
  <div
    class="card shadow"
    href="#"
  >
    <div class="card-overlay" />
    <div class="card-body">
      <slot name="content" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@include spinAnimation;

.card {
  @include setBackground(image('card'), 100%);
  @include imgOverlay(.5, color(quaternary));
  position: relative;
  height: 100%;
  border: none;

  &:hover  {
    .card-title { color: darken(color(secondary), 10%); }
    .card-warning { color: darken(color(secondary), 10%); }
    .card-overlay { background-color: transparentize(color(quaternary), .7); }
    .fa-glass-cheers { animation: spin 1s linear infinite; }
  }

  &-overlay { transition: background-color .1s linear; }

  &-body {
    @include flexPosition(center, center, column);
    position: relative;
    min-height: 500px;
  }

  &-title {
    font-size: size(md);
    color: color(secondary);
  }

  &-warning { font-weight: weight(normal);}
}

.btn {
  @include solidButton(80, .3, secondary);
  padding: 0;
  font-size: size(xs);
  line-height: 1.8rem;
}
</style>
