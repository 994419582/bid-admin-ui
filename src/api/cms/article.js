import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/bid-cms/article/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getCateGoryTree = () => {
  return request({
    url: '/api/bid-cms/category/tree',
    method: 'get',
    params:{
      module: '0'
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/bid-cms/article/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {

  return request({
    url: '/api/bid-cms/article/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  row.posid=row.posid.toString()
  row.content=escape(row.content)
  return request({
    url: '/api/bid-cms/article/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  row.posid=row.posid.toString()
  row.content=escape(row.content)
  return request({
    url: '/api/bid-cms/article/submit',
    method: 'post',
    data: row
  })
}

