<template>
  <div class="table-wrapper table-borderless table-hover rounded-sm ">
    <table class="table m-0">
      <thead>
        <tr>
          <th scope="col">
            名稱
          </th>
          <th scope="col">
            地區
          </th>
          <th scope="col">
            評分
          </th>
          <th scope="col">
            評論
          </th>
          <th scope="col">
            成交量
          </th>
        </tr>
      </thead>
      <tbody>
        <!--Display data-->
        <tr
          v-for="restaurant in restaurantData"
          :key="restaurant.id"
          @click="isLoading ? null : $router.push({name:'admin-restaurant-edit', params: {restaurant_id: restaurant.id}})"
        >
          <td>
            <SkelentonBox
              v-if="isLoading"
              :width="'160px'"
            />
            <template v-else>
              {{ restaurant.name | textTruncate(10) }}
            </template>
          </td>
          <td>
            <SkelentonBox
              v-if="isLoading"
              :width="'50px'"
            />
            <template v-else>
              {{ restaurant.location }}
            </template>
          </td>
          <td>
            <SkelentonBox
              v-if="isLoading"
              :width="'43px'"
            />
            <template v-else>
              <span
                class="d-none d-md-inline pr-1"
                :class="{'high-rating': restaurant.rating >= 4, 'low-rating': restaurant.rating < 4}"
              >&#9733;</span>
              <span
                class="rating"
                :class="{'high-rating': restaurant.rating >= 4, 'low-rating': restaurant.rating < 4}"
              >{{ restaurant.rating | padEnd }}</span>
            </template>
          </td>
          <td class="comment">
            <SkelentonBox
              v-if="isLoading"
              :width="'30px'"
            />
            <template v-else>
              <i class="far fa-comment-alt mr-1 d-none d-md-inline" />
              {{ restaurant.Comments.length }}
            </template>
          </td>
          <td>
            <SkelentonBox
              v-if="isLoading"
              :width="'30px'"
            />
            <template v-else>
              <i class="far fa-chart-bar mr-1 d-none d-md-inline" />
              {{ restaurant.orderCount }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { padEndFilter, textTruncateFilter } from '../utils/mixins'
import SkelentonBox from './Placeholder/SkeletonBox'

export default {
  components: {
    SkelentonBox
  },
  mixins: [padEndFilter, textTruncateFilter],
  props: {
    restaurants: {
      type: Array,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    restaurantData () {
      if (this.isLoading) return 10
      return this.restaurants
    }
  }
}
</script>

<style lang="scss" scoped>
$headers: (
  1: '名稱',
  2: '地區',
  3: '評分',
  4: '評論',
  5: '成交量'
);

// table layout for small screen
@include tableMobile;
// table layout for large screen
@include tableFullSize;

.high-rating { color: color(tertiary); }
.low-rating { color: color(primary); }
</style>
