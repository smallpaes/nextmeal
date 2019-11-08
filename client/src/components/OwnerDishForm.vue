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
    <div
      class="form-group"
      :class="{invalid: $v.dish.name.$error}"
    >
      <label for="name">餐點名稱</label>
      <input
        id="name"
        v-model.trim="dish.name"
        type="text"
        class="form-control"
        name="name"
        :disabled="isProcessing"
        required
        maxlength="10"
        minlength="1"
        @blur="$v.dish.name.$touch()"
      >
      <small
        v-if="$v.dish.name.$error"
        class="form-text"
      >請輸入 1-10 位餐點名稱</small>
    </div>
    <!--Description-->
    <div
      class="form-group"
      :class="{invalid: $v.dish.description.$error}"
    >
      <label for="description">餐點介紹</label>
      <textarea
        id="description"
        v-model="dish.description"
        class="form-control"
        :disabled="isProcessing"
        name="description"
        minlength="10"
        maxlength="100"
        rows="2"
        required
        @blur="$v.dish.description.$touch()"
      />
      <small
        v-if="$v.dish.description.$error"
        class="form-text"
      >請輸入餐點簡介，長度介於 10-100 之間</small>
    </div>
    <!--Image upload-->
    <p class="mb-2">
      上傳餐點照片
    </p>
    <div
      class="form-group"
      :class="{invalid: !$v.dish.image.hasImage}"
    >
      <small
        v-if="!$v.dish.image.hasImage && $v.dish.image.$dirty"
        class="form-text mb-2"
      >請上傳一張照片&#8595;</small>
      <!--Invisible file upload button-->
      <input
        id="file"
        type="file"
        :disabled="isProcessing"
        class="file-input"
        accept=".png, .jpg, .jpeg"
        name="image"
        @change="handleFileChange($event,'dish')"
        @input="$v.dish.image.$touch()"
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
          v-if="!isProcessing"
          class="close-btn"
          aria-hidden="true"
          @click="dish.image = ''; $v.dish.image.$touch()"
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
    </div>
    <div class="btn-container mt-3">
      <button
        class="btn"
        type="submit"
        :disabled="isProcessing || $v.$invalid"
      >
        <slot name="submitBtn" />
      </button>
    </div>
  </form>
</template>

<script>
import { handleFileChangeMethod } from '../utils/mixins'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

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
    initialProcessing: {
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
      isProcessing: false
    }
  },
  validations: {
    dish: {
      name: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(10)
      },
      image: {
        hasImage: value => {
          if (!value) return false
          return true
        }
      },
      description: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(300)
      }
    }
  },
  watch: {
    initialDish (dish) {
      this.dish = {
        ...this.dish,
        ...dish
      }
    },
    initialProcessing (isProcessing) {
      this.isProcessing = isProcessing
    }
  },
  created () {
    this.dish = {
      ...this.dish,
      ...this.initialDish
    }
    this.isProcessing = this.initialProcessing
  },
  methods: {
    handleSubmit (e) {
      // form validation
      const form = e.target
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
    @include inputValidation;
    @include formControl;
    background-color: color(quaternary);
    color: color(secondary);

    &-heading {
        margin: 0 0 1.5rem 0;
        font-size: size(md);
        color: darken(color(secondary), 8%);
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
