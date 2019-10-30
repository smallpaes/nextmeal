<template>
  <section class="wrapper d-flex vh-100">
    <SideNavBar />
    <section class="dishes flex-fill">
      <router-link
        :to="{name: 'owner-dish-new'}"
        class="new-dish"
      >
        <i class="fas fa-plus" />
        <span class="ml-1 d-none d-md-inline">新增菜單</span>
      </router-link>
      <h1 class="dishes-title">
        餐點資訊
      </h1>
      <OwnerDishNavPill class="mt-4 ml-1" />
      <hr class="dishes-divider">
      <div class="dishes-card-container row px-3 pb-4">
        <OwnerDishCard
          v-for="meal in meals"
          :key="meal.id"
          :meal="meal"
          class="col-12 p-0"
        />
      </div>
    </section>
  </section>
</template>

<script>
import SideNavBar from '../components/Navbar/SideNavBar'
import OwnerDishNavPill from '../components/Navbar/OwnerDishNavPill'
import OwnerDishCard from '../components/OwnerDishCard'

const dummyMeals = {
  meals: [
    {
      id: 1,
      name: '菜餚一',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu',
      image: 'https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_1280.jpg',
      quantity: 50,
      isServing: false,
      nextServing: false
    },
    {
      id: 2,
      name: '菜餚二',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu',
      image: 'https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_1280.jpg',
      quantity: 50,
      isServing: false,
      nextServing: false
    },
    {
      id: 3,
      name: '菜餚三',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu',
      image: 'https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_1280.jpg',
      quantity: 50,
      isServing: false,
      nextServing: false
    },
    {
      id: 4,
      name: '菜餚四',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu',
      image: 'https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_1280.jpg',
      quantity: 50,
      isServing: false,
      nextServing: false
    },
    {
      id: 5,
      name: '菜餚五',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu',
      image: 'https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_1280.jpg',
      quantity: 50,
      isServing: false,
      nextServing: false
    },
    {
      id: 6,
      name: '菜餚六',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu',
      image: 'https://cdn.pixabay.com/photo/2014/11/05/15/57/salmon-518032_1280.jpg',
      quantity: 50,
      isServing: false,
      nextServing: false
    }
  ]
}

export default {
  components: {
    SideNavBar,
    OwnerDishNavPill,
    OwnerDishCard
  },
  data () {
    return {
      meals: []
    }
  },
  created () {
    this.fetchMeals()
  },
  methods: {
    fetchMeals () {
      this.meals = [
        ...this.meals,
        ...dummyMeals.meals
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
    @include hideScrollBar;
    background-color: color(quinary);
}

.dishes {
    position: relative;
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

    // set max-heigt for tablet
    // &-card-container {
    //     max-height: 560px;
    //     overflow-y: scroll;
    // }

    .new-dish {
        @include linkStyling(color(primary));
        position: absolute;
        right: 40px;
        top: 112px;
        font-size: size(xs);
    }

    @include response(md) {
        margin-left: 145px;
    }
}
</style>
