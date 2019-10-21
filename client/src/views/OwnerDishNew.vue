<template>
  <section class="wrapper d-flex h-100">
    <SideNavBar />
    <section class="dish flex-fill">
      <h1 class="dish-title">
        餐點資訊
      </h1>
      <NavPill class="mt-4 ml-1" />
      <hr class="dish-divider">
      <div class="dish-form-container pb-4">
        <OwnerDishForm @after-submit="handleAfterSubmit">
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
import SideNavBar from '../components/Navbar/SideNavBar'
import NavPill from '../components/Navbar/NavPill'
import OwnerDishForm from '../components/OwnerDishForm'

export default {
  components: {
    SideNavBar,
    NavPill,
    OwnerDishForm
  },
  data () {
    return {
      meal: {}
    }
  },
  methods: {
    handleAfterSubmit (formData) {
      // Send form data to backend
      console.log(formData)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
    background-color: color(quinary);
}

.dish {
    padding: 2.3rem 2rem;
    max-width: 800px;
    margin-left: 80px;
    transition: margin-left .1s linear;

    &-title {
        size: size(lg);
    }

    &-divider {
        width: 100%;
        margin-top: 0;
    }

    @include response(md) {
        margin-left: 145px;
    }
}
</style>
