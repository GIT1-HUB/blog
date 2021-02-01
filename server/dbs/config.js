export default {
    // mongodb 数据库配置
    dbs:'mongodb://127.0.0.1:27017/blog',
    // redis 数据库配置
    redis: {
        get host(){
            return '127.0.0.1'
        },
        get port(){
            return 6379
        }
    }, 
    // QQ邮箱SMTP服务配置
    smtp: {
        get host(){
            return 'smtp.qq.com'
        },
        get user(){
            return '1602799560@qq.com'
        },
        get pass(){
            return 'zbkfsqwfuxxijcbe'
        },
        // 验证码生成函数
        get code(){
            return ()=>{
                return Math.random().toString(16).slice(2,6).toUpperCase()
            }
        },
        // 判断验证码是否过期 ，设置一个验证码过期时间
        get expire(){
            return ()=>{
                return new Date().getTime()+60*60*1000
            }
        }
    }
}