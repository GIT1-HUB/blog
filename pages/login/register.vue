<template>
  <div class="register">
    <!-- 注册表单开始 -->
    <div class="container">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm login"
      >
        <el-form-item label="用户名:" prop="name">
          <el-input
            v-model="ruleForm.name"
            autocomplete="off"
            autofocus
            placeholder="请输入用户名"
            @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            show-password
            autocomplete="off"
            placeholder="请输入密码"
            @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
            placeholder="请确认密码"
            show-password
            @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input
            type="email"
            v-model="ruleForm.email"
            autocomplete="off"
            placeholder="请输入邮箱"
            @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码:" prop="code">
          <el-input
            type="code"
            v-model="ruleForm.code"
            autocomplete="off"
            style="width:140px"
            placeholder="验证码已发送"
            @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
          <el-button @click="sendMsg" style="width:93px">{{statusMsg}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register">注册</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
        <el-form-item>
          <span style="color:white">已有账号</span>
          <nuxt-link to="/login">去登陆</nuxt-link>
        </el-form-item>
      </el-form>
    </div>
    <!-- 注册表单结束 -->
  </div>
</template>
<script>
import CryptoJS from "crypto-js";
import { baseurl } from "~/plugins/url.js";
export default {
  data() {
    var checkName = (rule, value, callback) => {
      // 判断用户名
      if (!value) {
        return callback(new Error("用户名不能为空"));
      } else {
        // thie.$axios.get
        var patt1 = /\w{5,10}/g;
        if (value.match(patt1)) {
          callback();
        } else {
          return callback(new Error("用户名必须是字母数字下划线5—10位"));
        }
      }
    };
    var validatePass = (rule, value, callback) => {
      // 判断密码
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        function check(str) {
          var s1 = /[A-Z]/;
          var s2 = /[a-z]/;
          var s3 = /[0-9]/;
          if (str.length < 8 || str.legth > 20) {
            return false;
          } else if (s1.test(str) && s2.test(str) && s3.test(str)) {
            var arr = str.split("");
            for (let i = 0; i < arr.length; i++) {
              if (arr[i] == arr[i + 1] && arr[i] == arr[i + 2]) {
                return false;
              } else {
                return true;
              }
            }
          } else {
            return false;
          }
        }
        if (check(value)) {
          this.$refs.ruleForm.validateField("checkPass");
          callback();
        } else {
          callback(new Error("大小写字母数字8-20位不能三个字符重复"));
        }
      }
    };
    var validatePass2 = (rule, value, callback) => {
      // 判断再次输入密码
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      // 判断邮件
      console.log(value);
      const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
      if (value === "") {
        callback(new Error("请输入您的邮箱"));
      } else {
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("邮箱格式不正确"));
        }
        // callback();
      }
    };
    return {
      statusMsg: "发送验证码",
      error: "",
      ruleForm: {
        name: "",
        pass: "",
        checkPass: "",
        email: ""
      },
      rules: {
        name: [{ validator: checkName, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        email: [{ validator: validateEmail, trigger: "blur" }]
      }
    };
  },
  methods: {
    sendMsg: function() {
      // if(this.ruleForm.email == )
      //   发送验证码
      const self = this;
      let namePass;
      let emailPass;
      if (self.timerid) {
        return false;
      }
      this.$refs["ruleForm"].validateField("name", valid => {
        namePass = valid;
      });
      if (namePass) {
        return false;
      }
      this.$refs["ruleForm"].validateField("email", valid => {
        emailPass = valid;
      });
      self.statusMsg = "";
      if (!namePass && !emailPass) {
        self.$axios
          .post(`${baseurl}/bloguser/verify`, {
            username: encodeURIComponent(self.ruleForm.name),
            email: self.ruleForm.email
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
      } else if (namePass) {
        self.statusMsg = "发送验证码";
        this.$message.error("用户名不正确");
      } else {
        self.statusMsg = "发送验证码";
        this.$message.error("邮箱格式不正确");
      }
    },
    register: function() {
      // 点击注册
      let self = this;
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          self.$axios
            .post(`${baseurl}/bloguser/signup`, {
              username: window.encodeURIComponent(self.ruleForm.name),
              password: CryptoJS.MD5(self.ruleForm.pass).toString(),
              email: self.ruleForm.email,
              code: self.ruleForm.code
            })
            .then(({ status, data }) => {
              if (status === 200) {
                if (data && data.code === 0) {
                  this.$message({
                    message: "恭喜你，注册成功",
                    type: "success"
                  });
                  location.href = "/login";
                } else {
                  self.error = data.msg;
                  this.$message.error("用户名" + data.msg);
                }
              } else {
                self.error = `服务器出错，错误码:${status}`;
                this.$message.error(`服务器出错，错误码:${status}`);
                console.log(self.error);
              }
              setTimeout(function() {
                self.error = "";
              }, 1500);
            });
        }
      });
    },
    resetForm(formName) {
      //   重置表单
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="less">
.register {
  background-image: url("~static/images/login.jpeg");
  height: 100vh;
  .container {
    width: 360px;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-140%, -50%);
    .login {
      width: 340px;
      margin: 0 auto;
      .el-form-item__label {
        color: white !important;
      }
    }
  }
}
</style>