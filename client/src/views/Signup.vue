<template>
  <section class="signup">
    <TopLogoNavbar />
    <SignupForm
      v-if="isSigningUp"
      @after-signup="handleAfterSignup"
    />
    <SettingForm
      v-else
      :categories="categories"
      :initial-processing="isProcessing"
      @after-setting="handleAfterSetting"
    />
  </section>
</template>

<script>
import TopLogoNavbar from '../components/Navbar/TopLogoNavbar'
import SignupForm from '../components/SignupForm'
import SettingForm from '../components/SettingForm'
import authorizationAPI from '../apis/authorization'
import { Toast } from '../utils/helpers'

const dummyCategories = {
  category: ['美式餐廳', '法式餐廳', '義式餐廳']
}

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
    fetchCategories () {
      // fetch data from API
      this.categories = dummyCategories.category
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
        const { data, statusText } = await authorizationAPI.signup(userData)

        // error handling
        if (statusText !== 'OK' || data.status !== 'success') {
          throw new Error(data.message)
        }

        // store jwt in localstorage
        localStorage.setItem('token', data.token)

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
.signup {
    @include setBackground('https://cdn.pixabay.com/photo/2019/03/29/09/26/food-4088832_1280.jpg', 100%);
    overflow-y: scroll;
    max-height: 100vh;
    padding: 120px 15px 30px 15px;
}

/deep/ .form {
    @include formControl;

    &-content {
        max-width: 450px;
        background-color: color(quaternary);
        margin-top: 70px;
        margin: 0 auto;

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
                @include linkStyling(color(tertiary));
            }
        }
    }

    &-text {
        font-size: size(xs);
        color:lighten(color(secondary), 10%);
    }

    &-control {
        @include formValidation;
    }
}

/deep/ .invalid-feedback {
    text-align: left;
}
</style>
