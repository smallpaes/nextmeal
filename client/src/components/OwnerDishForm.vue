<template>
  <form
    class="form p-3 rounded shadow-sm needs-validation"
    novalidate
    @submit.stop.prevent="handleSubmit"
  >
    <h3 class="form-heading">
      <slot name="header" />餐點
    </h3>
    <!--Name-->
    <div class="form-group">
      <label for="name">餐點名稱</label>
      <input
        id="name"
        v-model.trim="dish.name"
        type="text"
        class="form-control"
        name="name"
        :disabled="isLoading"
        required
      >
      <div class="invalid-feedback">
        請輸入餐點名稱
      </div>
    </div>
    <!--Description-->
    <div class="form-group">
      <label for="description">餐點介紹</label>
      <textarea
        id="description"
        v-model="dish.description"
        class="form-control"
        :disabled="isLoading"
        name="description"
        minlength="10"
        maxlength="100"
        rows="2"
        required
      />
      <div class="invalid-feedback">
        請輸入 1-100 字餐點簡介
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
        :disabled="isLoading"
        class="file-input"
        accept=".png, .jpg, .jpeg"
        name="image"
        @change="handleFileChange($event,'dish')"
      >
      <!--Preview image-->
      <div
        v-if="dish.image"
        class="file-image-wrapper"
      >
        <img
          :src="dish.image"
          class="file-image"
          alt="餐點照片"
        >
        <span
          v-if="!isLoading"
          class="close-btn"
          aria-hidden="true"
          @click="dish.image = ''"
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
    <div class="btn-container mt-3">
      <button
        class="btn"
        type="submit"
        :disabled="isLoading"
      >
        <slot name="submitBtn" />
      </button>
    </div>
  </form>
</template>

<script>
import { handleFileChangeMethod } from '../utils/mixins'

export default {
  mixins: [handleFileChangeMethod],
  props: {
    initialDish: {
      type: Object,
      default: () => ({
        name: '',
        description: '',
        image: ''
      })
    },
    initialLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dish: {
        name: '',
        description: '',
        image: ''
      },
      isLoading: false
    }
  },
  watch: {
    initialDish (dish) {
      this.dish = {
        ...this.dish,
        ...dish
      }
    },
    initialLoading (isLoading) {
      this.isLoading = isLoading
    }
  },
  created () {
    this.dish = {
      ...this.dish,
      ...this.initialDish
    }
    this.isLoading = this.initialLoading
  },
  methods: {
    handleSubmit (e) {
      // form validation
      const form = e.target
      if (form.checkValidity() === false) {
        form.classList.add('was-validated')
        return
      }
      // prepare a FormData
      const formData = new FormData(form)
      // notify and send to parent
      this.$emit('after-submit', formData)
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
    @include formControl;
    background-color: color(quaternary);
    color: color(secondary);

    &-heading {
        margin: 0 0 1.5rem 0;
        font-size: size(md);
        color: darken(color(secondary), 8%);
    }

    &-control {
        @include formValidation;
    }
}

.file {
    &-input {
        @include hiddenInput;
    }

    /* Style label into button */
    &-label {
        @include flexPosition;
        @include buttonOutline(100, 100, lighten(color(secondary), 50%), color(primary), color(quaternary), 0.1);
        cursor: pointer;
    }

    &-image {
        width: 100%;
        height: 100%;
        object-fit: cover;

        &-wrapper {
            position: relative;
            width: 100px;
            height: 100px;
            padding: .2rem;
            border-radius: .1rem;
            border: 1px solid lighten(color(secondary), 50%);

            .close-btn {
                position: absolute;
                top: 0;
                right: 4px;
                color: lighten(color(secondary), 15%);
                cursor: pointer;

                &:hover {
                    color: lighten(color(secondary), 30%);
                }
            }
        }
    }
}

.btn {
    @include solidButton;
    min-width: 100px;
    transition: min-width .2s linear;

    &-container {
        text-align: center;

        @include response(md) {
            text-align: right;
        }
    }

    @include response(md) {
        min-width: 200px;
    }
}
</style>
