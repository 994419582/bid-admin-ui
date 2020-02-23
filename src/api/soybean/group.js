import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/bid-soybean/group/list',
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
  // row = {...row, managers: row.managers.join(',')}
  return request({
    url: '/api/bid-soybean/group/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  // row = {...row, managers: row.managers.join(',')}
  return request({
    url: '/api/bid-soybean/group/submit',
    method: 'post',
    data: row
  })
}
