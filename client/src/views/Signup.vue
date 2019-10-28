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
      @after-setting="handleAfterSetting"
    />
  </section>
</template>

<script>
import TopLogoNavbar from '../components/Navbar/TopLogoNavbar'
import SignupForm from '../components/SignupForm'
import SettingForm from '../components/SettingForm'

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
      categories: []
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
    handleAfterSetting (formData) {
      const userData = { ...this.signupData, ...formData }
      // Send signup and setting data to backend
      console.log(userData)
      // Redirect to subscribe page
      this.$router.push({ name: 'subscribe' })
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
