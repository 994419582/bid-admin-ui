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

export const getChildren = (id) => {
  return request({
    url: '/api/bid-soybean/group/children',
    method: 'get',
    params: {
      id,
    }
  })
}

export const getParentGroupDic = (id) => {
  return request({
    url: '/api/bid-soybean/group/select/noOneself',
    method: 'get',
    params: {
      id,
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

export const treeData = () => {
  // row = {...row, managers: row.managers.join(',')}
  return request({
    url: '/api/bid-soybean/group/tree/children',
    method: 'get'
  })
}


