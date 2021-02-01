<!-- 关于我的介绍 -->
<template>
  <div>
    <nav-header :activeIndex="activeIndex" />
    <el-tabs v-model="activeName" @tab-click="handleClick" class="settab">
      <el-tab-pane label="个人资料" name="set">
        <!-- 个人设置表单 -->
        <div class="setContainer">
          <h1 class="title">个人资料</h1>
          <el-divider></el-divider>
          <div class="input">
            <span class="settitle">头&nbsp;&nbsp;&nbsp;像</span>
            <el-upload
              class="avatar-uploader"
              :action="url"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl !== '' || imageUrl !== undefined" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span class="settitle2">支持 jpg、png 格式大小 2M 以内的图片</span>
          </div>
          <el-divider></el-divider>

          <div class="input">
            <span class="settitle">用户名</span>
            <input type="text" v-model="username" maxlength="10" />
          </div>
          <el-divider></el-divider>
          <div class="input">
            <span class="settitle">简&nbsp;&nbsp;&nbsp;介</span>
            <input type="text" v-model="userdesc" placeholder="个人简介" maxlength="30" />
          </div>
          <el-divider></el-divider>
          <div class="setbutton">
            <el-button type="success" round @click="setuser">提交更改</el-button>
          </div>
        </div>
      </el-tab-pane>
      <!-- 修改密码 -->
      <el-tab-pane label="修改密码" name="pwd">
        <div class="setContainer">
          <h1 class="title">修改密码</h1>
          <el-divider></el-divider>
          <div class="input">
            <span class="settitle">旧&nbsp;密&nbsp;码</span>
            <input type="text" v-model="oldpwd" placeholder="请输入原密码" />
            <div>
              <nuxt-link to="/resetpassword">忘记密码?</nuxt-link>
            </div>
          </div>
          <el-divider></el-divider>
          <div class="input">
            <span class="settitle">新&nbsp;密&nbsp;码</span>
            <input type="text" v-model="newpwd" show-password placeholder="请输入新密码" maxlength="30" />
          </div>
          <el-divider></el-divider>
          <div class="input">
            <span class="settitle">确认密码</span>
            <input type="text" v-model="newpwd2" show-password placeholder="请确认新密码" maxlength="30" />
          </div>
          <el-divider></el-divider>
          <div class="setbutton">
            <el-button type="success" round @click="setpwd">确认修改</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <model :model="model" />
  </div>
</template>
<script>
import NavHeader from "~/components/NavHeader";
import CryptoJS from "crypto-js";
import { baseurl } from "~/plugins/url.js";
// 是否登录的组件
import Model from "~/components/Model";
export default {
  data() {
    return {
      activeIndex: "login",
      imageUrl: "",
      username: this.$store.state.username,
      userdesc: "",
      activeName: "set",
      oldpwd: "",
      newpwd: "",
      newpwd2: "",
      model: false,
      imgFileName: ""
    };
  },
  components: {
    NavHeader,
    Model
  },
  computed: {
    url() {
      return `${baseurl}/bloguser/setImage?username=${this.username}&userdesc=${this.userdesc}`;
    }
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      let json = { username: this.username };
      let {
        status,
        data: {
          error,
          result: { avatar, userdesc }
        }
      } = await this.$axios.get(`${baseurl}/bloguser/userInfo`, {
        params: json
      });
      this.imgFileName = avatar;
      this.imageUrl = `${baseurl}/uploads/${avatar}`;
      // console.log(this.imageUrl);
      this.userdesc = userdesc;
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      //   const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG或PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }

      // if(this.imgFileName !== '' || this.imgFileName !==undefined) {
      //   this.$axios.get(`${baseurl}/bloguser/deleteUserImage`,{
      //     params:{imgname:this.imgFileName}
      //   }).then(() => {
      //     console.log(111)
      //   }).catch(() => {
      //     console.log(22)
      //   })
      // }

      return isJPG && isLt2M;
    },
    // 点击修改
    async setuser() {
      if (this.username == "登录/注册") {
        this.model = true;
      } else if (this.username == "") {
        this.$message({
          message: "用户名不能为空",
          type: "warning"
        });
      } else {
        if (this.userdesc == "") {
          this.userdesc = "您的个人简介为空";
        }
        var arr = this.imageUrl.split("/");
        let json = {
          oldusername: this.$store.state.username,
          newusername: this.username,
          userdesc: this.userdesc,
          avatar: arr[arr.length - 1]
        };
        let {
          status,
          data: { error }
        } = await this.$axios.get(`${baseurl}/bloguser/setuserinfo`, {
          params: json
        });
        if (status == 200 && error == 0) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          setTimeout(() => {
            this.$router.push({ name: "login" });
          }, 500);
        }
      }
    },
    async setpwd() {
      if (this.username == "登录/注册") {
        this.model = true;
      } else {
        if (this.oldpwd == "") {
          this.$message({
            message: "原密码不能为空",
            type: "warning"
          });
        } else if (this.newpwd == "" || this.newpwd2 == "") {
          this.$message({
            message: "新密码不能为空",
            type: "warning"
          });
        } else if (this.newpwd !== this.newpwd2) {
          this.$message({
            message: "新密码不相同",
            type: "warning"
          });
        } else if (this.newpwd == this.oldpwd) {
          this.$message({
            message: "新密码和旧密码不能相同",
            type: "warning"
          });
        } else if (this.newpwd == this.newpwd2 && this.newpwd !== "") {
          let json = {
            username: this.username,
            oldpwd: CryptoJS.MD5(this.oldpwd).toString(),
            newpwd: CryptoJS.MD5(this.newpwd).toString()
          };

          let {
            status,
            data: { error, result, msg }
          } = await this.$axios.post(`${baseurl}/bloguser/setpwd`, json);
          if (status == 200 && error == 0) {
            this.$message({
              message: msg,
              type: "success"
            });
            setTimeout(() => {
              this.$router.push({ name: "login" });
            }, 500);
          }
        }
      }
    },
    // 点击tab栏
    handleClick(tab, event) {
      console.log(tab.name);
    }
  }
};
</script>
<style lang="less" scoped>
.settab {
  width: 700px;
  margin: 0 auto;
}
.setContainer {
  width: 700px;
  height: 490px;
  border: 1px solid black;
  margin: 0 auto;
  padding: 32px 48px 84px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  .title {
    color: #333;
    margin: 5px 0 5px;
  }
  .input {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .settitle {
      margin-right: 100px;
    }
    input {
      width: 200px;
      height: 35px;
      border: none;
      outline: none;
      color: #909090;
      font-size: 16px;
    }
  }
  .setbutton {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.avatar-uploader {
  border: 1px solid black;
  width: 100px;
  height: 100px;
  margin-right: 50px;
}
.avatar-uploader .el-upload {
  border: 1px dashed black;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>