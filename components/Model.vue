<template>
    <Modal
      v-model="model"
      title="登录提示"
      ok-text="去登录"
      cancel-text="取消"
      @on-ok="ok"
      @on-cancel="cancel"
      class="model1"
    >
      <p>你还没有登录，去登陆</p>
    </Modal>
</template>
<script>
export default {
    props:{
        model: {
            type: Boolean,
            default:false,
            required: true
        },
    },
    methods:{
      ok() {
      this.modal1 = false;
      this.$router.push("/login");
    },
    cancel() {
      this.modal1 = false;
      return;
    },
    }
}
</script>
<style lang="less">
  .model1 {
    width: 200px;
  }
</style>