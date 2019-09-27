import axios from '@/libs/api.request'

export default {
  getUserList: (data) => {
    return axios.request({
      url: '/user/list',
      data: data,
      method: 'post'
    })
  },
  getPersonList: () => {
    return axios.request({
      url: '/person/list',
      method: 'get'
    })
  },
  createUser: (data) => {
    return axios.request({
      url: 'create/user',
      data: data,
      method: 'post'
    })
  },
  modifyUser: (data) => {
    return axios.request({
      url: 'modify/user',
      data: data,
      method: 'post'
    })
  },
  changeUserStatus: (id) => {
    return axios.request({
      url: '/change/user/status',
      data: {
        id
      },
      method: 'post'
    })
  }
}
