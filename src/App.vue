<template>
  <div id="app">
    <div class="page-title">GPSCY Karaoke</div>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style lang="less">
  body {
    margin: 0;

    #app {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #2c3e50;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      .page-title {
        text-align: center;
        font-size: larger;
        font-weight: bold;
        padding: 15px;
      }
    }
  }
</style>
