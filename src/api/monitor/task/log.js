import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/bid-quartz/joblog/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/bid-quartz/joblog/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/bid-quartz/joblog/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/bid-quartz/joblog/submit',
    method: 'post',
    data: row
  })
}

export const getJobLog = (id) => {
  return request({
    url: '/api/bid-quartz/joblog/detail',
    method: 'get',
    params: {
      id
    }
  })
}
