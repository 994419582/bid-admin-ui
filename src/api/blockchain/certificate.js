import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/bid-blockchain/certificate/list',
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
    url: '/api/bid-blockchain/certificate/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/bid-blockchain/certificate/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/bid-blockchain/certificate/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/bid-blockchain/certificate/submit',
    method: 'post',
    data: row
  })
}

export const registerCertificate = (row) => {
  return request({
    url: '/api/bid-blockchain/certificate/registerCertificate',
    method: 'get',
    data: row
  })
}

export const revocedCertificate = (bid) => {
  return request({
    url: '/api/bid-blockchain/certificate/revocedCertificate',
    method: 'get',
    params: {
      bid
    }
  })
}

