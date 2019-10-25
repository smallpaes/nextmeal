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
      <div class="form-group">
        <input
          id="name"
          v-model="name"
          type="name"
          class="form-control"
          placeholder="名稱"
          autofocus
          required
        >
        <div class="invalid-feedback">
          請輸入名稱
        </div>
      </div>
      <div class="form-group">
        <input
          id="email"
          v-model="email"
          type="email"
          class="form-control"
          placeholder="電子信箱"
          autofocus
          required
        >
        <div class="invalid-feedback">
          請輸入格式正確的電子信箱
        </div>
      </div>
      <div class="form-group">
        <input
          id="password"
          v-model="password"
          type="password"
          class="form-control"
          placeholder="密碼"
          minlength="8"
          maxlength="12"
          required
        >
        <div class="invalid-feedback">
          請輸入 8-12 位密碼
        </div>
      </div>
      <div class="form-group">
        <input
          id="passwordCheck"
          v-model="passwordCheck"
          type="password"
          class="form-control"
          placeholder="再次輸入密碼"
          minlength="8"
          maxlength="12"
          required
        >
        <div class="invalid-feedback">
          {{ validationMsg.passwordCheck }}
        </div>
      </div>
      <div class="btn-container text-center">
        <button
          type="submit"
          class="btn mt-1"
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
export default {
  data () {
    return {
      name: '',
      email: '',
      password: '',
      passwordCheck: '',
      validationMsg: {
        passwordCheck: '請輸入 8-12 位密碼'
      }
    }
  },
  methods: {
    handleSubmit (e) {
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

      // Send api to check if email already existed
      // Send data to parents
      this.$emit('after-signup', {
        name: this.name,
        email: this.email,
        password: this.password,
        passwordCheck: this.passwordCheck
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
    @include solidButton(200, 1);
}
</style>
