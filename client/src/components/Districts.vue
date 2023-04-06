<template>
  <div class="row px-3">
    <!--Show placeholder box while loading-->
    <template v-if="isLoading">
      <ImageCard
        v-for="index in 4"
        :key="index"
        :is-loading="isLoading"
      />
    </template>
    <template v-else>
      <ImageCard
        v-for="district in districts"
        :key="district.eng_name"
        :district="district"
        :is-loading="isLoading"
        :default-src="defaultSrc"
      />
    </template>
  </div>
</template>

<script>
import ImageCard from './Card/ImageCard'

export default {
  components: {
    ImageCard
  },
  props: {
    districts: {
      type: Array,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defaultSrc: '/District/fallback.jpg'
    }
  }
}
</script>
