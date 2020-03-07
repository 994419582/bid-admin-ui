import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/bid-soybean/usergroup/list',
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
    url: '/api/bid-soybean/usergroup/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/bid-soybean/usergroup/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/bid-soybean/usergroup/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/bid-soybean/usergroup/submit',
    method: 'post',
    data: row
  })
}

export const treeData = () => {
  return request({
    url: '/api/bid-soybean/group/tree/children',
    method: 'get'
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

export const selectUser = (id) => {
  return request({
    url: '/api/bid-soybean/usergroup/selectUser',
    method: 'get',
    params: {
      id,
    }
  })
}
