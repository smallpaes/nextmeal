<template>
  <form
    class="form p-3 rounded shadow-sm"
    novalidate
  >
    <!--Show alert section-->
    <div
      v-if="warningMessage"
      class="alert p-1"
      role="alert"
    >
      <i class="fas fa-exclamation-circle" />  {{ warningMessage }}
    </div>
    <div class="form-row">
      <!--Name-->
      <div class="form-group col-md-6">
        <label for="name">名稱</label>
        <input
          id="name"
          v-model.trim="restaurant.name"
          :disabled="isProcessing"
          type="text"
          class="form-control"
          required
        >
        <div class="invalid-feedback">
          請輸入餐廳名稱
        </div>
      </div>
      <!--Category-->
      <div class="form-group col-md-6">
        <label for="category">類別</label>
        <select
          v-model.trim="restaurant.Category.id"
          class="form-control"
          :disabled="isProcessing"
          required
        >
          <option
            value=""
            selected
          >
            餐廳類別
          </option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
            :selected="category.name === restaurant.Category.name"
          >
            {{ category.name }}
          </option>
        </select>
        <div class="invalid-feedback">
          請選擇餐廳類別
        </div>
      </div>
    </div>
    <div class="form-row">
      <!--Opening time-->
      <div class="form-group col-md-6">
        <label for="opening-hour">開始營業時間</label>
        <input
          id="opening-hour"
          v-model.trim="restaurant.openingHour"
          type="time"
          :disabled="isProcessing"
          class="form-control"
          required
        >
        <div class="invalid-feedback">
          請輸入開始營業時間
        </div>
      </div>
      <!--Closing time-->
      <div class="form-group col-md-6">
        <label for="closing-hour">結束營業時間</label>
        <input
          id="closing-hour"
          v-model.trim="restaurant.closingHour"
          :disabled="isProcessing"
          type="time"
          class="form-control"
          required
        >
        <div class="invalid-feedback">
          請輸入結束營業時間
        </div>
      </div>
    </div>
    <!--Address-->
    <div class="form-group">
      <label for="address">地址</label>
      <input
        id="address"
        v-model.trim="restaurant.address"
        :disabled="isProcessing"
        type="text"
        class="form-control"
        placeholder="台北市大安區..."
        required
      >
      <div class="invalid-feedback">
        {{ validationMsg.address }}
      </div>
    </div>
    <!--Phone number-->
    <div class="form-group">
      <label for="tel">電話</label>
      <input
        id="tel"
        v-model.trim="restaurant.tel"
        :disabled="isProcessing"
        type="tel"
        class="form-control"
        pattern="[0-9]{2}-[0-9]{4}-[0-9]{4}"
        placeholder="02-2343-2344"
        required
      >
      <div class="invalid-feedback">
        請輸入電話號碼
      </div>
    </div>
    <!--Description-->
    <div class="form-group">
      <label for="description">餐廳介紹</label>
      <textarea
        id="description"
        v-model.trim="restaurant.description"
        :disabled="isProcessing"
        class="form-control"
        minlength="10"
        maxlength="100"
        rows="2"
        required
      />
      <div class="invalid-feedback">
        請輸入餐廳簡介，長度介於 10-100 之間
      </div>
    </div>
    <!--Image upload-->
    <p class="mb-2">
      上傳餐廳照片
    </p>
    <div class="form-group">
      <!--Invisible file upload button-->
      <input
        id="file"
        type="file"
        class="file-input"
        accept=".png, .jpg, .jpeg"
        @change="handleFileChange($event, 'restaurant')"
      >
      <!--Preview image-->
      <div
        v-if="restaurant.image"
        class="file-image-wrapper"
      >
        <img
          :src="restaurant.image"
          class="file-image"
          alt="餐廳照片"
        >
        <span
          class="close-btn"
          aria-hidden="true"
          @click="restaurant.image = ''"
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
        :class="{'btn-update': $route.name === 'admin-restaurant-edit'}"
        :disabled="isProcessing"
        @click.stop.prevent="getLocation('restaurant')"
      >
        更新
      </button>
      <button
        v-if="$route.name ==='admin-restaurant-edit'"
        class="btn"
        :disabled="isProcessing"
        @click.stop.prevent="$emit('after-delete')"
      >
        刪除
      </button>
    </div>
  </form>
</template>

<script>
import { getGeoMethods, handleFileChangeMethod } from '../utils/mixins'

export default {
  mixins: [getGeoMethods, handleFileChangeMethod],
  props: {
    initialRestaurant: {
      type: Object,
      default: () => ({
        name: '',
        Category: {},
        openingHour: '',
        closingHour: '',
        location: '',
        address: '',
        tel: '',
        description: '',
        image: '',
        lng: '',
        lat: ''
      })
    },
    categories: {
      type: Array,
      required: true
    },
    initialProcessing: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      restaurant: {
        name: '',
        Category: {},
        openingHour: '',
        closingHour: '',
        location: '',
        address: '',
        tel: '',
        description: '',
        image: '',
        lng: '',
        lat: ''
      },
      warningMessage: '',
      apiKey: process.env.VUE_APP_GOOGLE,
      validationMsg: {
        address: '請輸入地址'
      },
      formData: {},
      isProcessing: false
    }
  },
  watch: {
    initialRestaurant (restaurant) {
      this.restaurant = {
        ...this.restaurant,
        ...restaurant
      }
    },
    initialProcessing (isProcessing) {
      this.isProcessing = isProcessing
    }
  },
  created () {
    this.restaurant = {
      ...this.restaurant,
      ...this.initialRestaurant
    }
    this.isProcessing = this.initialProcessing
  },
  methods: {
    afterReceiveGeo () {
      const formData = {
        name: this.restaurant.name,
        description: this.restaurant.description,
        image: this.restaurant.image,
        tel: this.restaurant.tel,
        address: this.restaurant.address,
        opening_hour: this.restaurant.openingHour,
        closing_hour: this.restaurant.closingHour,
        lat: this.restaurant.lat,
        lng: this.restaurant.lng,
        location: this.restaurant.location,
        CategoryId: this.restaurant.Category.id
      }
      // notify parent view
      this.$emit('after-submit', formData)
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  @include fileUpload;
    @include formControl;
    background-color: color(quaternary);
    color: color(secondary);

    &-control {
        @include formValidation;
    }
}

.btn {
    @include solidButton;
    min-width: 100px;
    margin: 0 .5rem;
    padding: .28rem .7rem;

    &-container {
        @include flexPosition(center, center, row);
    }

    &-update {
      background-color: color(tertiary);

      &:hover {
        background-color: darken(color(tertiary), 20%);
      }
    }

    @include response(md) {
      min-width: 200px;
      padding: .375rem .75rem;
    }
}

.alert {
  background-color: color(tertiary);
  color: color(quaternary);
}
</style>
