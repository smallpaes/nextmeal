<template>
  <form
    class="form-content needs-validation rounded"
    novalidate
    @submit.prevent.stop="handleSubmit"
  >
    <div class="form-content-top rounded-top">
      <div class="form-content-top-header mb-4">
        <h3>
          註冊
        </h3>
        <h5>
          註冊您的專屬 NextMeal 帳號
        </h5>
      </div>
      <!--Name-->
      <div
        class="form-group"
        :class="{invalid: $v.name.$error}"
      >
        <input
          id="name"
          v-model="name"
          type="name"
          class="form-control"
          placeholder="名稱"
          minlength="1"
          maxlength="6"
          autofocus
          required
          @blur="$v.name.$touch()"
        >
        <small
          v-if="$v.name.$error"
          class="form-text"
        >名稱長度介於 1-6 位</small>
      </div>
      <!--Email-->
      <div
        class="form-group"
        :class="{invalid: $v.email.$error}"
      >
        <input
          id="email"
          v-model="email"
          type="email"
          class="form-control"
          placeholder="電子信箱"
          autofocus
          required
          @blur="$v.email.$touch()"
        >
        <small
          v-if="!$v.email.email && $v.email.$dirty"
          class="form-text"
        >請輸入格式正確的電子信箱</small>
        <small
          v-if="!$v.email.required && $v.email.$dirty"
          class="form-text"
        >電子信箱必填</small>
        <!-- <p>{{ $v }}</p> -->
      </div>
      <!--Password-->
      <div
        class="form-group"
        :class="{invalid: $v.password.$error}"
      >
        <input
          id="password"
          v-model="password"
          type="password"
          class="form-control"
          placeholder="密碼"
          minlength="8"
          maxlength="12"
          required
          @blur="$v.password.$touch()"
        >
        <small
          v-if="$v.password.$error"
          class="form-text"
        >密碼 8-12 位，需包大小寫字母與至少一個符號</small>
      </div>
      <!--Password Check-->
      <div
        class="form-group"
        :class="{invalid: $v.passwordCheck.$error}"
      >
        <input
          id="passwordCheck"
          v-model="passwordCheck"
          type="password"
          class="form-control"
          placeholder="再次輸入密碼"
          minlength="8"
          maxlength="12"
          required
          @blur="$v.passwordCheck.$touch()"
        >
        <small
          v-if="$v.passwordCheck.$error"
          class="form-text"
        >輸入的兩組密碼須相同</small>
      </div>
      <div class="btn-container text-center">
        <button
          type="submit"
          class="btn mt-1"
          :disabled="isProcessing || $v.$invalid"
        >
          註冊
        </button>
      </div>
    </div>
    <div class="form-content-bottom rounded-bottom d-flex">
      <p class="text-left m-0 mr-3">
        已經是 NextMeal 會員？
      </p>
      <router-link :to="{name: 'login'}">
        登入
      </router-link>
    </div>
  </form>
</template>

<script>
import authorizationAPI from '../apis/authorization'
import { Toast } from '../utils/helpers'
import { required, email, minLength, maxLength, sameAs } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      name: '',
      email: '',
      password: '',
      passwordCheck: '',
      validationMsg: {
        passwordCheck: '請輸入 8-12 位密碼'
      },
      isProcessing: false
    }
  },
  validations: {
    name: {
      required,
      minLength: minLength(1),
      maxLength: maxLength(6)
    },
    email: {
      required,
      email,
      unique: async val => {
        if (val === '') return true
        try {
          const response = await authorizationAPI.emailcheck({ email: val })
          console.log(response)
          return true
          // if (data.status !== 'success' || statusText !== 'OK') throw new Error(statusText)
          // return data.isAvailable
        } catch (error) {
          console.log(error)
          // return false
        }
      }
    },
    password: {
      required,
      passwordFormat: value => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value)
    },
    passwordCheck: {
      sameAs: sameAs('password')
    }
  },
  methods: {
    async handleSubmit (e) {
      // Validate form
      const passwordCheckInput = document.getElementById('passwordCheck')

      if (this.password !== this.passwordCheck) {
        passwordCheckInput.setCustomValidity('invalid')
        this.validationMsg.passwordCheck = '兩組輸入密碼不相同'
      } else {
        passwordCheckInput.setCustomValidity('')
        this.validationMsg.passwordcheck = '請輸入 8-12 位密碼'
      }

      if (e.target.checkValidity() === false) {
        return e.target.classList.add('was-validated')
      }

      try {
        // update processing status
        this.isProcessing = true

        // Send api to  check if email already existed
        const { data, statusText } = await authorizationAPI.emailcheck({ email: this.email })

        // error handling
        if (statusText !== 'OK' || data.status !== 'success') {
          throw new Error(data.message)
        }

        // Send data to parents
        this.$emit('after-signup', {
          name: this.name,
          email: this.email,
          password: this.password,
          passwordCheck: this.passwordCheck
        })

        // update processing status
        this.isProcessing = false
      } catch (error) {
        // update processing status
        this.isProcessing = false

        // fire error messages
        Toast.fire({
          type: 'error',
          title: '此帳號已註冊過'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
    @include solidButton(200, 1);
}

.form {

    &-group {
      &.invalid {

        input {
          border: 1px solid color(primary);
          background-color: lighten(color(primary), 36%);
        }

        small {
          color: color(primary);
        }

      }
    }
}
</style>
