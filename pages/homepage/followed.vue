<template>
  <div>
    <div class="selfFollowContainer">
      <div v-if="followeds.length !== 0">
        <nuxt-link
          :to="{ name: 'homepage', query: { user: item.username }}"
          class="userbox"
          v-for="(item,index) in followeds"
          :key="item.username"
        >
          <el-avatar
            :size="60"
            :src="getImgUrl(item.avatar)"
            @error="errorHandler"
            class="useravatar"
          >
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
          </el-avatar>
          <div class="userinfo">
            <span>{{item.username}}</span>
            <div v-if="item.userdesc">{{item.userdesc}}</div>
            <div v-else>对方还没有设置简介</div>
          </div>

          <el-button
            type="success"
            size="medium"
            plain
            @click.stop.prevent="handleClick(item.username,index)"
            class="followBtn"
          >
            <span v-if="item.followStatus">已关注</span>
            <span v-else>关注</span>
          </el-button>
        </nuxt-link>
      </div>
      <div v-else class="nofollow">
        你还没有关注作者
        <nuxt-link to="/">去浏览文章</nuxt-link>
      </div>
      <model :model="model" />
    </div>
    <follow-card :username="this.username" />
    <read-card :username="this.username" />
  </div>
</template>
<script>
import { baseurl } from "~/plugins/url.js";
// 是否登录的组件
import Model from "~/components/Model";
import followCard from "~/components/homepage/followcard";
import readCard from "~/components/homepage/readcard";
export default {
  layout: "follow",
  data() {
    return {
      // followed: [],
      username: this.$route.query.user ? this.$route.query.user : this.$store.state.username,
      model: false,
      followeds: []
      // followStatus:'已关注'
    };
  },
  components: {
    Model,
    followCard,
    readCard
  },
  mounted() {
    this.getFolloweds();
  },
  methods: {
    async getFolloweds() {
      if (this.$store.state.username == "登录/注册") {
        this.model = true;
      } else {
        // 获取当前主页用户的followeds
        let json = { username: this.username };
        let {
          status,
          data: { error, followeds }
        } = await this.$axios.get(`${baseurl}/bloguser/getFollow`, {
          params: json
        });
        // 获取当前vuex用户的followeds
        let json2 = { username: this.$store.state.username };
        let result = await this.$axios.get(`${baseurl}/bloguser/allFolloweds`, {
          params: json2
        });
        let vuexfollweds = result.data.result ? result.data.result : [];
        if (status == 200 && error == 0) {
          for (let i = 0; i < followeds.length; i++) {
            if (vuexfollweds.includes(followeds[i].username)) {
              followeds[i].followStatus = true;
            } else {
              followeds[i].followStatus = false;
            }
          }
          // console.log(followeds)
          this.followeds = followeds;
        }
      }
    },
    errorHandler() {
      return true;
    },
    getImgUrl(url) {
      return `${baseurl}/uploads/${url}`;
    },
    async handleClick(curname, index) {
      //  console.log(this.followeds[index].followStatus)
      if (this.$store.state.username == "登录/注册") {
        this.model = true;
      } else if (this.$store.state.username == curname) {
        this.$message({
          showClose: true,
          message: "你不能关注自己喔",
          type: "warning"
        });
      } else {
        if (this.followeds[index].followStatus == false) {
          let json = { currentUser: this.username, followedUser: curname };
          let {
            status,
            data: { error }
          } = await this.$axios.post(
            `${baseurl}/bloguser/updateFollowedUser`,
            json
          );
          if (status == 200 && error == 0) {
            this.$set(this.followeds[index], `followStatus`, true);
          }
        } else {
          let json = { currentUser: this.username, followedUser: curname };
          let {
            status,
            data: { error }
          } = await this.$axios.post(
            `${baseurl}/bloguser/deleteFollowedUser`,
            json
          );
          if (status == 200 && error == 0) {
            this.$set(this.followeds[index], `followStatus`, false);
          }
        }
      }
    }
  }
};
</script>
<style lang="less">
.selfFollowContainer {
  width: 540px;
  position: absolute;
  left: 400px;
  top: 320px;
  .userbox {
    display: flex;
    padding: 6px 30px;
    align-items: center;
    border: 1px solid #f7f7f7;
    .userinfo {
      width: 300px;
      span {
        font-weight: 600;
        color: #2e3135;
        font-size: 18px;
      }
      div {
        margin-top: 7px;
        font-size: 12px;
        font-weight: 500;
        color: #b9c0c8;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .useravatar {
      margin-right: 20px;
    }
  }
}
.nofollow {
  margin-left: 120px;
}
.followBtn {
  width: 90px;
}
</style>
