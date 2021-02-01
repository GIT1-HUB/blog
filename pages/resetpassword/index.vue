<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h1 class="title">邮箱重置密码</h1>
      </div>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="60px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input type="email" v-model="ruleForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码:" prop="code">
          <el-input
            type="code"
            v-model="code"
            autocomplete="off"
            style="width:140px"
            placeholder="请输入验证码"
          ></el-input>
          <el-button @click="sendMsg" style="width:210px">{{statusMsg}}</el-button>
        </el-form-item>
        <el-form-item class="pwdbutton">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <model :model="model" />
  </div>
</template>
<script>
import { baseurl } from "~/plugins/url.js";
// 是否登录的组件
import Model from "~/components/Model";
export default {
  data() {
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        this.getUserInfo();
        callback();
      }
    };
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      setTimeout(() => {
        let reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正确的邮箱地址"));
        } else {
          if (value !== this.email) {
            callback(new Error("当前邮箱和您注册的邮箱不同"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      statusMsg: "发送验证码",
      // email: "",
      // username: this.$store.state.username,
      model: false,
      code: "",
      ruleForm: {
        username: "",
        email: ""
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        email: [{ validator: checkEmail, trigger: "blur" }]
      }
    };
  },
  components: {
    Model
  },
  methods: {
    async submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //   alert("submit!");
          // if (this.username == "登录/注册" || this.username == "") {
          //   this.model = true;
          // } else {
          // console.log(this.code);
          let json = { username: this.ruleForm.username, code: this.code };
          this.$axios
            .get(`${baseurl}/bloguser/checkEmailCode`, {
              params: json
            })
            .then(result => {
              let {
                status,
                data: { error }
              } = result;
              if (status == 200 && error == 0) {
                this.$router.push({
                  path: "resetpassword/setpassword",
                  query: { username: this.ruleForm.username }
                });
              } else {
                this.$message.error("server error");
              }
            });
        } else {
          this.$message.error("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    sendMsg() {
      // if (this.username == "登录/注册" || this.username == "") {
      //   this.model = true;
      // } else {
      const self = this;
      let emailPass;
      if (self.timerid) {
        return false;
      }
      this.$refs["ruleForm"].validateField("email", valid => {
        emailPass = valid;
      });
      if (!emailPass) {
        self.$axios
          .post(`${baseurl}/bloguser/emailverify`, {
            username: this.ruleForm.username,
            email: self.email
          })
          .then(({ status, data }) => {
            if (status === 200 && data && data.code === 0) {
              let count = 60;
              self.statusMsg = `${count--}秒`;
              self.timerid = setInterval(function() {
                self.statusMsg = `${count--}秒`;
                if (count === 0) {
                  clearInterval(self.timerid);
                  self.statusMsg = "发送验证码";
                }
              }, 1000);
            } else {
              self.statusMsg = data.msg;
            }
          });
      }
    },
    async getUserInfo() {
      // if (this.username == "登录/注册" || this.username == "") {
      //   this.model = true;
      // } else {
      let json = { username: this.ruleForm.username };
      let {
        status,
        data: {
          error,
          result: { email }
        }
      } = await this.$axios.get(`${baseurl}/bloguser/userInfo`, {
        params: json
      });
      if (status == 200 && error == 0) {
        // console.log(email);
        this.email = email;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.box-card {
  width: 480px;
  height: 380px;
  position: absolute;
  top: 25%;
  left: 50%;
  margin-left: -240px;
  padding: 10px;
  .title {
    text-align: center;
  }
  .pwdbutton {
    text-align: center;
    margin-left: -40px;
  }
}
</style>