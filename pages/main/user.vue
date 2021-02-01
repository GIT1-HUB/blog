<template>
  <div class="userInfoContent">
    <Row type="flex" justify="end" class="code-row-bg">
      <Col :span="24">
        <h2>全部用户：</h2>
        <Table
          border
          stripe
          :loading="userInfoloading"
          :columns="columns12"
          :data="userInfo"
          no-data-text="没有数据"
        >
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="deal(row)">留言</Button>
            <Button type="error" size="small" @click="remove(row)">注销</Button>
          </template>
        </Table>
        <div class="pagination userinfo" v-show="userInfoCount !== 0">
          <Page
            :total="userInfoCount"
            :page-size="10"
            show-total
            show-elevator
            @on-change="userInfoPage"
          />
        </div>
      </Col>
    </Row>
    <!-- 封装模态框 -->
    <Modal v-model="modal2" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>注销用户提醒</span>
      </p>
      <div style="text-align:center">
        <p style="font-weight:bold;font-size:16px;">此注销操作将会永久删除，且无法恢复</p>
        <p style="font-weight:bold;">你确定要注销么？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="dele">确定注销</Button>
      </div>
    </Modal>
    <!-- 模态框结束 -->

    <!-- 封装留言模态框 -->
    <Modal v-model="userInfomodal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>给用户{{userInfousername}}留言</span>
      </p>
      <textarea v-model="userInfotext" cols="44" rows="10" placeholder="注意，留言的内容会直接显示在用户的首页！！！" />
      <div slot="footer">
        <Button type="error" size="large" long :loading="userInfomodal_loading" @click="send">留言给用户</Button>
      </div>
    </Modal>
    <!-- 留言模态框结束 -->
  </div>
</template>
<script>
// baseurl
import { baseurl } from "~/plugins/url.js";
export default {
  layout: "main",
  data() {
    return {
      userInfoloading: false,
      userInfo: [],
      userInfoCount: 0,
      modal2: false,
      modal_loading: false,
      userInfomodal: false,
      userInfomodal_loading: false,
      userInfousername: "",
      userInfouserdesc: "",
      userInfoemail: "",
      userInfoAvatar: "",
      index: 1,
      userInfotext: "",
      columns12: [
        {
          title: "用户名",
          key: "username"
        },
        {
          title: "邮箱",
          key: "email"
        },
        {
          title: "简介",
          key: "userdesc"
        },
        {
          title: "Action",
          slot: "action",
          align: "center"
        }
      ]
    };
  },
  mounted() {
    this.inituserInfo(1);
  },
  methods: {
    // 点击处理
    deal(row) {
      this.userInfomodal = true;
      // 临时存放
      this.userInfousername = row.username;
    },
    // 真实发送邮件方法
    async send() {
      // this.userInfomodal_loading = true;
      this.userInfomodal = false;
      let json2 = {
        username: this.userInfousername,
        userInfotext: this.userInfotext
      };
      //   console.log(json2)
      let {
        status,
        data: { error }
      } = await this.$axios.post(`${baseurl}/bloguser/setAdminMessage`, json2);

      if (status == 200 && error == 0) {
        setTimeout(() => {
          this.$Message.success({
            content: `通知：成功留言给用户${json2.username}`,
            duration: 6
          });
        }, 1500);
      } else {
        this.$Message.error("留言失败，原因未知");
      }
    },

    remove(row) {
      // 点击注销按钮
      this.modal2 = true;
      // 临时存放
      this.userInfousername = row.username;
      this.userInfouserdesc = row.userdesc;
      this.userInfoAvatar = row.avatar;
    },
    delete() {
      // 注销用户的方法
      let json = {
        username: this.userInfousername,
        userdesc: this.userInfouserdesc,
        avatar: this.userInfoAvatar
      };
      this.$axios.post(`${baseurl}/bloguser/deluser`, json).then(res => {
        let { error } = res.data;
        this.error = error;
      });
    },
    dele() {
      /*
       *真正注销数据。异步使用延迟注销
       */
      this.modal_loading = true;
      this.modal_loading = false;
      this.modal2 = false;
      this.modal2 === false
        ? this.delete()
        : this.$Message.error("获取信息失败，原因未知");
      this.inituserInfo(this.index);
      setTimeout(() => {
        this.error === 0
          ? this.$Message.success({
              content: "通知：成功注销用户！",
              duration: 6
            })
          : this.$Message.error("注销失败，原因未知");
      }, 1500);
    },
    userInfoPage(index) {
      this.index = index;
      this.inituserInfo(index);
    },
    async inituserInfo(page) {
      try {
        this.userInfoloading = true;
        let {
          data: { count, result }
        } = await this.$axios.get(`${baseurl}/bloguser/getAllUserInfo`, {
          params: { page, pagesize: 10 }
        });
        this.userInfo = result;
        this.userInfoCount = count;
        this.userInfoloading = false;
      } catch (error) {
        this.$Message.error("错误", `${error}`, false);
      }
    }
  }
};
</script>
<style lang="less">
.userInfoContent {
  margin: 50px auto;
  width: 1000px;
}
.userinfo {
  margin-top: 10px;
}
</style>