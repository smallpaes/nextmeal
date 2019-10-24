<template>
  <section class="signup">
    <TopLogoNavbar />
    <div class="form-container">
      <SignupForm
        v-if="isSigningUp"
        @after-signup="handleAfterSignup"
      />
      <SettingForm
        v-else
        :categories="categories"
        @after-setting="handleAfterSetting"
      />
    </div>
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
    }
  }
}
</script>

<style lang="scss" scoped>
.signup {
    height: 100%;
    overflow-y: scroll;
}

/deep/ .form {
    @include formControl;
    @include positionCenter;

    &-container {
        // @include setBackground('https://images.unsplash.com/photo-1497888329096-51c27beff665?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=5551&q=80', 100%);
        @include setBackground('https://cdn.pixabay.com/photo/2019/03/29/09/26/food-4088832_1280.jpg', 100%);
        height: 100%;
        margin-top: 62px;
    }

    &-content {
        width: 100%;
        max-width: 450px;

        &-top {
            background-color: color(quaternary);
            padding: 2.7rem;
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

/deep/ .btn {
    @include solidButton(100%, .1);

    &-outline {
        background-color: color(tertiary);

        &:hover {
            background-color: darken(color(tertiary), 5%);
        }
    }
}
</style>
