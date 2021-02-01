import axios from 'axios'

const instance = axios.create({
  baseURL:`http://${process.env.HOST||'localhost'}:80`,
  // baseURL:'http://localhost:80',
  timeout:10000,
  headers:{
    
  }
})

export default instance