<template>
  <form
    class="form p-3 rounded shadow-sm"
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
        v-model.trim="name"
        type="text"
        class="form-control"
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
        v-model="description"
        class="form-control"
        minlength="10"
        maxlength="100"
        rows="2"
        required
      />
      <div class="invalid-feedback">
        請輸入餐點簡介
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
        @change="handleFileChange"
      >
      <!--Preview image-->
      <div
        v-if="image"
        class="file-image-wrapper"
      >
        <img
          :src="image"
          class="file-image"
          alt="餐點照片"
        >
        <span
          class="close-btn"
          aria-hidden="true"
          @click="image = ''"
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
      >
        <slot name="submitBtn" />
      </button>
    </div>
  </form>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      description: '',
      image: ''
    }
  },
  methods: {
    handleFileChange (e) {
      const files = e.target.files
      if (!files.length) return
      const imageURL = window.URL.createObjectURL(files[0])
      this.image = imageURL
    },
    handleSubmit () {
      const formData = { name: this.name, description: this.description, image: this.image }
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

    &-container {
        text-align: center;

        @include response(md) {
            text-align: right;
        }
    }
}
</style>
