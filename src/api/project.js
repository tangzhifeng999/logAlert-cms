import axios from '@/libs/api.request'

export default {
  getProjectList: (data) => {
    return axios.request({
      url: '/project/list',
      data: data,
      method: 'post'
    })
  },
  getProjectDetail: (data) => {
    return axios.request({
      url: '/project/detail',
      data: data,
      method: 'post'
    })
  },
  getProjectNameList: () => {
    return axios.request({
      url: '/app/list',
      // data: data,
      method: 'get'
    })
  },
  createProject: (data) => {
    return axios.request({
      url: '/create/project',
      data: data,
      method: 'post'
    })
  },
  createTask: (data) => {
    return axios.request({
      url: '/create/task',
      data: data,
      method: 'post'
    })
  },
  modifyTask: (data) => {
    return axios.request({
      url: '/modify/task/info',
      data: data,
      method: 'post'
    })
  },
  getPersonList: () => {
    return axios.request({
      url: '/person/list',
      // data: data,
      method: 'get'
    })
  },
  modifyProject: (data) => {
    return axios.request({
      url: '/modify/project',
      data: data,
      method: 'post'
    })
  },
  modifyTaskStatus: (data) => {
    return axios.request({
      url: '/modify/tasks/status',
      data: data,
      method: 'post'
    })
  },
  deleteTask: (data) => {
    return axios.request({
      url: '/delete/task',
      data: data,
      method: 'post'
    })
  },
  modifyCount: (data) => {
    return axios.request({
      url: '/modify/count',
      data: data,
      method: 'post'
    })
  },
  createCount: (data) => {
    return axios.request({
      url: '/create/count',
      data: data,
      method: 'post'
    })
  }
}
