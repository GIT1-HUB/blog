<template>
  <!-- 后台头部导航栏 -->
  <div>
    <Menu mode="horizontal" theme="light" active-name="1">
      <Row type="flex" justify="center">
        <Col span="23">
          <div class="nav-left">
            <nuxt-link to="/" class="logo">Lilei's Blog</nuxt-link>
          </div>
          <div class="nav-right">
            <MenuItem name="1">
              <nuxt-link to="/main">
                <Icon type="ios-paper"></Icon>博客管理系统
              </nuxt-link>
            </MenuItem>
          </div>
        </Col>
      </Row>
    </Menu>
  </div>
</template>
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
}
.nav-right {
  float: right;
  line-height: 58px;
}
</style>
