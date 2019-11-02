<template>
  <section class="form">
    <form
      novalidate
      class="form-wrapper rounded-sm shadow-sm p-3"
      @submit.stop.prevent="handleSubmit"
    >
      <h2 class="form-title mb-4">
        您的評論
      </h2>
      <!--Time slot selection-->
      <fieldset class="form-group my-4">
        <legend class="form-legend">
          滿意度評分
          <span
            v-if="errorMessage.rating.length > 0"
            class="invalid-message"
          >({{ errorMessage.rating[0] }})</span>
        </legend>
        <!--Radio group-->
        <CustomRatingInput v-model="comment.rating" />
      </fieldset>
      <!--Description-->
      <div class="form-group my-4">
        <label for="description">
          餐點評價
          <span
            v-if="errorMessage.content.length > 0"
            class="invalid-message"
          >({{ errorMessage.content[0] }})</span>
        </label>
        <textarea
          id="description"
          v-model.trim="comment.content"
          class="form-control"
          minlength="10"
          maxlength="100"
          rows="2"
          required
        />
        <div class="invalid-feedback">
          請輸入餐點評價，長度介於 10-100 之間
        </div>
      </div>
      <!--Image upload-->
      <p class="mb-2">
        上傳餐點照片
      </p>
      <div class="form-group">
        <!--Invisible file upload button-->
        <input
          id="file"
          type="file"
          class="file-input"
          accept=".png, .jpg, .jpeg"
          @change="handleFileChange($event, 'comment')"
        >
        <!--Preview image-->
        <div
          v-if="comment.image"
          class="file-image-wrapper"
        >
          <img
            :src="comment.image"
            class="file-image"
            alt="餐點照片"
          >
          <span
            class="close-btn"
            aria-hidden="true"
            @click="comment.image = ''"
          >&times;</span>
        </div>
        <!--Visible file upload button-->
        <label
          v-else
          for="file"
          class="file-label"
        >
          <i class="fas fa-plus" />
        </label>
        <div class="invalid-feedback">
          請上傳一張圖片檔案
        </div>
      </div>
      <hr class="form-divider mt-4">
      <div class="btn-container text-center">
        <button
          class="btn"
          type="submit"
        >
          送出評價
        </button>
      </div>
    </form>
  </section>
</template>

<script>
import { handleFileChangeMethod } from '../utils/mixins'
import CustomRatingInput from '../components/CustomRatingInput'

export default {
  components: {
    CustomRatingInput
  },
  mixins: [handleFileChangeMethod],
  data () {
    return {
      comment: {
        image: '',
        rating: '',
        content: ''
      },
      errorMessage: {
        rating: [],
        content: []
      }
    }
  },
  methods: {
    handleSubmit () {
    // validate rating
      if (!this.comment.rating) {
        return this.errorMessage.rating.push('請給予評價')
      }

      this.errorMessage.rating = []

      // validate content
      if (this.comment.content < 10 || this.comment.content > 100) {
        return this.errorMessage.content.push('請輸入 10-100 字評論')
      }

      this.errorMessage.content = []

      const formData = {
        rating: this.comment.rating,
        user_text: this.comment.content,
        image: this.comment.image
      }
      // POST /api/order/:order_id/comment
      console.log(formData)
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
    @include fileUpload;
    @include formControl;
    width: 100%;

    &-wrapper {
        background-color: color(quaternary);
    }

    &-title {
        font-size: size(md);
        font-weight: weight(bold);
        color: color(primary);
    }

    &-legend {
        font-size: size(sm);
    }
}

.btn-container {
    .btn {
        @include solidButton(80, .3, primary);
        margin-left: .8rem;
        padding: .1rem;
        line-height: 1.8rem;

        @include response(md) {
            min-width: 180px;
            padding: .2rem .5rem;
            margin-left: 1rem;
        }
    }
}

.invalid-message {
    color: color(primary);
}
</style>
