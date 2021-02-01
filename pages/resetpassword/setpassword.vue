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
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="密 码" prop="pass">
          <el-input type="password" show-password v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" show-password v-model="ruleForm.checkPass" autocomplete="off"></el-input>
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
import CryptoJS from "crypto-js";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      model: false,
      // username:this.$store.state.username,
      username: this.$route.query.username,
      ruleForm: {
        pass: "",
        checkPass: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  components: {
    Model
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // if (this.username == "登录/注册" || this.username == "") {
          //   this.model = true;
          // } else {
          //   console.log(this.ruleForm.pass);
          let json = {
            username: this.username,
            password: CryptoJS.MD5(this.ruleForm.pass).toString()
          };
          this.$axios
            .post(`${baseurl}/bloguser/emailResetPassword`, json)
            .then(result => {
              let {
                status,
                data: { error, msg }
              } = result;
              if (status == 200 && error == 0) {
                this.$message({
                  message: msg,
                  type: "success"
                });
                setTimeout(() => {
                  this.$router.push({ name: "login" });
                }, 500);
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