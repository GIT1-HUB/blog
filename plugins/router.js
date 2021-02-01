import {baseurl} from '@/plugins/url'
export default ({
  app
}) => {
  app.router.beforeEach(async (to, from, next) => {
      let {status,data:{user}} = await app.$axios.get(`${baseurl}/bloguser/getUser`)
    let users = window.sessionStorage.getItem("username");
    let bloguser =user;
    // console.log(user)
    if (to.path == "/main") {
      next()
    } else if (to.path.indexOf('/main') !== -1 && users) {
      next();
    } else if (to.path.indexOf('/main') !== -1 && !users) {
      location.href = '/main'
    } else if (to.path.indexOf('/wblog') !== -1 && !bloguser) {
      location.href = '/login'
    } else {
      next()
    }
  })
}
