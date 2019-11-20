<template>
  <section class="form">
    <form
      ref="form"
      novalidate
      class="form-wrapper rounded-sm shadow-sm p-3"
    >
      <h2 class="form-title mb-4">
        您的評論
      </h2>
      <!--Time slot selection-->
      <fieldset class="form-group my-4">
        <legend class="form-legend">
          滿意度評分
        </legend>
        <!--Radio group-->
        <CustomRatingInput v-model="comment.rating" />
      </fieldset>
      <!--Comment-->
      <div
        class="form-group my-4"
        :class="{invalid: $v.comment.content.$error}"
      >
        <label for="comment">
          餐點評價
        </label>
        <textarea
          id="comment"
          v-model.trim="comment.content"
          :disabled="isProcessing"
          class="form-control"
          minlength="10"
          maxlength="100"
          rows="2"
          name="user_text"
          required
          @blur="$v.comment.content.$touch()"
        />
        <small
          v-if="$v.comment.content.$error"
          class="form-text"
        >請輸入餐點評價，長度介於 10-100 之間</small>
      </div>
      <!--Image upload-->
      <p class="mb-2">
        上傳餐點照片
      </p>
      <div
        class="form-group"
      >
        <!--Invisible file upload button-->
        <input
          id="file"
          type="file"
          class="file-input"
          name="image"
          accept=".png, .jpg, .jpeg"
          @change="handleFileChange($event, 'comment')"
        >
        <!--Preview image-->
        <div
          v-if="comment.image"
          class="file-image-wrapper"
          @click="comment.image = ''"
        >
          <img
            :src="comment.image"
            class="file-image"
            alt="評論照片"
          >
          <i class="far fa-window-close" />
        </div>
        <!--Visible file upload button-->
        <label
          v-else
          for="file"
          class="file-label"
        >
          <i class="fas fa-plus" />
        </label>
      </div>
      <hr class="form-divider mt-4">
      <!--Submit Button-->
      <div class="btn-container text-center">
        <ProcessButton
          class="btn"
          :is-processing="isProcessing"
          :v="{}"
          :color="'primary'"
          :border-radius="'.3rem'"
          @after-click="handleSubmit"
        >
          <template #initial>
            <slot name="submit">
              送出評價
            </slot>
          </template>
        </ProcessButton>
      </div>
    </form>
  </section>
</template>

<script>
import { handleFileChangeMethod } from '../utils/mixins'
import CustomRatingInput from '../components/CustomRatingInput'
import ProcessButton from '../components/Button/ProcessButton'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import orderApi from '../apis/order'
import { Toast } from '../utils/helpers'

export default {
  components: {
    CustomRatingInput,
    ProcessButton
  },
  mixins: [handleFileChangeMethod],
  data () {
    return {
      comment: {
        image: '',
        rating: '',
        content: ''
      },
      isProcessing: false
    }
  },
  validations: {
    comment: {
      rating: {
        required
      },
      content: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(100)
      }
    }
  },
  methods: {
    async handleSubmit (e) {
      try {
        // prepare a FormData
        const form = this.$refs.form
        const formData = new FormData(form)
        const orderId = this.$route.params.order_id
        // update processing status
        this.isProcessing = true
        // create new comment
        // fetch order data from API
        const { data, statusText } = await orderApi.postComment({ orderId, formData })
        // error handling
        if (statusText !== 'OK' || data.status !== 'success') throw new Error(data.message)
        // redirect to user order page
        this.$router.push({ name: 'user-order' })
      } catch (error) {
        // update processing status
        this.isProcessing = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法發出評論，請稍後再試'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  @include fileUpload;
  @include inputValidation;
  @include formControl;
  width: 100%;

  &-wrapper { background-color: color(quaternary); }

  &-title {
    font-size: size(md);
    font-weight: weight(bold);
    color: color(primary);
  }

  &-legend { font-size: size(sm); }
}

.btn-container {
  .btn {
    @include solidButton(80, .3, primary);
    padding: .1rem;
    margin-left: .8rem;
    line-height: 1.8rem;

    @include response(md) {
      min-width: 180px;
      padding: .2rem .5rem;
      margin-left: 1rem;
    }
  }
}

.invalid-message { color: color(primary); }
</style>
