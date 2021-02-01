<template lang="html">
  <div class="loading-page" v-if="loading">
    <!--<p>Loading...</p>
    <Icon type="ios-loading" color="#409eff"/>-->
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color:white;
  text-align: center;
  padding-top: 400px;
  font-size: 30px;
  font-family: sans-serif;
  z-index: 999;
  color: #409eff;
}
</style>