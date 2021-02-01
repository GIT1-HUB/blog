<template>
  <!-- 后台左侧菜单 -->
  <Menu
    :active-name="isActive"
    :open-names="['1','2','3']"
    class="menu-left"
    @on-select="getIndex"
    style="width:100%;min-height:100vh;min-width:160px"
  >
    <Submenu name="1">
      <template slot="title">
        <Icon class="iconfont" type="ios-construct" />控制面板
      </template>
      <MenuItem name="welcome">
        <Icon type="ios-happy-outline" class="iconfont" />welcome
      </MenuItem>
      <MenuItem name="publishArticle">
        <Icon type="ios-book-outline" class="iconfont" />发布文章
      </MenuItem>
      <MenuItem name="articleList">
        <Icon class="iconfont" type="md-list" />文章列表
      </MenuItem>
    </Submenu>
    <Submenu name="3">
      <template slot="title">
        <Icon class="iconfont" type="ios-chatbubbles-outline" />评论管理
      </template>
      <MenuItem name="comment">
        <Icon class="iconfont" type="ios-chatbubbles-outline" />评论列表
      </MenuItem>
    </Submenu>
  </Menu>
</template>
<script>
export default {
  data() {
    return {
      isActive: ""
    };
  },
  mounted() {
    // 获取当前active
    this.getActive();
    // console.log(111)
  },
  watch: {
    // 监听路由变化，执行getactive函数
    $route: "getActive"
  },
  methods: {
    // 点击导航跳转指定页面
    getIndex(val) {
      this.isActive = val;
      if (val == "welcome") {
        this.$router.push("/wblog");
      } else {
        this.$router.push("/wblog/" + val);
      }
    },
    // 根据路由获取active
    getActive() {
      let path = this.$route.path;
      // console.log(path);
      if (path.indexOf("List") !== -1) {
        this.isActive = "articleList";
      } else if (path.indexOf("publish") !== -1) {
        this.isActive = "publishArticle";
      } else if (path.indexOf("comment") !== -1) {
        this.isActive = "comment";
      } else if (path.indexOf("updateArticle") !== -1) {
        this.isActive = "publishArticle";
      } else {
        this.isActive = "welcome";
      }
    }
  }
};
</script>
<style lang="less">
.ivu-menu-item {
  font-weight: bold !important;
  i {
    font-weight: bold;
    font-size: 14px;
  }
}
.iconfont {
  font-weight: bold;
  font-size: 14px;
}
</style>
