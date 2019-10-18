<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb bg-transparent px-0">
      <li class="breadcrumb-item">
        <router-link
          :to="{name: 'home'}"
          class="breadcrumb-link"
        >
          首頁
        </router-link>
      </li>
      <li class="breadcrumb-item">
        <router-link
          :to="{name: 'restaurants', query: {dist: restaurant.location}}"
          class="breadcrumb-link"
        >
          {{ restaurant.location }}
        </router-link>
      </li>
      <li
        class="breadcrumb-item active"
        aria-current="page"
      >
        {{ restaurant.name }}
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  props: {
    restaurant: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb {
    &-item {
        &:not(:first-child):before {
            content: '\203A';
            color: color(tertiary);
        }
    }

    &-link {
        color: color(tertiary);

        &:hover {
            color: darken(color(tertiary), 5%);
        }
    }
}
</style>
