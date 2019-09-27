import axios from '@/libs/api.request'

export default {
  getHomeInfo: (data) => {
    return axios.request({
      url: '/home',
      data: data,
      method: 'post'
    })
  }
}