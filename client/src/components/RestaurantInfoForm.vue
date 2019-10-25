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
          v-model.trim="restaurant.Category.name"
          class="form-control"
          required
        >
          <option selected>
            餐廳類別
          </option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.name"
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

          :value="restaurant.openingHour"
          type="time"
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
        @click.stop.prevent="getLocation('restaurant')"
      >
        更新
      </button>
      <button
        v-if="$route.name ==='admin-restaurant-edit'"
        class="btn"
        @click.stop.prevent="deleteRestaurant"
      >
        刪除
      </button>
    </div>
  </form>
</template>

<script>
import { getGeoMethods, handleFileChangeMethod } from '../utils/mixins'

const dummyRestaurant = {
  restaurant: {
    name: '餐廳一號',
    Category: {
      id: 1,
      name: '美式餐廳'
    },
    opening_hour: '11:00:00',
    closing_hour: '14:00:00',
    location: '信義區',
    address: '台北市大安區延吉街50號',
    tel: '02-2222-2222',
    description: '火鍋店',
    image: 'https://via.placeholder.com/200x200/d3d3d3'
  },
  categories: [
    {
      id: 1,
      name: '美式餐廳'
    },
    {
      id: 2,
      name: '法式餐廳'
    },
    {
      id: 3,
      name: '義式餐廳'
    }
  ]
}

export default {
  mixins: [getGeoMethods, handleFileChangeMethod],
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
      categories: [],
      hasRestaurantData: false,
      warningMessage: '',
      apiKey: process.env.VUE_APP_GOOGLE,
      validationMsg: {
        address: '請輸入地址'
      }
    }
  },
  created () {
    this.fetchRestaurantData()
  },
  methods: {
    fetchRestaurantData () {
      // fetch data from api based on route name
      console.log(this.$route.name)

      // check if restaurant data alreadt exists
      if (!dummyRestaurant) {
        this.hasRestaurantData = false
        return
      }

      // retrieve data
      const {
        restaurant: { opening_hour: openingHour, closing_hour: closingHour, ...restData },
        categories
      } = dummyRestaurant

      // save data
      this.restaurant = {
        ...this.restaurant,
        openingHour,
        closingHour,
        ...restData
      }
      this.categories = categories
      this.hasRestaurantData = true
    },
    afterReceiveGeo () {
      console.log(this.restaurant.lat, this.restaurant.lng)
      this.hasRestaurantData ? this.updateRestaurant() : this.createRestaurant()
    },
    createRestaurant () {
      // Send data to POST /api/owner
      console.log('POST', this.restaurant)
    },
    updateRestaurant () {
      // Send data to PUT /api/owner
      console.log('PUT', this.restaurant)
    },
    deleteRestaurant () {
      // Send data to DELETE /api/admin/restaurants/:id
      console.log('DELETE', this.restaurant)
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
