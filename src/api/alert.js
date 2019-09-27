import axios from '@/libs/api.request'

export default {
  getLogList: (data) => {
    return axios.request({
      url: '/logInfo/list',
      data: data,
      method: 'post'
    })
  },
  checkLog: (data) => {
    return axios.request({
      // withCredentials: true,
      url: '/logInfo/check',
      data: data,
      method: 'post'
    })
  },
  solveLog: (data) => {
    return axios.request({
      url: '/logInfo/solve',
      data: data,
      method: 'post'
    })
  },
  finishLog: (data) => {
    return axios.request({
      url: '/logInfo/close',
      data: data,
      method: 'post'
    })
  },
  resumeLog: (data) => {
    return axios.request({
      url: '/logInfo/resume',
      data: data,
      method: 'post'
    })
  },
  getLogDetail: (data) => {
    return axios.request({
      url: '/logInfo/detail',
      data: data,
      method: 'post'
    })
  },
  getLogRecord: (data) => {
    return axios.request({
      url: '/handleRecord',
      data: data,
      method: 'post'
    })
  },
  batchClosure: (data) =>{
    return axios.request({
      url: '/batch_closure',
      data: data,
      method: 'post'
    })
  },
  batchNotAlert: (data) =>{
    return axios.request({
      url: '/batch_not_alert',
      data: data,
      method: 'post'
    })
  }
}
