<template>
  <section class="process bg-white">
    <div class="container pt-3 pb-5">
      <div class="process-heading">
        <h1 class="process-heading-title">
          簡單響食
        </h1>
        <p class="process-heading-description">
          輕鬆三步驟
        </p>
      </div>
      <transition
        name="slide-in-left"
        appear
      >
        <div class="process-wrapper row">
          <div
            v-for="process in processes"
            :key="process.description"
            class="process text-center col-4"
          >
            <h2 class="process-icon">
              <i :class="process.icon" />
            </h2>
            <h3 class="process-description">
              {{ process.description }}
            </h3>
          </div>
        </div>
      </transition>
      <button
        class="btn mt-5"
        @click.stop.prevent="$emit('learn-more')"
      >
        了解更多
      </button>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      processes: [
        {
          icon: 'fas fa-store',
          description: '選餐廳'
        },
        {
          icon: 'far fa-clock',
          description: '選時段'
        },
        {
          icon: 'fas fa-utensils',
          description: '取餐點'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@include slideInLeftAnimation;

.process {
  @include headingStyling;
  text-align: center;

  &-icon {
    font-size: size(xl);
    color: color(tertiary);

    @include response(md) {
      font-size: size(xxl);
    }
  }

  &-description {
    font-size: size(sm);
  }

  &:not(:last-child):after {
    content: '';
    position: absolute;
    left: 90%;
    top: 50%;
    transform: translateY(-50%);
    border-bottom: 1px dashed lighten(color(secondary), 30%);
    width: 35px;
    height: 0;

    @include response(md) {
      width: 60px;
    }

    @include response(lg) {
      width: 90px;
    }
  }

  .btn {
    @include buttonOutline;
  }
}
</style>
