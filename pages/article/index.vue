<template>
  <div class="comment">
    <nav-header />

    <!-- 顶部标题 -->
    <el-row type="flex" justify="center">
      <el-col :span="14" class="detail_title">
        <div>{{title}}</div>
        <div class="articleAuthor">
          <span @click="toauthor">作者：{{author}}</span>
          <!-- 关注作者开始 -->
          <span class="follow" @click="handleClickFollow" v-if="followActive">已关注</span>
          <span class="follow" @click="handleClickFollow" v-else>关注</span>
          <!-- 关注作者结束 -->
        </div>
        <div
          class="time"
        >发布时间：{{time}}&nbsp;&nbsp;&nbsp;&nbsp;分类：{{list === 'Front' ? '前端文章' : '后端文章'}}</div>
      </el-col>
    </el-row>
    <!-- 顶部标题结束 -->

    <!-- 文章 -->
    <el-row type="flex" justify="center">
      <el-col :span="14" class="detail_content">
        <div v-show="!content">暂无文章数据...</div>
        <div class="banner">
          <div v-if="imgFileName == '' || imgFileName == undefined"></div>
          <img v-else :src="curimgurl" alt="banner" />
        </div>

        <div v-html="content" class="md markdown-body"></div>
      </el-col>
    </el-row>
    <!-- 文章主题内容结束 -->

    <!-- 评论标题  发表评论 -->
    <el-row type="flex" justify="center">
      <el-col :span="14">
        <h2 class="commenttitle" ref="comment">发表评论：</h2>
      </el-col>
    </el-row>
    <!-- 评论标题结束 -->

    <!-- 允许评论  评论 -->
    <el-row type="flex" justify="center" v-if="commentConfig">
      <el-col :span="15" class="detail_content" style="margin-left:-63px;">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="内容" prop="content">
            <el-input type="textarea" :rows="8" v-model="ruleForm.content" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 允许评论结束 -->

    <!-- 禁止评论开始 -->
    <el-row type="flex" justify="center" v-else>
      <el-col :span="15" class="detail_content" style="margin-left:-63px;">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          disabled
        >
          <el-form-item label="内容" prop="content">
            <el-input
              type="textarea"
              :rows="8"
              v-model="ruleForm.content"
              autocomplete="off"
              placeholder="作者已关闭评论"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 禁止评论结束 -->

    <!-- 显示评论列表开始 -->
    <el-row type="flex" justify="center" class="detail_content">
      <el-col :span="14">
        <el-card
          class="box-card"
          v-show="commentList.length !== 0"
          v-for="(item, index) in curcommentList"
          :key="index"
        >
          <div slot="header" class="clearfix">
            <span style="font-weight: bold;">
              {{item.username}}
              <el-tag type="success" v-show="author == item.username">作者</el-tag>说：
            </span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
            <span class="commenttime">
              <Time :time="item.time" :interval="1" />
            </span>
          </div>
          <div>{{item.content}}</div>
        </el-card>
        <el-pagination
          class="pagination"
          @current-change="pagination"
          background
          layout="prev, pager, next"
          :page-size="4"
          :total="count"
          v-show="count > 4"
        ></el-pagination>
      </el-col>
    </el-row>
    <!-- 显示评论列表结束 -->

    <!--点赞收藏转发开始 -->
    <div class="shareContent">
      <div class="circle" @click="likeClick">
        <el-badge :value="likeCount" class="item">
          <el-tooltip class="item" effect="dark" content="点赞" placement="left">
            <i class="iconfont1" ref="likeicon">&#xe60c;</i>
          </el-tooltip>
        </el-badge>
      </div>
      <div class="circle" @click="commentClick">
        <el-badge :value="count" class="item">
          <el-tooltip class="item" effect="dark" content="评论" placement="left">
            <i class="iconfont1">&#xe62f;</i>
          </el-tooltip>
        </el-badge>
      </div>
      <div class="circle" @click="favoriteClick">
        <el-tooltip class="item" effect="dark" content="收藏" placement="left">
          <i class="iconfont1" ref="favoriteicon">&#xe60f;</i>
        </el-tooltip>
      </div>
      <div class="circle" @click="shareToMicroblog">
        <el-tooltip class="item" effect="dark" content="微博" placement="left">
          <i class="iconfont1">&#xe63d;</i>
        </el-tooltip>
      </div>
      <div class="circle" @click="shareToQQ">
        <el-tooltip class="item" effect="dark" content="QQ" placement="left">
          <i class="iconfont1">&#xe601;</i>
        </el-tooltip>
      </div>
      <!--<div class="circle" @click="shareToWeixin">
        <el-tooltip class="item" effect="dark" content="微信" placement="left">
          <i class="iconfont1">&#xe659;</i>
        </el-tooltip>
      </div>-->
    </div>
    <!-- 点赞收藏转发结束 -->
    <Modal
      v-model="modal1"
      title="登录提示"
      ok-text="去登录"
      cancel-text="取消"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <p>你还没有登录，去登陆</p>
    </Modal>
  </div>
