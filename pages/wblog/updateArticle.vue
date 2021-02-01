<!-- 和发布文章基本一样 -->
<template>
  <div class="container">
    <Row>
      <Col span="17">
        <label for="title" class="article">修改文章</label>
        <Input
          v-model="title"
          size="large"
          placeholder="在此输入文章标题"
          name="title"
          class="article_title"
        ></Input>

        <label for="title" class="article">文章简介</label>
        <Input v-model="des" size="large" placeholder="在此输入文章简介" name="title" class="article_title"></Input>

        <!-- banner图开始 -->
        <p class="article">banner图</p>
        <el-upload
          class="avatar-uploader update"
          :action="url"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          drag
        >
          <img v-if="imgFileName" :src="imageUrl" class="avatar" />
          <div v-else>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </div>
        </el-upload>

        <!-- banner图结束 -->

        <mavon-editor
          ref="mavonEditor"
          @change="changeContent"
          class="article_content"
          v-model="content"
          fontSize="18px"
          @imgDel="imgDel"
          @imgAdd="imgAdd"
          placeholder="开始编写文章内容(上传图片为七牛云，删除功能暂无)..."
          style="min-height:600px;"
        />
        <Button type="warning" class="article_button" @click="submitArticle">修改文章</Button>
      </Col>
      <Col span="4" offset="1" class="content_right">
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
      date: "",
      radio: "",
      des: "",
      originalContent: "",
      imageUrl: ""
    };
  },
  computed: {
    url() {
      return `${baseurl}/article/setBannerImage?id=${this.$route.query.id}&type=${this.radio}`;
    }
  },
  async asyncData(ctx) {
    let result = await ctx.$axios.get(
      `${baseurl}/article/updatearticle?id=` + ctx.query.id
    );
    //   console.log(result)
    //   console.log()
    return {
      title: result.data.arr[0].title,
      content: result.data.arr[0].original,
      date: result.data.arr[0].time,
      radio: result.data.arr[0].list,
      des: result.data.arr[0].des,
      imgFileName:result.data.arr[0].imgFileName,
      imageUrl:`${baseurl}/banner/${result.data.arr[0].imgFileName}`
    };
  },
  methods: {
    changeContent(value, render) {
      this.htmlContent = render;
      this.originalContent = value;
    },
    submitArticle() {
      this.updateArticle();
    },
    dateContent(val) {
      this.date = FormatDate(val);
    },
    updateArticle() {
      let param = {
        title: this.title,
        content: this.htmlContent,
        date: this.date,
        des: this.des,
        original: this.originalContent,
        list: this.radio,
        id: this.$route.query.id
      };
      if (Object.is(this.title, "")) {
        this.$Notice.error({
          title: "文章标题留空无法保存",
          desc: "请仔细检查文章标题"
        });
      } else {
        this.$axios.post(`${baseurl}/article/update`, param).then(res => {
          let { error } = res.data;
          console.log(error);
          if (error == 0) {
            this.$Notice.success({
              title: "文章修改成功",
              desc: "请注意言行，不要传播色情内容 "
            });
            [this.title, this.des, this.original, this.content] = [""];
          } else {
            this.$Notice.error({ title: "修改失败", desc: "未知原因" });
          }
        });
      }
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.imgFileName = true;
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

      if(this.imgFileName !== '' || this.imgFileName !==undefined) {
        this.$axios.get(`${baseurl}/article/deleteBannerImage`,{
          params:{imgname:this.imgFileName}
        }).then(() => {
          console.log(111)
        }).catch(() => {
          console.log(22)
        })
      }

      return isJPG && isLt2M;
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
    async getUploadToken() {
      //   try {
      //     let result = await this.$axios.post('/api/article/getToken')
      //     this.uploadToken = result.data
      //   } catch (error) {
      //     this.error(error, error, false)
      //   }
    }
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
