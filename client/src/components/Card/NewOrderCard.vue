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
    @include setBackground('https://images.unsplash.com/photo-1549409466-c6449df8e23b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=4000&q=80', 100%);
    @include imgOverlay(0.5, color(quaternary));
    position: relative;
    border: none;
    height: 100%;

    &:hover  {
        .card-title {
            color: darken(color(secondary), 10%);
        }

        .card-overlay {
            background-color: transparentize(color(quaternary), .7);
        }

        .fa-glass-cheers {
            animation: spin 1s linear infinite;
        }
    }

    &-overlay {
        transition: background-color .1s linear;
    }

    &-body {
        @include flexPosition(center, center, column);
        position: relative;
        min-height: 500px;
    }

    &-title {
        font-size: size(md);
        color: color(secondary);
    }
}

.btn {
    @include solidButton(80, .3, secondary);
    padding: 0;
    line-height: 1.8rem;
    font-size: size(xs);
}
</style>
