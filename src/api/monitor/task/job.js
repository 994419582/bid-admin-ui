import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/bid-quartz/job/list',
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
    url: '/api/bid-quartz/job/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/bid-quartz/job/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/bid-quartz/job/submit',
    method: 'post',
    data: row
  })
}

export const getJob = (id) => {
  return request({
    url: '/api/bid-quartz/job/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const check = (cronExpression) => {
  return request({
    url: '/api/bid-quartz/job/checkCronExpressionIsValid',
    method: 'post',
    params: {
      cronExpression
    }
  })
}

export const changeStatus = (ids) => {
  return request({
    url: '/api/bid-quartz/job/changeStatus',
    method: 'post',
    params: {
      ids
    }
  })
}

export const run = (ids) => {
  return request({
    url: '/api/bid-quartz/job/run',
    method: 'post',
    params: {
      ids
    }
  })
}

