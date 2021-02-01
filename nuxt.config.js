module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'http://www.lilei.site/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
 loading: '@/components/loading.vue',
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '~assets/css/main.css',
    '~assets/css/Markdown.css',
    '~assets/css/font/iconfont.css',
    'mavon-editor/dist/css/index.css'
  ],


  loader:[
    {
        test:/\.less$/,
        loaders:'style-loader!css-loader!less-loader'
    }
 ],


//  router: {
//   scrollBehavior (to, from, savedPosition) {
//     if (savedPosition) {
//       return savedPosition
//     } else {
//       return { x: 0, y: 0 }
//     }
//   }
// },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {src:'@/plugins/element-ui',ssr:true},
    {src:'@/plugins/iview',ssr:true},
    {src:'@/plugins/mavon',ssr:true},
    {src:'@/plugins/axios'},
    {src:'@/plugins/url'},
    {src:'@/plugins/router',mode:'client'},
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],

  // axios: {
  //   // proxy: true, // 表示开启代理
  //   prefix: `${baseurl}`, // 表示给请求url加个前缀 /api
  //   // credentials: true // 表示跨域请求时是否需要使用凭证
  // },
 
  // proxy: {
  //   '/api': { 
  //     target: 'http://localhost:3000', // 目标接口域名
  //     pathRewrite: {
  //       '^/api': '/', // 把 /api 替换成 /
  //       changeOrigin: true // 表示是否跨域
  //     }   
  //   }
  // },
  /*
  ** Build configuration
  */
  build: {
    vendor: ['axios'],
    transpile: [/^element-ui/],
    /*
    ** You can extend webpack config here
    */
    babel:{
        "plugins":[
            ['component',{
                "libraryName":"element-ui",
                "styleLibraryName":"theme-chalk"
            }]
        ]
    },
    extend (config, ctx) {
    }
  }
}
