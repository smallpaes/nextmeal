<template>
  <section class="login">
    <TopLogoNavbar />
    <form
      class="form-content needs-validation rounded"
      novalidate
      @submit.prevent.stop="handleSubmit"
    >
      <div class="form-content-top rounded-top">
        <div class="form-content-top-header mb-4">
          <h3>
            登入
          </h3>
          <h5>
            透過您的 NextMeal 帳號登入
          </h5>
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
        <div class="btn-container text-center">
          <button
            type="submit"
            class="btn mt-1"
            :disabled="isProcessing"
          >
            登入
          </button>
        </div>
      </div>
      <div class="form-content-bottom rounded-bottom d-flex">
        <p class="text-left m-0 mr-3">
          現在就前往體驗 NextMeal
        </p>
        <router-link :to="{name: 'signup'}">
          註冊
        </router-link>
      </div>
    </form>
  </section>
</template>

<script>
import TopLogoNavbar from '../components/Navbar/TopLogoNavbar'
import authorizationAPI from '../apis/authorization'
import { Toast } from '../utils/helpers'
import { mapGetters } from 'vuex'

export default {
  components: {
    TopLogoNavbar
  },
  data () {
    return {
      email: '',
      password: '',
      isProcessing: false
    }
  },
  computed: {
    ...mapGetters(['controlPanelRouteName'])
  },
  methods: {
    async handleSubmit (e) {
      // Validate form
      const isValid = this.email && this.password.length >= 8 && this.password.length <= 12
      if (e.target.checkValidity() === false || !isValid) {
        e.target.classList.add('was-validated')
        return
      }

      try {
        // update processing status
        this.isProcessing = true

        // send log in form to API
        const { data, statusText } = await authorizationAPI.logIn({
          email: this.email,
          password: this.password
        })

        // error handling
        if (statusText !== 'OK' || data.status !== 'success') {
          throw new Error(data.message)
        }

        // store jwt in localstorage
        localStorage.setItem('token', data.token)

        // prepare user data to be stored in Vuex
        const { sub_status: subscriptionStatus, sub_balance: subscriptionBalance, ...restData } = data.user
        const storedUserData = { subscriptionBalance, subscriptionStatus, ...restData }

        // save data to Vuex
        this.$store.commit('setCurrentUser', storedUserData)
        // redirect user baed on subscription status
        if (data.user.role === 'User' && !data.user.sub_status) return this.$router.push({ name: 'subscribe' })
        // redirect to respected page for each role
        this.$router.push({ name: this.controlPanelRouteName })
      } catch (error) {
        // update processing status
        this.isProcessing = false

        // clear up password field
        this.password = ''

        // fire error messages
        Toast.fire({
          type: 'error',
          title: '帳號或密碼有誤'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
    @include setBackground('https://cdn.pixabay.com/photo/2019/03/29/09/26/food-4088832_1280.jpg', 100%);
    overflow-y: scroll;
    max-height: 100vh;
    padding: 120px 15px 30px 15px;
}

.form {
    @include formControl;

    &-content {
        max-width: 450px;
        background-color: color(quaternary);
        margin-top: 70px;
        margin: 0 auto;
        overflow-y: hidden;

        &-top {
            background-color: color(quaternary);
            padding: 2.7rem;

            &-header {
                text-align: center;

                h3 {
                    font-size: size(lg);
                }

                h5 {
                    font-size: size(sm);
                }
            }
        }

        &-bottom {
            background-color: color(quinary);
            padding: .8rem 2.7rem;
            font-size: size(xs);
            color:lighten(color(secondary), 10%);

            a {
                color: color(tertiary);
                transition: color .2s linear;

                &:hover {
                    color: darken(color(tertiary), 5%);
                }
            }
        }
    }

    &-control {
        @include formValidation;
    }
}

.invalid-feedback {
    text-align: left;
}

.btn {
    @include solidButton(200, 1);
}
</style>
