<template>
    <Modal
      v-model="newadminmd"
      title="登录提示"
      ok-text="去登录"
      cancel-text="取消"
      @on-ok="ok"
      @on-cancel="cancel"
      class="adminmodel"
    >
      <p>你还没有登录，去登陆</p>
    </Modal>
</template>
<script>
export default {
    data() {
        return {
            newadminmd:this.adminmd
        }
    },
    props:{
        adminmd: {
            type: Boolean,
            default:false,
            required: true
        },
    },
    methods:{
      ok() {
        this.newadminmd = false
    },
    cancel() {
        this.newadminmd = false
    },
    }
}
</script>
<style lang="less">
    .adminmodel {
        width: 400px;
    }
</style>