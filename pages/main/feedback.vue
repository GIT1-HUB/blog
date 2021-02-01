<template>
  <div class="feedbackContent">
    <Row type="flex" justify="end" class="code-row-bg">
      <Col :span="24">
        <h2>全部留言：</h2>
        <Table
          border
          stripe
          :loading="feedbackloading"
          :columns="columns12"
          :data="feedback"
          no-data-text="没有数据"
        >
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="show(row)">详情</Button>
            <Button type="primary" size="small" style="margin-right: 5px" @click="deal(row)">处理</Button>
            <Button type="error" size="small" @click="remove(row)">删除</Button>
          </template>
        </Table>
        <div class="pagination" v-show="feedbackCount !== 0">
          <Page
            :total="feedbackCount"
            :page-size="10"
            show-total
            show-elevator
            @on-change="feedbackPage"
          />
        </div>
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

    <!-- 封装留言模态框 -->
    <Modal v-model="feedbackmodal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>回复留言</span>
      </p>
      <textarea
        v-model="feedbacktext"
        cols="44"
        rows="10"
        placeholder="注意，这里回复的内容是直接发送邮件到留言者留下的邮箱，直接写内容"
      />
      <div slot="footer">
        <Button type="error" size="large" long :loading="feedbackmodal_loading" @click="send">发送邮件</Button>
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
      feedbackloading: false,
      feedback: [],
      feedbackCount: 0,
      modal2: false,
      modal_loading: false,
      feedbackmodal: false,
      feedbackmodal_loading: false,
      feedbackusername: "",
      feedbackcontent: "",
      feedbackemail: "",
      index: 1,
      feedbacktext: "",
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
          title: "留言内容",
          key: "content"
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
    this.initFeedBack(1);
  },
  methods: {
    // 显示详情
    show(row) {
      // 点击 详情 按钮显示详细信息
      // console.log(index);
      // console.log(item);
      this.$Modal.info({
        title: `留言人：${row.username}`,
        content: `邮箱：${row.email}<br>留言内容：${row.content}`
      });
    },
    // 点击处理
    deal(row) {
      this.feedbackmodal = true;
      // 临时存放
      this.feedbackusername = row.username;
      this.feedbackcontent = row.content;
      this.feedbackemail = row.email;
    },
    // 真实发送邮件方法
    async send() {
      // this.feedbackmodal_loading = true;
      this.feedbackmodal = false;
      let json2 = {
        username: this.feedbackusername,
        content: this.feedbackcontent,
        email: this.feedbackemail,
        feedbacktext: this.feedbacktext
      };
      console.log(json2);
      let {
        status,
        data: { error }
      } = await this.$axios.get(`${baseurl}/adminuser/sendfeedbackemail`, {
        params: json2
      });

      if (status == 200 && error == 0) {
        this.delete();
        this.initFeedBack(this.index);
        setTimeout(() => {
          this.$Message.success({
            content: "通知：成功回复留言！",
            duration: 6
          });
        }, 1500);
      } else {
        this.$Message.error("发送邮件失败，原因未知");
      }
    },

    remove(row) {
      // 点击删除按钮
      this.modal2 = true;
      // 临时存放
      this.feedbackusername = row.username;
      this.feedbackcontent = row.content;
      this.feedbackemail = row.email;
    },
    delete() {
      // 删除留言的方法
      let json = {
        username: this.feedbackusername,
        content: this.feedbackcontent,
        email: this.feedbackemail
      };
      this.$axios.post(`${baseurl}/adminuser/delFeedBack`, json).then(res => {
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
      this.initFeedBack(this.index);
      setTimeout(() => {
        this.error === 0
          ? this.$Message.success({
              content: "通知：成功删除留言！",
              duration: 6
            })
          : this.$Message.error("删除失败，原因未知");
      }, 1500);
    },
    feedbackPage(index) {
      this.index = index;
      this.initFeedBack(index);
    },
    async initFeedBack(page) {
      try {
        this.feedbackloading = true;
        let {
          data: { count, feedback }
        } = await this.$axios.get(`${baseurl}/adminuser/getfeedback`, {
          params: { page, pagesize: 10 }
        });
        this.feedback = feedback;
        this.feedbackCount = count;
        this.feedbackloading = false;
      } catch (error) {
        this.$Message.error("错误", `${error}`, false);
      }
    }
  }
};
</script>
<style lang="less">
.feedbackContent {
  margin: 50px auto;
  width: 1000px;
}
</style>