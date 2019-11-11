<template>
  <button
    class="btn"
    :disabled="isFetching"
    @click="$emit('fetch-more')"
  >
    <template v-if="!isFetching">
      瀏覽更多
    </template>
    <template v-else>
      準備中 ...
    </template>
  </button>
</template>

<script>
export default {
  props: {
    isFetching: {
      type: Boolean,
      default: false
    }
  }
}
</script>
