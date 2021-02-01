<template>
<div>
    <el-card class="box-card">
        <div slot="header" class="title">
            <span>反馈</span>
        </div>
        <textarea v-model="feedback" cols="59" rows="10" placeholder="如果你有什么问题直接在这里说明，我会尽量通过邮件回复你，或者直接联系管理员邮箱15528022618@163.com"/>
        <el-button class="clickfeed" @click="handleClick" type="primary">提交</el-button>
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
        return {
            feedback:'',
            model:false,
            username:this.$store.state.username
        }
    },
    components: {
        Model
    },
    methods: {
        async handleClick() {
            // console.log(this.feedback)
            if(this.username == "登录/注册") {
                this.model = true;
            } else if(this.feedback == ''){
                this.$message({
                    message: '警告哦，反馈信息不能为空',
                    type: 'warning'
                });
            } else {
                let json = {username:this.username,content:this.feedback}
                let {status,data:{error}} = await this.$axios.post(`${baseurl}/adminuser/feedback`,json)
                if(status == 200 && error == 0) {
                    this.$message({
                        message: "反馈成功",
                        type: "success"
                    });
                    setTimeout(function() {
                        this.feedback = ''
                    },500)
                } else {
                    this.$message({
                        message: "反馈失败，可以直接联系管理员邮箱15528022618@163.com",
                        type: "success",
                        duration:0,
                        showClose:true
                    });
                }
            }
        }
    }
}
</script>
<style lang="less">
    .box-card {
        width: 480px;
        position: absolute;
        top: 200px;
        left: 50%;
        margin-left: -240px;
        .title {
            font-size: 18px;
            text-align: center;
        }
        .clickfeed {
            display: block;
            width: 100%;
        }
    }
</style>