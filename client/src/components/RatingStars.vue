<template>
  <div class="stars-container">
    <!--Solid Stars-->

    <i
      v-for="index in rating"
      :key="index"
      class="fas fa-star"
    />

    <!--Hollow Stars-->
    <i
      v-for="index in (5 - rating)"
      :key="rating + index"
      class="far fa-star"
    />
  </div>
</template>

<script>
export default {
  props: {
    rating: {
      type: Number,
      required: true
    }
  }
}
</script>
