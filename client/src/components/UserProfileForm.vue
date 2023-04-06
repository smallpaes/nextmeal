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
      <div
        class="form-group col-md-6"
        :class="{invalid: $v.user.name.$error}"
      >
        <label for="name">名稱</label>
        <input
          id="name"
          v-model.trim="user.name"
          type="text"
          class="form-control"
          name="name"
          required
          @blur="$v.user.name.$touch()"
        >
        <small
          v-if="$v.user.name.$error"
          class="form-text"
        >名稱長度介於 1-6 位</small>
      </div>
      <!--Email-->
      <div
        class="form-group col-md-6"
        :class="{invalid: $v.user.email.$error && !$v.user.email.$pending}"
      >
        <label for="email">電子信箱</label>
        <input
          id="email"
          v-model.trim="user.email"
          type="email"
          class="form-control"
          name="email"
          required
          @blur="$v.user.email.$touch()"
        >
        <small
          v-if="!$v.user.email.email && $v.user.email.$dirty"
          class="form-text"
        >請輸入格式正確的電子信箱</small>
        <small
          v-if="!$v.user.email.required && $v.user.email.$dirty"
          class="form-text"
        >電子信箱必填</small>
        <small
          v-if="$v.user.email.$dirty && !$v.user.email.unique && !$v.user.email.$pending"
          class="form-text"
        >電子信箱已被註冊過</small>
      </div>
    </div>
    <div class="form-row">
      <!--Category-->
      <CustomSelect
        v-model="user.prefer"
        class="col-md-6"
        :options="categories"
        :v="$v.user.prefer"
        :target="'name'"
      >
        <template v-slot:label>
          喜好餐廳
        </template>
        <template v-slot:option>
          餐廳類別
        </template>
        <template v-slot:invalid>
          請選擇一種偏好餐廳類別
        </template>
      </CustomSelect>
      <!--Date of birth-->
      <CustomDatePicker
        v-model="user.dob"
        :v="$v.user.dob"
        name="dob"
        class="px-1 col-md-6 p-0"
        :placeholder="'選擇出生年月日'"
      />
    </div>
    <div class="form-row">
      <!--Address-->
      <div
        class="form-group form-address-group col-12 col-md"
        :class="{invalid: $v.user.address.$error}"
      >
        <label for="address">
          所在地址
          <Tooltip
            :width="'175px'"
            :top="'-5px'"
            :left="'160%'"
          >
            <template #icon>
              <i class="far fa-question-circle" />
            </template>
            <template #message>
              依此地址推薦餐廳給您
            </template>
          </Tooltip>
        </label>
        <input
          id="address"
          v-model.trim="user.address"
          type="text"
          class="form-control"
          placeholder="台北市大安區..."
          name="address"
          required
          @blur="$v.user.address.$touch()"
        >
        <small
          v-if="$v.user.address.$error"
          class="form-text"
        >地址必填</small>
        <small
          v-if="validationMsg.address"
          class="form-text"
        >{{ validationMsg.address }}</small>
      </div>
      <!--Role-->
      <CustomSelect
        v-if="$route.name === 'admin-user-edit'"
        v-model="user.role"
        class="col-12 col-md"
        :options="roles"
        :v="$v.user.role"
        :target="'name'"
      >
        <template v-slot:label>
          用戶權限
        </template>
        <template v-slot:option>
          選擇權限
        </template>
        <template v-slot:invalid>
          請選擇一種權限
        </template>
      </CustomSelect>
    </div>
    <!--Image upload-->
    <p class="mb-2">
      上傳大頭照
    </p>
    <div
      class="form-group"
      :class="{invalid: !$v.user.image.hasImage}"
    >
      <small
        v-if="!$v.user.image.hasImage"
        class="form-text mb-2"
      >請上傳一張照片&#8595;</small>
      <!--Invisible file upload button-->
      <input
        id="file"
        type="file"
        class="file-input"
        name="avatar"
        accept=".png, .jpg, .jpeg"
        @change="handleFileChange($event, 'user')"
        @input="$v.user.image.$touch()"
      >
      <!--Preview image-->
      <div
        v-if="user.image"
        class="file-image-wrapper"
        @click="user.image = ''"
      >
        <ik-image
          :path="user.image"
          :lqip="{ active: true }"
          loading="lazy"
          :alt="user.name + '的大頭貼'"
          class="file-image"
        />
        <i class="fa-regular fa-rectangle-xmark" />
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
      <ProcessButton
        class="btn"
        type="submit"
        :is-processing="isProcessing"
        :v="$v"
        :color="$route.name === 'admin-user-edit' ? 'tertiary' : 'primary'"
        @after-click="getLocation('user')"
      >
        <template #initial>
          更新
        </template>
      </ProcessButton>
      <ProcessButton
        v-if="$route.name ==='admin-user-edit'"
        class="btn"
        :is-processing="isProcessing"
        :v="$v"
        @after-click="$emit('after-delete')"
      >
        <template #initial>
          刪除
        </template>
      </ProcessButton>
    </div>
  </form>
</template>

<script>
import CustomDatePicker from '../components/CustomDatePicker'
import CustomSelect from '../components/CustomSelect'
import authorizationAPI from '../apis/authorization'
import Tooltip from '../components/Button/Tooltip'
import ProcessButton from '../components/Button/ProcessButton'
import { getGeoMethods, handleFileChangeMethod, dateTransformFilter } from '../utils/mixins'
import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  components: {
    CustomDatePicker,
    CustomSelect,
    Tooltip,
    ProcessButton
  },
  mixins: [getGeoMethods, handleFileChangeMethod, dateTransformFilter],
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
        location: '',
        address: ''
      },
      warningMessage: '',
      apiKey: process.env.VUE_APP_GOOGLE,
      validationMsg: {
        address: ''
      },
      isProcessing: false
    }
  },
  validations: {
    user: {
      address: {
        required
      },
      prefer: {
        required
      },
      dob: {
        required
      },
      name: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(6)
      },
      email: {
        required,
        email,
        unique: async function (val) {
          // Pass this validation if it's empty, the original email, or the format is wrong
          if (val === '' || val === this.initialUser.email || !this.$v.user.email.email) return true
          try {
            // validate if it's an unique email
            const { data, statusText } = await authorizationAPI.emailcheck({ email: val })
            if (data.status !== 'success' || statusText !== 'OK') throw new Error(statusText)
            return data.isAvailable
          } catch (error) {
            return false
          }
        }
      },
      image: {
        hasImage: value => {
          if (!value) return false
          return true
        }
      },
      role: {
        required
      }
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
  @include inputValidation;
  color: color(secondary);
  background-color: color(quaternary);
}

.btn-container { @include flexPosition(center, center, row); }

.alert {
  color: color(quaternary);
  background-color: color(tertiary);
}

</style>
