<template>
  <!-- 后台头部导航栏 -->
  <div>
    <Menu mode="horizontal" theme="light" active-name="1">
      <Row type="flex" justify="center">
        <Col span="23">
          <div class="nav-left">
            <div @click.prevent="local" class="logo">Lilei's Blog</div>
          </div>
          <div class="nav-right">
            <MenuItem name="1">
              <nuxt-link to="/wblog">
                <Icon type="ios-paper"></Icon>我的博客
              </nuxt-link>
            </MenuItem>
            <MenuItem name="2">
              <nuxt-link to="/wblog/feedback">
                <Icon type="ios-people"></Icon>反 馈
              </nuxt-link>
            </MenuItem>
          </div>
        </Col>
      </Row>
    </Menu>

  </div>
</template>
<script>
export default {
  methods:{
    local(){
      console.log(111)
      location.href='/'
    }
  }
}
</script>
<style lang="less" scope>
.ivu-col {
  height: 60px;
}
.logo {
  font-size: 25px;
  font-weight: bold;
  height: 60px;
  float: left;
  color: #41b883;
  cursor: pointer;
}
.nav-right {
  float: right;
  line-height: 58px;
}
</style>
