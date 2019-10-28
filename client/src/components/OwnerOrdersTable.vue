<template>
  <div class="card">
    <div class="card-header">
      <h4 class="card-title">
        11:00 (6)
      </h4>
      <p class="card-text">
        共需準備 6 份餐點
      </p>
    </div>
    <div class="card-bory">
      <div class="table-wrapper table-borderless table-hover rounded-sm ">
        <table class="table m-0">
          <thead>
            <tr>
              <th scope="col">
                訂單編號
              </th>
              <th scope="col">
                取餐人
              </th>
              <th scope="col">
                餐點數量
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
              <td>{{ restaurant.Category.name }}</td>
              <td>{{ restaurant.Category.name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
    1: '訂單編號',
    2: '取餐人',
    3: '餐點數量'
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
