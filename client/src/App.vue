<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
export default {
  name: 'App'
}
</script>

<style lang="scss">
html { height: 100%; }

body {
  background-color: #F4F7F8;
  color: color(secondary);
  height: 100%;
}

#app { height: 100%; }
</style>
