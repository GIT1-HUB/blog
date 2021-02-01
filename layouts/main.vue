<template>
  <div>
    <!-- 后台header -->
    <nav-header />
    <Row type="flex" justify="space-between" style="min-width:1200px;">
      <Col span="3">
        <!-- 后台左边导航 -->
        <nav-left class="navleft"></nav-left>
      </Col>
      <Col span="21" class="routerView">
        <!-- 后台导航下的内容 -->
        <nuxt />
      </Col>
    </Row>
  </div>
</template>
<script>
import NavHeader from "~/components/main/NavHeader.vue";
import NavLeft from "~/components/main/NavLeft.vue";
export default {
  components: {
    NavHeader,
    NavLeft
  },
  head() {
    return {
      title: `博客管理系统`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: "李磊个人博客，关注于web前端技术和web全栈技术的学习研究。"
        },
        {
          hid: "keywords",
          name: "keywords",
          content:
            "李磊,互联网,自媒体,李磊博客,新鲜科技,科技博客，个人博客,原创博客,前端,前端开发,全栈,全栈开发,nuxt,nuxtjs,vue,vuejs"
        },
        { hid: "author", content: "lilei" }
      ]
    };
  }
};
</script>
<style lang="less">
</style>