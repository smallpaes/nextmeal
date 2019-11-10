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
        <tr
          v-for="restaurant in restaurants"
          :key="restaurant.id"
          @click="$router.push({name:'admin-restaurant-edit', params: {restaurant_id: restaurant.id}})"
        >
          <td>{{ restaurant.name | textTruncate(10) }}</td>
          <td>{{ restaurant.location }}</td>
          <td>
            <span
              class="d-none d-md-inline pr-1"
              :class="{'high-rating': restaurant.rating >= 4, 'low-rating': restaurant.rating < 4}"
            >&#9733;</span>
            <span
              class="rating"
              :class="{'high-rating': restaurant.rating >= 4, 'low-rating': restaurant.rating < 4}"
            >{{ restaurant.rating }}</span>
          </td>
          <td class="comment">
            <i class="far fa-comment-alt mr-1 d-none d-md-inline" />
            {{ restaurant.Comments.length }}
          </td>
          <td>
            <i class="far fa-chart-bar mr-1 d-none d-md-inline" />
            {{ restaurant.orderCount }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { textTruncateFilter } from '../utils/mixins'

export default {
  mixins: [textTruncateFilter],
  props: {
    restaurants: {
      type: Array,
      required: true
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

.high-rating {
    color: color(tertiary);
}

.low-rating {
    color: color(primary);
}
</style>