</template>
<script>
// 头部组件
import NavHeader from "~/components/NavHeader";
// baseurl
import { baseurl } from "~/plugins/url.js";

// import QRcode from 'qrcodejs2';

// 时间插件
import Time from "~/plugins/time";

export default {
  data() {
    // 验证内容
    var validateContent = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入评论内容"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        content: ""
      },
      rules: {
        content: [{ validator: validateContent, trigger: "change" }]
      },
      commentList: [],
      count: 0,
      author: "",
      page: 1,
      pagesize: 5,
      commentConfig: "true",
      likeStatus: true,
      favoriteStatus: true,
      likeCount: 0,
      modal1: false,
      followActive: false
    };
  },
  created() {
    // 获取评论列表
    this.commentLists(this.$route.query.id);
    // 获取评论是否禁止
    this.getCommentConfig();
  },
  mounted() {
    // 获取用户是否点赞
    this.getLikeStatus();
    // 获取是否收藏
    this.getFavoriteStatus();
    // 获取是否关注
    this.getFollowedStatus();
  },
  methods: {
    toauthor() {
      this.$router.push({ path: "/homepage", query: { user: this.author } });
    },
    // 获取是否禁止评论的方法
    getCommentConfig() {
      let json = { author: this.author };
      this.$axios
        .get(`${baseurl}/comment/getConfig`, { params: json })
        .then(res => {
          this.commentConfig = res.data.data[0].status;
        })
        .catch(function() {});
    },
    // 点击评论按钮方法
    submitForm(formName) {
      if (this.user == "") {
        this.modal1 = true;
        return;
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let json = Object.assign(
              {},
              {
                comment: Object.assign(this.ruleForm, {
                  time: new Date().getTime(),
                  username: this.user,
                  email: this.email
                }),
                id: this.$route.query.id
              }
            );
            this.commentsSubmit(json, formName);
          } else {
            this.$notify({
              title: "评论失败",
              message: "请认真填写表单内容",
              type: "error"
            });
            return false;
          }
        });
      }
    },
    // 发布评论的方法
    async commentsSubmit(json, formName) {
      let { data } = await this.$axios.post(
        `${baseurl}/comment/insertComment`,
        json
      );
      if (Object.is(data.status, "0")) {
        this.$refs[formName].resetFields();
        this.$notify({
          title: "评论成功",
          message: "发布评论成功，请注意言论",
          type: "success",
          duration: 2000
        });
        this.commentLists(this.$route.query.id);
      }
    },
    // 重置评论表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 评论列表分页
    pagination(page) {
      this.page = page;
    },
    usernameChange(val) {},
    // 获取评论列表方法
    async commentLists(id) {
      try {
        let {
          data: { count, result }
        } = await this.$axios.post(`${baseurl}/comment/articleComments`, {
          id
        });
        /*数组暂时倒序*/
        this.count = count;
        this.commentList = result.comment.reverse();
      } catch (error) {}
    },
    // 点击评论图标，跳转到评论列表
    commentClick() {
      this.$refs.comment.scrollIntoView();
    },
    // 获取是否点赞的方法
    async getLikeStatus() {
      let json = { id: this.$route.query.id, user: this.user };
      // console.log(json)
      let stateResult = await this.$axios.get(`${baseurl}/article/likeStatus`, {
        params: json
      });
      if (stateResult.status == 200) {
        this.likeStatus = stateResult.data.state;
        this.likeCount = stateResult.data.count / 2;
        this.$nextTick(function() {
          if (this.likeStatus == true) {
            this.$refs.likeicon.style.color = "#41b883";
          } else {
            this.$refs.likeicon.style.color = "#b2bac2";
          }
        });
      }
    },
    // 点击点赞按钮的方法
    async likeClick() {
      let user = this.$store.state.username;
      let json = { id: this.$route.query.id, user };
      if (user == "") {
        this.modal1 = true;
        return;
      } else {
        if (this.likeStatus == false) {
          let updateresult = await this.$axios.post(
            `${baseurl}/article/updateLike`,
            json
          );
          this.$refs.likeicon.style.color = "#41b883";
        } else {
          let deleteresult = await this.$axios.post(
            `${baseurl}/article/deleteLike`,
            json
          );
          this.$refs.likeicon.style.color = "#b2bac2";
        }
        this.likeStatus = !this.likeStatus;
        this.getLikeStatus();
      }
    },
    // 获取是否收藏的方法
    async getFavoriteStatus() {
      let user = this.$store.state.username;
      let json = { id: this.$route.query.id, user };
      let stateResult = await this.$axios.get(
        `${baseurl}/article/favoriteStatus`,
        {
          params: json
        }
      );
      if (stateResult.status == 200) {
        this.favoriteStatus = stateResult.data.state;
        this.$nextTick(function() {
          if (this.favoriteStatus == true) {
            this.$refs.favoriteicon.style.color = "#41b883";
          } else {
            this.$refs.favoriteicon.style.color = "#b2bac2";
          }
        });
      }
    },
    // 点击收藏的方法
    async favoriteClick() {
      let user = this.$store.state.username;
      let json = { id: this.$route.query.id, user };
      if (user == "") {
        this.modal1 = true;
        return;
      } else {
        if (this.favoriteStatus == false) {
          let updateresult = await this.$axios.post(
            `${baseurl}/article/updateFavorite`,
            json
          );
          this.$refs.favoriteicon.style.color = "#41b883";
        } else {
          let deleteresult = await this.$axios.post(
            `${baseurl}/article/deleteFavorite`,
            json
          );
          this.$refs.favoriteicon.style.color = "#b2bac2";
        }
        this.favoriteStatus = !this.favoriteStatus;
        this.getFavoriteStatus();
      }
    },
    // 跳转到登录页面
    ok() {
      this.modal1 = false;
      this.$router.push("/login");
    },
    // 不登录
    cancel() {
      this.modal1 = false;
      return;
    },
    // 获取是否关注的方法
    async getFollowedStatus() {
      let json = {
        currentUser: this.$store.state.username,
        followedUser: this.author
      };
      let {
        status,
        data: { error, isFollowed }
      } = await this.$axios.get(`${baseurl}/bloguser/followedStatus`, {
        params: json
      });
      if (status == 200 && error == 0) {
        this.followActive = isFollowed;
      } else {
        this.followActive = false;
      }
    },
    // 点击关注的方法
    async handleClickFollow() {
      let currentUser = this.$store.state.username;
      if (this.author == currentUser) {
        this.$message({
          showClose: true,
          message: "你不能关注自己喔",
          type: "warning"
        });
      } else {
        if (currentUser == "") {
          this.modal1 = true;
        } else {
          if (this.followActive == false) {
            let json = { currentUser, followedUser: this.author };
            let {
              status,
              data: { error }
            } = await this.$axios.post(
              `${baseurl}/bloguser/updateFollowedUser`,
              json
            );
            if (status == 200 && error == 0) {
              this.followActive = true;
            } else {
              this.followActive = false;
            }
          } else {
            let json = {
              currentUser: this.$store.state.username,
              followedUser: this.author
            };
            let {
              status,
              data: { error }
            } = await this.$axios.post(
              `${baseurl}/bloguser/deleteFollowedUser`,
              json
            );
            if (status == 200 && error == 0) {
              this.followActive = false;
            } else {
              this.followActive = true;
            }
          }
        }
      }
    },
    shareToMicroblog() {
      //自定义内容
      const share = {
        title: this.title,
        image_url: "http://www.lileiblog.xyz:3000/_nuxt/img/30c038a.jpg",
        share_url: `${baseurl}/article?id=${this.id}`
      };
      //跳转地址
      location.replace(
        "https://service.weibo.com/share/share.php?url=" +
          encodeURIComponent(share.share_url) +
          "&title=" +
          share.title +
          "&pic=" +
          share.image_url +
          "&searchPic=true"
      );
    },
    //分享到QQ好友(PC端可用)
    shareToQQ() {
      //此处分享链接内无法携带图片
      const share = {
        title: this.title,
        desc: this.des,
        share_url: "http://www.lileiblog.xyz:3000/article?id=" + this.id
      };
      location.replace(
        "https://connect.qq.com/widget/shareqq/index.html?url=" +
          encodeURIComponent(share.share_url) +
          "&title=" +
          share.title +
          "&desc=" +
          share.desc
      );
    },
    shareToWeixin() {}
  },
  computed: {
    // 真正的评论列表
    curcommentList: function() {
      return this.commentList.slice(
        (this.page - 1) * this.pagesize,
        this.pagesize * this.page
      );
    },
    curimgurl() {
      return `${baseurl}/banner/${this.imgFileName}`;
    }
  },
  components: {
    NavHeader,
    Time
  },
  // 服务端获取文章内容
  async asyncData(ctx) {
    let {
      status,
      data: { user, email }
    } = await ctx.$axios.get(`${baseurl}/bloguser/getUser`);
    let json = { id: ctx.query.id };
    let result = await ctx.$axios.get(`${baseurl}/article/articleInfo`, {
      params: json
    });
    // console.log(result)
    let { info } = result.data;
    let {
      _id,
      content,
      des,
      list,
      time,
      title,
      author,
      like,
      imgFileName
    } = info[0];
    if (result.status === 200 && result.data.error === 0) {
      return {
        id: _id,
        title,
        des,
        content,
        list,
        time,
        author,
        like,
        imgFileName,
        user,
        email
      };
    } else {
      return {
        title: "test",
        time: "2019年10月-1",
        list: "Front",
        content: "<h1>暂无数据</h1>",
        author: "admin",
        like: "",
        imgFileName: "",
        user: "",
        email: ""
      };
    }
  }
};
</script>
<style lang="less" scope>
@color: #3d5064;
//#a8a8a8
//#F0F2F5
body,
html {
  background: #fff;
  height: 100%;
}
.comment {
  .detail_title {
    margin: 2rem 0 2rem 0;
    font-size: 31px;
    font-weight: bold;
    padding-bottom: 1rem;
    color: @color;
    border-bottom: 1px dashed @color;
    text-align: center;
    .time {
      // margin:1rem 0 0 0;
      font-size: 12px;
      font-weight: normal;
    }
    .articleAuthor {
      font-size: 16px;
      font-weight: normal;
      cursor: pointer;
      color: #41b883;
      .follow {
        color: #88cd7f;
        font-size: 16px;
        border: 1px solid #88cd7f;
        width: 30px;
        // letter-spacing:6px;
        cursor: pointer;
        padding: 2px 6px;
        // position: absolute;
      }
    }
  }
  .detail_content {
    background: #fff;
    text-align: left;
    margin-bottom: 5rem;
    .banner {
      width: 100%;
      text-align: center;
      // border: 2px solid black;
      img {
        display: inline-block;
        margin: 0 auto;
        max-width: 500px;
        height: auto;
      }
    }
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }
  .box-card {
    border: 1px solid #dcdfe6 !important;
    border-radius: 5px;
    margin-bottom: 1rem;
  }
  .el-card__body {
    background: rgb(248, 248, 248) !important;
  }
  .el-tag {
    padding: 0 6px !important;
    height: 25px !important;
    line-height: 25px !important;
  }
  /*分页*/
  .pagination {
    float: right;
    margin-top: 1rem;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #41b883;
  }
}
.commenttitle {
  color: #3d5064;
  border-top: 1px dashed #3d5064;
  padding-top: 15px;
  margin: 30px 0 30px 0;
}

.shareContent {
  // border: 1px solid black;
  position: fixed;
  top: 480px;
  left: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .circle {
    font-size: 14px;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    // border: 1px solid black;
    float: left;
    margin-top: 15px;
    i {
      font-size: 28px;
      color: #b2bac2;
      cursor: pointer;
    }
    i:hover {
      color: rgb(51, 52, 53);
    }
  }
}
#qrcode {
  display: inline-block;
  img {
    width: 132px;
    height: 132px;
    background-color: #fff; //设置白色背景色
    padding: 6px; // 利用padding的特性，挤出白边
  }
}
.commenttime {
  float: right;
  padding: 3px 0;
  font-weight: bold;
}
</style>