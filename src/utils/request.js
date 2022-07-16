import axios from 'axios'
import store from '@/store'

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net',
  timeout: 3000
})

request.interceptors.request.use(
  (config) => {
    // console.log(config)
    const token = store.state.user.token
    if (token) {
      config.headers.Authorization = `Bearer ${store.state.user.token}`
    }
    return config
  },
  (error) => {
    // console.log(Promise.reject(error))
    return Promise.reject(error)
  }
)

export default request
