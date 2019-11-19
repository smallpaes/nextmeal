<template>
  <section class="signup">
    <TopLogoNavbar />
    <transition
      name="slide"
      appear
      mode="out-in"
    >
      <SignupForm
        v-if="isSigningUp"
        key="signup"
        @after-signup="handleAfterSignup"
      />
      <SettingForm
        v-else
        key="setting"
        :categories="categories"
        :initial-processing="isProcessing"
        @after-setting="handleAfterSetting"
      />
    </transition>
  </section>
</template>

<script>
import TopLogoNavbar from '../components/Navbar/TopLogoNavbar'
import SignupForm from '../components/SignupForm'
import SettingForm from '../components/SettingForm'
import authorizationAPI from '../apis/authorization'
import { Toast } from '../utils/helpers'

export default {
  components: {
    TopLogoNavbar,
    SignupForm,
    SettingForm
  },
  data () {
    return {
      signupData: null,
      isSigningUp: true,
      categories: [],
      isProcessing: false
    }
  },
  created () {
    this.fetchCategories()
  },
  methods: {
    async fetchCategories () {
      // update processing status
      this.isProcessing = true
      try {
        // get setting form data
        const { data, statusText } = await authorizationAPI.getSignup()
        // error handling
        if (statusText !== 'OK') throw new Error(data.message)
        // fetch data from API
        this.categories = data.category.map((item, index) => ({ id: index + 1, name: item }))
        // update processing status
        this.isProcessing = false
      } catch (error) {
        // update processing status
        this.isProcessing = false

        // clear up password field
        this.password = ''

        // fire error messages
        Toast.fire({
          type: 'warning',
          title: '系統錯誤，請稍後再試'
        })
      }
    },
    handleAfterSignup (formData) {
      this.signupData = formData
      this.isSigningUp = false
    },
    async handleAfterSetting (formData) {
      const userData = { ...this.signupData, ...formData }
      try {
        // update processing status
        this.isProcessing = true

        // send sign up form to API
        const { data, statusText } = await authorizationAPI.postSignup(userData)
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

        // redirect to subscribe page
        this.$router.push({ name: 'subscribe' })
      } catch (error) {
        // update processing status
        this.isProcessing = false

        // fire error messages
        Toast.fire({
          type: 'error',
          title: error.message
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@include slideAnimation;

.signup {
    @include setBackground('https://cdn.pixabay.com/photo/2019/03/29/09/26/food-4088832_1280.jpg', 100%);
    max-height: 100vh;
    padding: 120px 15px 30px 15px;
    overflow-y: scroll;
}

/deep/ .form {
  @include formControl;

  &-content {
    max-width: 450px;
    margin: 0 auto;
    margin-top: 70px;
    background-color: color(quaternary);

    &-top {
      padding: 2.7rem;
      background-color: color(quaternary);

      &-header {
        text-align: center;

        h3 { font-size: size(lg); }
        h5 { font-size: size(sm); }
      }
    }

    &-bottom {
      padding: .8rem 2.7rem;
      font-size: size(xs);
      color:lighten(color(secondary), 10%);
      background-color: color(quinary);

      a { @include linkStyling(color(tertiary)); }
    }
  }

  &-text {
    font-size: size(xs);
    color:lighten(color(secondary), 10%);
  }
}
</style>
