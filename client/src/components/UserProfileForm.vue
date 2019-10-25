<template>
  <form
    class="form p-3 rounded shadow-sm needs-validation"
    novalidate
  >
    <h3 class="form-header mb-4">
      帳號設定
    </h3>
    <!--Show alert section-->
    <div
      v-if="warningMessage"
      class="alert mb-0 "
      role="alert"
    >
      {{ warningMessage }}
    </div>
    <div class="form-row">
      <!--Name-->
      <div class="form-group col-md-6">
        <label for="name">名稱</label>
        <input
          id="name"
          v-model.trim="user.name"
          type="text"
          class="form-control"
          required
        >
        <div class="invalid-feedback">
          請輸入名稱
        </div>
      </div>
      <!--Email-->
      <div class="form-group col-md-6">
        <label for="email">電子信箱</label>
        <input
          id="email"
          v-model.trim="user.email"
          type="email"
          class="form-control"
          required
        >
        <div class="invalid-feedback">
          請輸入電子信箱
        </div>
      </div>
    </div>
    <div class="form-row">
      <!--Category-->
      <CustomSelectInput
        v-model="user"
        class="col-md-6"
        :categories="categories"
      />
      <!--Closing time-->
      <CustomDatePicker v-model="user" />
    </div>
    <!--Address-->
    <div class="form-group">
      <label for="address">地址</label>
      <input
        id="address"
        v-model.trim="user.address"
        type="text"
        class="form-control"
        placeholder="台北市大安區..."
        required
      >
      <div class="invalid-feedback">
        {{ validationMsg.address }}
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
        @change="handleFileChange($event, 'user')"
      >
      <!--Preview image-->
      <div
        v-if="user.image"
        class="file-image-wrapper"
      >
        <img
          :src="user.image"
          class="file-image"
          alt="餐廳照片"
        >
        <span
          class="close-btn"
          aria-hidden="true"
          @click="user.image = ''"
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
        :class="{'btn-update': $route.name === 'admin-user-edit'}"
        type="submit"
        @click.stop.prevent="getLocation('user')"
      >
        更新
      </button>
      <button
        v-if="$route.name ==='admin-user-edit'"
        class="btn"
        @click.stop.prevent="deleteUser"
      >
        刪除
      </button>
    </div>
  </form>
</template>

<script>
import CustomDatePicker from '../components/CustomDatePicker'
import CustomSelectInput from '../components/CustomSelectInput'
import { getGeoMethods, handleFileChangeMethod, dateTransformFilter, dateFormatterFilter } from '../utils/mixins'

const dummyUser = {
  user: {
    name: 'Mike',
    email: 'mike@example',
    role: 'Admin',
    prefer: '義式餐廳',
    dob: '1999-02-30',
    image: 'https://cdn.pixabay.com/photo/2016/11/19/15/20/animal-1839808_1280.jpg',
    address: '台北市大安區延吉街103號',
    location: '大安區',
    lng: 122.2,
    lat: 22.5
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
  components: {
    CustomDatePicker,
    CustomSelectInput
  },
  mixins: [getGeoMethods, handleFileChangeMethod, dateTransformFilter, dateFormatterFilter],
  data () {
    return {
      user: {
        name: '',
        email: '',
        role: '',
        prefer: '',
        dob: '',
        image: '',
        lng: '',
        lat: '',
        location: ''
      },
      categories: [],
      warningMessage: '',
      apiKey: process.env.VUE_APP_GOOGLE,
      validationMsg: {
        address: '請輸入地址'
      }
    }
  },
  created () {
    this.fetchUserData()
  },
  methods: {
    fetchUserData () {
      // fetch data from api based on route name
      console.log(this.$route.name)

      // save data
      this.user = {
        ...this.user,
        ...dummyUser.user
      }
      this.categories = dummyUser.categories
    },
    afterReceiveGeo () {
      console.log(this.user.lat, this.user.lng)
      // Send POST request based on route name
      // PUT api/user/ or api/admin/users/
      console.log(this.$route.path)
    },
    deleteUser () {
      // Send data to DELETE /api/admin/users/:id
      console.log('DELETE', this.user)
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
