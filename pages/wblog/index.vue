<template>
    <div class="welcome">
        <div class="title">{{this.$store.state.username}},欢迎使用博客管理系统</div>
        <div class="mouse">
            <object type="application/x-shockwave-flash" style="outline:none;" data="http://cdn.abowman.com/widgets/hamster/hamster.swf?" width="500" height="450"><param name="movie" value="http://cdn.abowman.com/widgets/hamster/hamster.swf?"><param name="AllowScriptAccess" value="always"><param name="wmode" value="opaque"></object>
        </div>
    </div>
</template>
<script>

export default {
    layout:'wblog'
}
</script>
<style lang="less" scoped>
    .welcome {
        position: relative;
        .title {
            width: 400px;
            height: 50px;
            font-size: 28px;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            margin: 0 auto;
            margin-top: 160px;
        }
        .mouse {
            position: absolute;
            left: 50%;
            transform: translate(-55%)
        }
    }
    
</style>