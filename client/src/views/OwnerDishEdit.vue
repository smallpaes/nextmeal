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
        <OwnerDishForm
          :initial-dish="dish"
          @after-submit="handleAfterSubmit"
        >
          <template v-slot:header>
            <span>編輯</span>
          </template>
          <template v-slot:submitBtn>
            <span>更新</span>
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

const dummyDish = {
  dish:
    {
      id: 1,
      name: '菜餚一',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu',
      image: 'https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_1280.jpg',
      quantity: 50,
      isServing: false,
      nextServing: false
    }
}

export default {
  components: {
    SideNavBar,
    NavPill,
    OwnerDishForm
  },
  data () {
    return {
      dish: {
        name: '',
        description: '',
        image: ''
      }
    }
  },
  created () {
    const { dish_id: dishId } = this.$route.params
    this.fetchDishData(dishId)
  },
  beforeRouteUpdate (to, from, next) {
    const { dish_id: dishId } = to.params
    this.fetchDishData(dishId)
    next()
  },
  methods: {
    fetchDishData (dishId) {
      // fetch meal data from API
      this.dish.name = dummyDish.dish.name
      this.dish.description = dummyDish.dish.description
      this.dish.image = dummyDish.dish.image
    },
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
