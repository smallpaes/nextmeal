<template>
  <form
    ref="form"
    class="form p-3 rounded shadow-sm needs-validation"
    novalidate
  >
    <h3
      v-if="$route.name === 'user-profile'"
      class="form-header mb-4"
    >
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
          name="name"
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
          name="email"
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
        :options="categories"
        :name="'prefer'"
      >
        <template v-slot:label>
          喜好餐廳
        </template>
        <template v-slot:option>
          餐廳類別
        </template>
        <template v-slot:invalid>
          請選擇類別
        </template>
      </CustomSelectInput>
      <!--Date of birth-->
      <CustomDatePicker
        v-model="user"
        name="dob"
        class="px-1 col-md-6 p-0"
      />
    </div>
    <div class="form-row">
      <!--Address-->
      <div class="form-group col-12 col-md">
        <label for="address">地址</label>
        <input
          id="address"
          v-model.trim="user.address"
          type="text"
          class="form-control"
          placeholder="台北市大安區..."
          name="address"
          required
        >
        <div class="invalid-feedback">
          {{ validationMsg.address }}
        </div>
      </div>
      <!--Role-->
      <CustomSelectInput
        v-if="roles.length > 0"
        v-model="user"
        class="col-12 col-md"
        :options="roles"
        :name="'role'"
      >
        <template v-slot:label>
          用戶權限
        </template>
        <template v-slot:option>
          選擇權限
        </template>
        <template v-slot:invalid>
          請選擇權限
        </template>
      </CustomSelectInput>
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
        name="avatar"
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
        :disabled="isProcessing"
        @click.stop.prevent="getLocation('user')"
      >
        更新
      </button>
      <button
        v-if="$route.name ==='admin-user-edit'"
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
import CustomDatePicker from '../components/CustomDatePicker'
import CustomSelectInput from '../components/CustomSelectInput'
import { getGeoMethods, handleFileChangeMethod, dateTransformFilter, dateFormatterFilter } from '../utils/mixins'

export default {
  components: {
    CustomDatePicker,
    CustomSelectInput
  },
  mixins: [getGeoMethods, handleFileChangeMethod, dateTransformFilter, dateFormatterFilter],
  props: {
    initialUser: {
      type: Object,
      required: true
    },
    categories: {
      type: Array,
      required: true
    },
    roles: {
      type: Array,
      default: () => []
    },
    initialProcessing: {
      type: Boolean,
      default: false
    }
  },
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
      warningMessage: '',
      apiKey: process.env.VUE_APP_GOOGLE,
      validationMsg: {
        address: '請輸入地址'
      },
      isProcessing: false
    }
  },
  watch: {
    initialUser (user) {
      this.user = {
        ...this.user,
        ...user
      }
    },
    categories (categories) {
      this.categories = categories
    },
    roles (roles) {
      this.roles = roles
    },
    initialProcessing (isProcessing) {
      this.isProcessing = isProcessing
    }
  },
  created () {
    this.user = {
      ...this.user,
      ...this.initialUser
    }
  },
  methods: {
    async afterReceiveGeo () {
      // prepare formData
      const form = this.$refs.form
      const formData = new FormData(form)
      const storedUserData = { name: this.user.name, avatar: this.user.image }
      // set extra data to formData
      const formKeys = ['dob', 'prefer', 'lat', 'lng', 'location', 'role']
      formKeys.forEach(key => formData.set(key, this.user[key]))
      // pass data to parent
      this.$emit('after-submit', { formData, storedUserData })
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
