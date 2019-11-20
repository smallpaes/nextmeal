<template>
  <div class="card rounded-sm shadow-sm border-0">
    <div class="card-header bg-white">
      <i class="fas fa-comment mr-2" />評論
    </div>
    <ul
      v-if="comments.length > 0"
      class="list-group list-group-flush"
    >
      <li
        v-for="(comment, index) in comments"
        :key="index"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div class="list-group-item-wrapper">
          <p class="list-title m-0">
            {{ comment.name }}
          </p>
          <p class="list-text m-0">
            {{ comment.user_text }} -- {{ comment.createdAt | timeTransform }}
          </p>
        </div>

        <span class="list-rating">&#9733; {{ comment.rating | padEnd }}</span>
      </li>
    </ul>
    <!--Placeholder Messgae for Empty Data-->
    <div
      v-else
      class="card-body"
    >
      <i class="far fa-sticky-note" />
      尚未有評論
    </div>
  </div>
</template>

<script>
import { padEndFilter, textTruncateFilter, timeTransformFilter } from '../../utils/mixins'

export default {
  mixins: [padEndFilter, textTruncateFilter, timeTransformFilter],
  props: {
    comments: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

.card {
  height: 100%;
  overflow: hidden;

  &-header {
    padding: .6rem 1.25rem;
    font-size: size(sm);
    color: color(secondary);
  }

  &-body {
    @include flexPosition(center, center, column);
    font-size: size(xs);
    color: lighten(color(secondary), 30%);
  }
}

.list {
  &-group {
    max-height: 286.188px;
    overflow-y: scroll;

    &-item {
      &-wrapper {
        max-width: 80%;
      }
    }
  }

  &-title {
    font-size: size(xs);
    font-weight: weight(bold);
  }

  &-text {
    font-size: size(xs);
    color: lighten(color(secondary), 20%);
  }

  &-date {
    font-size: size(xs);
    color: lighten(color(secondary), 20%);
  }

  &-rating {
    font-size: size(xs);
    color: color(primary);
  }
}
</style>
