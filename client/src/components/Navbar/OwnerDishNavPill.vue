<template>
  <ul class="nav nav-pills">
    <li class="nav-item">
      <router-link
        active-class="active"
        class="nav-link"
        :to="{name: 'owner-dishes'}"
      >
        全部<span class="d-none d-md-inline">菜單</span>
      </router-link>
    </li>
    <li class="nav-item">
      <router-link
        class="nav-link"
        :to="{name: 'owner-menu', query: {ran: 'thisWeek'}}"
      >
        本週<span class="d-none d-md-inline">菜單</span>
      </router-link>
    </li>
    <li class="nav-item">
      <router-link
        class="nav-link"
        :to="{name: 'owner-menu', query: {ran: 'nextWeek'}}"
      >
        下週<span class="d-none d-md-inline">菜單</span>
      </router-link>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@include navPillStyling;
</style>
