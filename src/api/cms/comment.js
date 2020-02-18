import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/bid-cms/comment/list',
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
    url: '/api/bid-cms/comment/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/bid-cms/comment/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}


export const update = (row) => {
  return request({
    url: '/api/bid-cms/comment/submit',
    method: 'post',
    data: row
  })
}

