<template>
  <div class="linkcontainer">
    <el-card class="box-card linkform">
      <div slot="header" class="clearfix">
        <h2 class="title">添加友情链接</h2>
      </div>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="链接名称" prop="name">
          <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" prop="address">
          <el-input v-model="ruleForm.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <Row type="flex" justify="end" class="code-row-bg linktable">
      <Col :span="24">
        <h2>友情链接：</h2>
        <Table
          border
          stripe
          :loading="linkloading"
          :columns="columns12"
          :data="link"
          no-data-text="没有数据"
        >
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="show(row)">详情</Button>
            <Button type="error" size="small" @click="remove(row)">删除</Button>
          </template>
        </Table>
      </Col>
    </Row>

    <!-- 封装模态框 -->
    <Modal v-model="modal2" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除留言提醒</span>
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
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("链接名称不能为空"));
      } else {
        callback();
      }
    };
    var validateAddress = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("链接地址不能为空"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        name: "",
        address: ""
      },
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        address: [{ validator: validateAddress, trigger: "blur" }]
      },
      columns12: [
        {
          title: "链接名称",
          key: "name"
        },
        {
          title: "链接地址",
          key: "address"
        },
        {
          title: "Action",
          slot: "action",
          align: "center"
        }
      ],
      linkloading: false,
      link: [
        {
          name: "五子棋",
          address: "www.baidu.com"
        }
      ],
      modal2: false,
      modal_loading: false
    };
  },
  mounted() {
    this.initLink();
  },
  methods: {
    show(row) {
      // 点击 详情 按钮显示详细信息
      // console.log(index);
      // console.log(item);
      this.$Modal.info({
        title: "友情链接",
        content: `连接名称：${row.name}<br>连接地址：${row.address}`
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          //   alert("submit!");
          let json = {
            name: this.ruleForm.name,
            address: this.ruleForm.address
          };
          console.log(json);
          let {
            status,
            data: { error }
          } = await this.$axios.post(`${baseurl}/adminuser/insertLink`, json);
          if (status == 200 && error == 0) {
            this.initLink();
            this.$message({
              message: "添加成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "警告哦，添加失败",
              type: "warning"
            });
          }
        } else {
          this.$message({
            message: "警告哦，添加失败",
            type: "warning"
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    remove(row) {
      // 点击删除按钮
      this.modal2 = true;
      // 临时存放
      this.linkname = row.name;
      this.linkaddress = row.address;
    },
    delete() {
      // 删除留言的方法
      let json = {
        name: this.linkname,
        address: this.linkaddress
      };
      this.$axios.post(`${baseurl}/adminuser/delLink`, json).then(res => {
        let { error } = res.data;
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
        ? this.delete()
        : this.$Message.error("获取删除信息失败，原因未知");
      this.initLink();
      setTimeout(() => {
        this.error === 0
          ? this.$Message.success({
              content: "通知：成功删除友情链接！",
              duration: 6
            })
          : this.$Message.error("删除失败，原因未知");
      }, 1500);
    },
    async initLink() {
      let {
        status,
        data: { error, link }
      } = await this.$axios.get(`${baseurl}/adminuser/getLink`);
      if (status == 200 && error == 0) {
        this.link = link;
      } else {
        return;
      }
    }
  }
};
</script>
<style lang="less">
.linkcontainer {
  .linkform {
    position: absolute;
    width: 450px;
    top: 50px;
    left: 400px;
    .title {
      text-align: center;
    }
    .btn {
      margin-left: 30px;
    }
  }
  .linktable {
    position: absolute;
    width: 700px;
    left: 300px;
    top: 400px;
  }
}
</style>