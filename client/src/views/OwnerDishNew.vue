<template>
  <section class="wrapper d-flex h-100">
    <OwnerSideNavBar :nav-is-open="navIsOpen" />
    <section class="dish flex-fill">
      <!--Navbar toggler-->
      <NavbarToggler
        :nav-is-open="navIsOpen"
        @toggle-navbar="navIsOpen = !navIsOpen"
      />
      <h1 class="dish-title">
        餐點資訊
      </h1>
      <OwnerDishNavPill class="mt-4 ml-1" />
      <hr class="dish-divider">
      <div class="dish-form-container pb-4">
        <OwnerDishForm
          :initial-processing="isProcessing"
          @after-submit="handleAfterSubmit"
        >
          <template v-slot:header>
            <span>增添</span>
          </template>
          <template v-slot:submitBtn>
            <span>新增</span>
          </template>
        </OwnerDishForm>
      </div>
    </section>
  </section>
</template>

<script>
import OwnerSideNavBar from '../components/Navbar/OwnerSideNavBar'
import NavbarToggler from '../components/Navbar/NavbarToggler'
import OwnerDishNavPill from '../components/Navbar/OwnerDishNavPill'
import OwnerDishForm from '../components/OwnerDishForm'
import ownerAPI from '../apis/owner'
import { Toast } from '../utils/helpers'

export default {
  components: {
    OwnerSideNavBar,
    NavbarToggler,
    OwnerDishNavPill,
    OwnerDishForm
  },
  data () {
    return {
      isProcessing: false,
      navIsOpen: false
    }
  },
  methods: {
    async handleAfterSubmit (formData) {
      // update processing status
      this.isProcessing = true

      try {
        // create a new dish
        const { data, statusText } = await ownerAPI.dishes.postNew(formData)
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // redirect to dishes page
        this.$router.push({ name: 'owner-dishes' })
      } catch (error) {
        // update loading status
        this.isProcessing = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法建立餐點，請稍後再試'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
    @include hideScrollBar;
    background-color: color(quinary);
}

.dish {
    @include controlPanelLayout;

    &-divider {
        margin-top: 0;
    }
}
</style>
