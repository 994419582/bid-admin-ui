import request from '@/router/axios';
import {baseUrl} from '@/config/env';

export const loginByUsername = (tenantId, account, password, type) => request({
  url: '/api/bid-auth/token',
  method: 'post',
  params: {
    tenantId,
    account,
    password,
    type
  }
})

export const getButtons = () => request({
  url: '/api/bid-system/menu/buttons',
  method: 'get'
});

export const getUserInfo = () => request({
  url: baseUrl + '/user/getUserInfo',
  method: 'get'
});

export const refeshToken = () => request({
  url: baseUrl + '/user/refesh',
  method: 'post'
})

export const getMenu = (parentId = '') => request({
  url: '/api/bid-system/menu/routes',
  method: 'get',
  params: {
    parentId
  }
});

// export const getTopMenu = () => request({
//   url: baseUrl + '/user/getTopMenu',
//   method: 'get'
// });
export const getTopMenu = () => request({
  url: baseUrl + '/api/bid-system/menu/top-routes',
  method: 'get'
});

export const sendLogs = (list) => request({
  url: baseUrl + '/user/logout',
  method: 'post',
  data: list
})

export const logout = () => request({
  url: baseUrl + '/user/logout',
  method: 'get'
})
