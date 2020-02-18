import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/bid-cms/category/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
export const getStats = (params) => {
  return request({
    url: '/api/bid-cms/category/stats',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/bid-cms/category/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/bid-cms/category/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/bid-cms/category/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/bid-cms/category/submit',
    method: 'post',
    data: row
  })
}

