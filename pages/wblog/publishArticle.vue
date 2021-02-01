<template>
  <div class="container">
    <Row>
      <Col span="17">
        <!-- 文章标题输入框开始 -->
        <label for="title" class="article">撰写新文章</label>
        <Input
          v-model="title"
          size="large"
          placeholder="在此输入文章标题"
          name="title"
          class="article_title"
        ></Input>
        <!-- 文章标题输入框结束 -->

        <!-- 输入文章简介开始 -->
        <label for="title" class="article">文章简介</label>
        <Input v-model="des" size="large" placeholder="在此输入文章简介" name="title" class="article_title"></Input>
        <!-- 输入文章简介结束 -->

        <!-- 撰写文章内容开始 -->
        <mavon-editor
          ref="mavonEditor"
          @change="changeContent"
          class="article_content"
          v-model="content"
          fontSize="18px"
          @imgDel="imgDel"
          @imgAdd="imgAdd"
          placeholder="开始编写文章内容..."
          style="min-height:600px;"
        />
        <!-- 撰写文章内容结束 -->

        <!-- 发布文章按钮 -->
        <Button type="success" class="article_button" @click="submitArticle">发布文章</Button>
        <!-- 发布文章按钮结束 -->
      </Col>
      <Col span="4" offset="1" class="content_right">
        <!-- 发布日期开始 -->
        <Card class="card">
          <label for="date" class="article" slot="title">发布日期</label>
          <DatePicker
            @on-change="dateContent"
            :value="date"
            type="date"
            name="date"
            size="large"
            class="data_picker"
            placeholder="Select date"
            style="width:100%;"
          ></DatePicker>
        </Card>
        <!-- 发布日期结束 -->

        <!-- 选择分类开始 -->
        <Card class="card">
          <p slot="title">分类目录</p>
          <RadioGroup v-model="radio" vertical>
            <Radio label="Front">
              <i class="iconfont icon-h5"></i>
              <span class="list_menu">前端开发</span>
            </Radio>
            <Radio label="Back">
              <Icon class="iconfont icon-nodejs"></Icon>
              <span class="list_menu">后端开发</span>
            </Radio>
            <!--<Radio label="about-me">
                <Icon class="iconfont icon-guanyuwomen"></Icon>
                <span class="list_menu">关于我</span>
            </Radio>-->
          </RadioGroup>
        </Card>
        <!-- 选择分类结束 -->
      </Col>
    </Row>
  </div>
</template>

<script>
import { baseurl } from "~/plugins/url.js";

export default {
  layout: "wblog",
  data() {
    return {
      title: "",
      content: "",
      htmlContent: "",
      date: FormatDate(new Date()),
      radio: "Front",
      des: "",
      originalContent: "",
      uploadToken: "",
    };
  },
  methods: {
    changeContent(value, render) {
      // 文章内容改变
      this.htmlContent = render;
      this.originalContent = value;
    },
    submitArticle() {
      // 点击发布按钮
      this.insertArticle();
    },
    dateContent(val) {
      // 选择日期
      this.date = FormatDate(val);
    },
    insertArticle() {
      // 发布文章，发布之前的各种判断
      let param = {
        title: this.title,
        htmlContent: this.htmlContent,
        date: this.date,
        des: this.des,
        original: this.originalContent,
        radio: this.radio,
        author: this.$store.state.username
      };
      if (Object.is(this.title, "")) {
        this.$Notice.error({
          title: "文章标题留空无法保存",
          desc: "请仔细检查文章标题"
        });
      } else {
        this.$axios
          .post(`${baseurl}/article/insertArticle`, param)
          .then(res => {
            let { error } = res.data;
            // console.log(error)
            if (Object.is(error, 0)) {
              this.$Notice.success({
                title: "文章发布成功",
                desc: "请注意言行，不要传播色情内容 ",
                duration: 2
              });
              [this.title, this.des, this.original, this.content] = [""];
            } else {
              this.$Notice.error({ title: "发布失败", desc: "未知原因" });
              console.log(123344455);
            }
          });
      }
    },
    imgAdd(pos, file) {
      // var formdata = new FormData()
      // formdata.append('token', this.uploadToken)
      // formdata.append('file', file)
      // this.$axios({
      //   url: '/api/article/upload',
      //   method: 'post',
      //   data: formdata,
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     'Accept': '*/*'
      //   }
      // }).then(res => {
      //   this.$refs.mavonEditor.$img2Url(pos, res.data.img)
      // })
    },
    imgDel(pos, file) {
      // /* 删除预留 */
      // console.log(pos)
      // console.log(file)
    },
  }
};
/* 封装格式化日期 */
function FormatDate(strTime) {
  var date = new Date(strTime);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}
</script>

<style lang="less">
@import "../../assets/css/article.less";
</style>
