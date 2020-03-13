import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/bid-soybean/group/tree/children',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getTree = (current, size, params) => {
  return request({
    url: '/api/bid-soybean/group/tree/top',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/bid-soybean/group/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const getUserDict = () => {
  return request({
    url: '/api/bid-soybean/user/select?name=',
    method: 'get',
    params: {
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/bid-soybean/group/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/bid-soybean/group/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/bid-soybean/group/submit',
    method: 'post',
    data: row
  })
}

export const updateManager = (row) => {
  return request({
    url: '/api/bid-soybean/group/updateManager',
    method: 'post',
    data: row
  })
}

