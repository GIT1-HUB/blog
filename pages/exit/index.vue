<template>
  <div></div>
</template>

<script>
import {baseurl} from '~/plugins/url.js';
export default {
  layout: "blank",
  // middware  是在vue的生命函数执行之前执行，这样可以直接跳转到首页
  middleware: async ctx => {
    let { status, data } = await ctx.$axios.get(`${baseurl}/bloguser/exit`);
    if (status === 200 && data && data.code === 0) {
      window.location.href = "/";
    }
  }
};
</script>