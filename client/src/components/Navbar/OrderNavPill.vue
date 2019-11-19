<template>
  <ul class="nav nav-pills">
    <li class="nav-item">
      <router-link
        class="nav-link"
        :class="{active: !$route.query.order_status}"
        :to="{name: 'user-order', query: {order_status: 'today'}}"
      >
        今日<span class="d-none d-md-inline">訂單</span>
      </router-link>
    </li>
    <li class="nav-item">
      <router-link
        class="nav-link"
        :to="{name: 'user-order', query: {order_status: 'tomorrow'}}"
      >
        明日<span class="d-none d-md-inline">訂單</span>
      </router-link>
    </li>
    <li class="nav-item">
      <router-link
        class="nav-link"
        :to="{name: 'user-order', query: {order_status: 'cancel'}}"
      >
        取消<span class="d-none d-md-inline">訂單</span>
      </router-link>
    </li>
    <li class="nav-item">
      <router-link
        class="nav-link"
        :to="{name: 'user-order', query: {order_status: 'history'}}"
      >
        歷史<span class="d-none d-md-inline">訂單</span>
      </router-link>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@include navPillStyling;
</style>
