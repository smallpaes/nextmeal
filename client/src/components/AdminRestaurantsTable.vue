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
          <td>{{ restaurant.name }}</td>
          <td>{{ restaurant.location }}</td>
          <td>
            <span class="d-none d-md-inline">&#9733;</span>
            {{ restaurant.rating }}
          </td>
          <td class="comment">
            <i class="fas fa-comment-alt mr-1 d-none d-md-inline" />
            {{ restaurant.Comments.length }}
          </td>
          <td>
            <i class="fas fa-clipboard-list mr-1 d-none d-md-inline" />
            {{ restaurant.orderCount }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
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
    2: '類別',
    3: '評分',
    4: '評論',
    5: '成交量'
);

// table layout for small screen
@include tableMobile;
// table layout for large screen
@include tableFullSize;
</style>
