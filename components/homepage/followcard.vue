<template>
  <!-- 我的主页关注模块开始 -->
  <el-card class="followCard">
    <!-- 个人资料开始 -->
    <div>
      <el-avatar :size="60" :src="avatarUrl" @error="errorHandler">
        <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
      </el-avatar>
    </div>
    <!-- 个人资料结束 -->

    <span>{{username}}</span>

    <p v-if="userdesc">{{userdesc}}</p>
    <p v-else>
      <nuxt-link to="/resetpassword/set">+ 你的职业是什么</nuxt-link>
    </p>

    <div class="follow">
      <nuxt-link
        :to="{ path: '/homepage/followers', query: { user: this.username }}"
        class="followers"
      >
        <span>关注者</span>
        <span>{{followersNumber}}</span>
      </nuxt-link>
      <el-divider direction="vertical"></el-divider>
      <nuxt-link
        :to="{ path: '/homepage/followed', query: { user: this.username }}"
        class="followed"
      >
        <span>关注了</span>
        <span>{{followedsNumber}}</span>
      </nuxt-link>
    </div>
  </el-card>
  <!-- 我的主页关注模块结束 -->
</template>
<script>
import { baseurl } from "~/plugins/url.js";
export default {
  data() {
    return {
      followers: [],
      followeds: [],
      avatar: "",
      userdesc: "",
      avatarUrl: ""
    };
  },
  computed: {
    followersNumber: function() {
      return this.followers.length;
    },
    followedsNumber: function() {
      return this.followeds.length;
    }
  },
  props: ["username"],
  mounted() {
    this.getFollwPeople();
    this.getUserInfo();
  },
  methods: {
    async getFollwPeople() {
      let json = { username: this.username };
      let {
        status,
        data: { error, followers, followeds }
      } = await this.$axios.get(`${baseurl}/bloguser/getFollow`, {
        params: json
      });
      if (status == 200 && error == 0) {
        this.followers = followers;
        this.followeds = followeds;
      }
    },
    errorHandler() {
      return true;
    },
    async getUserInfo() {
      let json = { username: this.username };
      let {
        status,
        data: { error, result }
      } = await this.$axios.get(`${baseurl}/bloguser/userInfo`, {
        params: json
      });
      //  avatar = result.avatar;
      // this.userdesc = result.userdesc;
      console.log(result.avatar);
      // console.log(this.username)
      if (status == 200 && error == 0) {
        this.avatar = result.avatar;
        this.userdesc = result.userdesc;
        this.avatarUrl = `${baseurl}/uploads/${this.avatar}`;
      }
    }
  }
};
</script>
<style lang="less">
.followCard {
  font-size: 16px;
  width: 253px;
  min-width: 250px !important;
  margin: 30px auto;
  text-align: center;
  height: 230px;
  position: absolute;
  top: 230px;
  right: 250px;
  span {
    font-size: 18px;
  }
  .follow {
    display: flex;
    justify-content: center;
    align-items: center;
    .followers {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      padding: 10px;
    }
    .followed {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 10px;
      align-items: center;
    }
  }
}
</style>