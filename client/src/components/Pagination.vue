<template>
  <nav aria-label="Page navigation">
    <ul class="pagination d-flex justify-content-center">
      <!--Previous page-->
      <li
        v-if="previousPage"
        class="page-item page-item-control"
      >
        <router-link
          class="page-link"
          aria-label="Previous"
          :to="{name: $route.name, query: { ...query, page: previousPage }}"
        >
          <i class="fas fa-angle-left" />
        </router-link>
      </li>

      <!--Pages-->
      <template v-for="page in totalPage">
        <!--Placeholder page-->
        <li
          v-if="page === totalPage && Math.abs(page - currentPage) > 2"
          :key="page"
          class="page-placeholder"
        >
          ...
        </li>
        <li
          v-if="Math.abs(page - currentPage) < 2 || page === totalPage || page === 1"
          :key="page + 'prev'"
          class="page-item"
          :class="['page-item', { active: currentPage === page, first: page === 1}]"
        >
          <router-link
            class="page-link"
            :to="{name: $route.name, query: { ...query, page }}"
          >
            {{ page }}
          </router-link>
        </li>
        <!--Placeholder page-->
        <li
          v-if="page === 1 && Math.abs(page - currentPage) > 2"
          :key="page + 'next'"
          class="page-placeholder"
        >
          ...
        </li>
      </template>

      <!--Next page -->
      <li
        v-if="nextPage"
        class="page-item page-item-control"
      >
        <router-link
          class="page-link"
          :to="{name: $route.name, query: { ...query, page: nextPage }}"
          aria-label="Next"
        >
          <i class="fas fa-angle-right" />
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    totalPage: {
      type: Number,
      default: -1
    },
    query: {
      type: Object,
      required: true
    }
  },
  computed: {
    previousPage () {
      return this.currentPage === 1 ? null : this.currentPage - 1
    },
    nextPage () {
      return this.currentPage === this.totalPage ? null : this.currentPage + 1
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  &-link {
    padding: 0;
    line-height: 31px;
    color: color(tertiary);
    background-color: transparent;
    border: none;
  }

  &-item {
    margin: 0rem;
    overflow: hidden;
    width: 31px;
    height: 31px;
    text-align: center;
    border-radius: 50%;

    @include response(sm) {
      margin: 0 .4rem;
    }

    &-control {
      border: 1px solid color(tertiary);
    }

    &.active {
      .page-link {
        background-color: color(tertiary);
      }
    }

    &:hover {
      font-weight: weight(bold);
    }
  }

  &-placeholder {
    color: lighten(color(secondary), 35%);
  }
}

</style>
