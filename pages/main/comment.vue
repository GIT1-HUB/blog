<template>
  <div class="container">
    <Row>
      <!-- 搜索评论 -->
      <Col :span="11" offset="6">
        <Card>
          <p slot="title">搜索评论</p>
          <div>
            <div style="display:flex;justify-content: center;">
              <i-input
                search
                enter-button
                style="width:80%;"
                placeholder="搜索文章标题"
                v-model="searchArticle"
                @on-search="search"
              ></i-input>
              <!--<Button type="success" @click="search">搜索评论</Button>-->
            </div>
          </div>
        </Card>
      </Col>
      <!-- 搜索评论结束 -->

      <!-- 一条分割线 -->
      <Divider dashed style="margin-top: 200px">评论列表</Divider>
      <!-- 分割线结束 -->
    </Row>

    <!-- 评论列表 -->
    <Row type="flex" justify="space-between" class="commentlist">
      <Col :span="24">
        <Card v-for="(item,key) in commentTable" :key="item.id" class="commentcard">
          <p slot="title">
            <span class="title1">{{item.title}}</span>
            <span calss="title2" style="float:right">{{item.id}}</span>
          </p>
          <i-table border :columns="columns12" :data="item.comment" max-height="183">
            <template slot-scope="{ row }" slot="username">
              <div>
                <strong>{{ row.username }}</strong>
                <el-tag type="success" v-show="curusername == row.username">作者</el-tag>
              </div>
            </template>
            <template slot-scope="{ row }" slot="time">
              <div>
                <span>{{ timestampToTime(row.time) }}</span>
              </div>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button
                type="primary"
                size="small"
                style="margin-right: 5px"
                @click="show(index,item)"
              >详情</Button>
              <Button type="error" size="small" @click="remove(index,item)">删除</Button>
            </template>
          </i-table>
        </Card>
        <span class="emptycomment" v-if="commentCount === 0">没有数据</span>
        <div class="commentPage" v-show="commentCount !== 0">
          <Page :total="commentCount" :page-size="4" @on-change="commentPage" />
        </div>
      </Col>
    </Row>
    <!-- 评论列表结束 -->
    <!-- 封装模态框 -->
    <Modal v-model="modal2" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除评论提醒</span>
      </p>
      <div style="text-align:center">
        <p style="font-weight:bold;font-size:16px;">此删除操作将会永久删除，且无法恢复</p>
        <p style="font-weight:bold;">你确定要删除么？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="dele">确定删除</Button>
      </div>
    </Modal>
    <!-- 模态框结束 -->
  </div>
</template>
<script>
import { baseurl } from "~/plugins/url.js";

export default {
  layout: "main",
  data() {
    return {
      switch1: true,
      // 临时存放时间戳
      commentTime: 0,
      // 临时存放id
      commentId: null,
      delCount: "",
      error: "",
      modal2: false,
      modal_loading: false,
      value: "",
      searchArticle: "",
      page: 1,
      pagesize: 4,
      commentTable: "",
      commentCount: 0,
      commentempty: false,
      columns12: [
        {
          title: "用户名",
          slot: "username"
        },
        {
          title: "邮箱",
          key: "email"
        },
        {
          title: "IP地址",
          key: "ip"
        },
        {
          title: "时间",
          slot: "time"
        },
        {
          title: "评论内容",
          key: "content"
        },
        {
          title: "Action",
          slot: "action",
          width: 180,
          align: "center"
        }
      ]
    };
  },
  created() {
    // 初始化，获取评论列表和时候开放评论
    this.getCommentList();
  },
  computed: {
    curusername() {
      // 获取当前用户
      return this.$store.state.username;
    }
  },
  methods: {
    timestampToTime(timestamp) {
      var date = new Date(timestamp);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      var h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      var m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

      var strDate = Y + M + D + h + m + s;
      return strDate;
    },
    async getCommentList() {
      // 获取评论列表
      let { data } = await this.$axios.get(
        `${baseurl}/comment/getallcommentsList`,
        {
          params: {
            page: this.page,
            pagesize: this.pagesize
          }
        }
      );
      this.commentTable = data.result;
      this.commentCount = data.count;
    },
    show(index, item) {
      // 点击 详情 按钮显示详细信息
      // console.log(index);
      // console.log(item);
      this.$Modal.info({
        title: "评论信息",
        content: `用户名：${item.comment[index].username}<br>邮箱：${item.comment[index].email}<br>内容：${item.comment[index].content}`
      });
    },
    remove(index, item) {
      // 点击删除按钮
      this.modal2 = true;
      this.commentTime = item.comment[index].time;
      this.commentId = item.id;
      // console.log(this.commentTime);
      // console.log(this.commentId);
    },
    delete(id, time) {
      // 删除评论的方法
      let json = { id, time };
      this.$axios.post(`${baseurl}/comment/delComment`, json).then(res => {
        let { delCount, error } = res.data;
        this.delCount = delCount;
        this.error = error;
      });
    },
    dele() {
      /*
       *真正删除数据。异步使用延迟删除
       */
      this.modal_loading = true;
      this.modal_loading = false;
      this.modal2 = false;
      this.modal2 === false
        ? this.delete(this.commentId, this.commentTime)
        : this.$Message.error("获取删除信息失败，原因未知");
      this.getCommentList();
      setTimeout(() => {
        this.error === 0
          ? this.$Message.success({
              content: "通知：成功删除评论！",
              duration: 6
            })
          : this.$Message.error("删除失败，原因未知");
      }, 1500);
    },
    search() {
      // 搜索评论，根据文章标题
      // console.log(this.searchArticle);
      if (this.searchArticle == "") {
        this.getCommentList();
      } else {
        this.$axios
          .get(
            `${baseurl}/comment/searchCommentList?searcharticle=` +
              this.searchArticle
          )
          .then(res => {
            if (res.status == 200 && res.data.error == 0) {
              console.log(11);
              if (res.data.sclist.length != 0) {
                this.commentTable = res.data.sclist;
                this.commentCount = res.data.count;
                this.commentempty = false;
              } else {
                this.commentTable = [];
                this.commentCount = 0;
                this.commentempty = true;
              }
            }
          });
      }
      // console.log(result.data)
      // if(data.error == 0){
      //   this.commentTable = result.data.sclist;
      //   this.commentCount = result.data.count;
      //   console.log(123)
      // } else {
      //   return
      // }
    },
    commentPage(page) {
      // 评论列表的分页
      this.page = page;
      this.getCommentList();
    }
  }
};
</script>
<style lang="less" scope>
.container {
  margin: 50px;
  p {
    color: #41b883;
    font-size: 14px;
  }
}

.ivu-table-cell span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.commentcard {
  margin-bottom: 20px;
}
.commentPage {
  margin: 20px;
  float: right;
}
.emptycomment {
  color: red;
  text-align: center;
  display: block;
  font-size: 24px;
}
.el-tag--success {
  width: 50px;
  float: left;
}
</style>