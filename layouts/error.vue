<template>
  <div>
    <div class="img4" v-if="error.statusCode == 404">
      <img src="../static/images/404.jpg" alt="404" />
    </div>
    <div class="img5" v-else>
      <img src="../static/images/500.png" alt="500" />
    </div>
    <ul class="link">
      <li>
        <nuxt-link to="/">HOME</nuxt-link>
      </li>
      <li>
        <span @click="handleClick">返回上一页</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: "李磊的个人博客-一个基于Nuxt构建的博客网站",
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
  },
  props: ["error"],
  methods: {
    handleClick() {
      // window.history.go(-1)
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
.img4 {
  position: absolute;
  left: 25%;
}
.img5 {
  position: absolute;
  left: 18%;
}
.link {
  position: absolute;
  top: 70%;
  left: 40%;
  font-size: 18px;
}
.link li {
  display: inline-block;
  margin-left: 50px;
  span {
    color: #41b883;
  }
  span:hover {
    color: #57a3f3;
    cursor: pointer;
  }
}
</style>