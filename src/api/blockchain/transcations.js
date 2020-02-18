import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/bid-blockchain/transcations/list',
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
    url: '/api/bid-blockchain/transcations/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/bid-blockchain/transcations/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/bid-blockchain/transcations/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/bid-blockchain/transcations/submit',
    method: 'post',
    data: row
  })
}

