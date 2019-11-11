<template>
  <footer class="py-3 footer w-100">
    <div class="footer-wrapper container d-flex flex-column text-center">
      <a
        href="#"
        class="footer-brand"
      >NextMeal</a>
      <div class="footer-nav mt-2">
        <router-link
          :to="{name: 'signup'}"
          class="footer-nav-link"
        >
          前往體驗
        </router-link>
        <router-link
          :to="{name: 'faq'}"
          class="footer-nav-link"
        >
          常見問題
        </router-link>
        <a
          href="https://github.com/smallpaes/nextmeal"
          class="footer-nav-link"
        >關於專案</a>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer{
  @include brand(footer);
  background-color: darken(color(secondary), 6%);

  &-nav-link {
    position: relative;
    padding: 0 1rem;
    color: lighten(color(secondary), 30%);
    font-size: size(xs);
    transition: color .2s linear;

    &:hover {
      color: lighten(color(secondary), 50%);
    }

    &:not(:last-child):after {
      content: '';
      position: absolute;
      left: 100%;
      top: 23%;
      border-left: 1px solid lighten(color(secondary), 30%);
      height: 70%;
      width: 1px;
    }
  }
}
</style>
