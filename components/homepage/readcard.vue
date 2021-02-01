<template>
  <!-- 阅读排行榜开始 -->
  <el-card class="readCard">
    <h3 class="read-title">阅读排行榜</h3>
    <ul>
      <li v-for="(item,index) in readmore" :key="item._id">
        <nuxt-link
          :to="{path:'/article',query:{id:item._id}}"
          class="read-link"
        >{{index+1}}、{{item.title}}({{item.readnumber}})</nuxt-link>
      </li>
    </ul>
  </el-card>
  <!-- 阅读排行榜结束 -->
</template>
<script>
import { baseurl } from "~/plugins/url.js";
export default {
  data() {
    return {
      readmore: []
    };
  },
  props: ["username"],
  mounted() {
    this.getReadMore();
  },
  methods: {
    // 根据当前用户获取文章list
    async getReadMore() {
      let json = { page: 1, pagesize: 5, author: this.username };
      let {
        status,
        data: { readmore }
      } = await this.$axios.get(`${baseurl}/article/getAllListByAuthor`, {
        params: json
      });
      this.readmore = readmore;
    }
  }
};
</script>
<style lang="less">
@globalColor: #41b883;
@color: #3d5064;
/*右侧排行榜文章*/
.readCard {
  margin-top: 1.5rem;
  width: 253px;
  // height: 230px;
  text-align: center;
  min-width: 220px !important;
  position: absolute;
  top: 500px;
  right: 250px;
  .read-title {
    background-color: #169fe6;
    color: white;
    width: 210px;
    line-height: 45px;
  }
  ul li {
    list-style: none;
    border: 1px solid lightblue;
  }
  ul li:hover {
    background-color: rgb(233, 233, 233);
  }
  .read-link {
    text-decoration: none;

    display: block;
    padding: 0.5rem 0;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    &:hover {
      transition: all ease 0.7s;
      color: @globalColor;
    }
  }
}
</style>