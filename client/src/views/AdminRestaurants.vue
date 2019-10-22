<template>
  <section class="wrapper d-flex vh-100">
    <AdminSideNavBar />
    <section class="restaurants flex-fill">
      <h1 class="restaurants-title">
        餐廳管理
      </h1>
      <hr class="restaurants-divider">
      <form
        class="form p-3 rounded shadow-sm"
        novalidate
      >
        <div class="form-row">
          <!--Name-->
          <div class="form-group col-md-6">
            <input
              id="name"
              v-model.trim="name"
              type="text"
              class="form-control"
              placeholder="搜尋餐廳名稱"
              required
            >
            <div class="invalid-feedback">
              請輸入餐廳名稱
            </div>
          </div>
          <!--Location-->
          <div class="form-group col-md-6">
            <select
              v-model.trim="selectedLocation"
              class="form-control"
              required
            >
              <option selected>
                餐廳地區
              </option>
              <option
                v-for="location in locations"
                :key="location"
                :value="location"
              >
                {{ location }}
              </option>
            </select>
            <div class="invalid-feedback">
              請選擇餐廳類別
            </div>
          </div>
        </div>
      </form>
    </section>
  </section>
</template>

<script>
import AdminSideNavBar from '../components/Navbar/AdminSideNavBar'

const dummyRestaurants = {
  restaurants: [
    {
      id: '1',
      name: '餐廳一',
      rating: 4.6,
      commentCount: 0,
      Category: {
        name: '日本料理'
      },
      Comments: [],
      Meals: [],
      orderCount: 2
    },
    {
      id: '2',
      name: '餐廳二',
      rating: 3.4,
      commentCount: 3,
      Category: {
        name: '美式料理'
      },
      Comments: [],
      Meals: [],
      orderCount: 3
    }
  ],
  locations: ['信義區', '大安區', '松山區', '中山區']
}

export default {
  components: {
    AdminSideNavBar
  },
  data () {
    return {
      restaurants: [],
      locations: [],
      name: '',
      selectedLocation: ''
    }
  },
  created () {
    this.fetchRestaurants()
  },
  beforeRouteUpdate () {
    this.fetchRestaurants()
  },
  methods: {
    fetchRestaurants () {
      // fetch data from API
      this.restaurants = dummyRestaurants.restaurants
      this.locations = dummyRestaurants.locations || this.locations
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
    background-color: color(quinary);
}

.restaurants {
    padding: 2.3rem 2rem;
    max-width: 800px;
    margin-left: 80px;
    transition: margin-left .1s linear;

    &-title {
        size: size(lg);
    }

    &-divider {
        width: 100%;
    }

    @include response(md) {
        margin-left: 145px;
    }
}
</style>
