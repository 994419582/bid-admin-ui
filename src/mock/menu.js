import Mock from 'mockjs'

const top = [{
  label: "首页",
  path: "/wel/index",
  icon: 'el-icon-menu',
  meta: {
    i18n: 'dashboard',
  },
  parentId: 0
},
{
  label: "test1",
  path: "/wel/index2",
  icon: 'el-icon-menu',
  meta: {
    i18n: 'dashboard',
  },
  parentId: 0
  },
  {
    label: "test2",
    path: "/wel/index2",
    icon: 'el-icon-menu',
    meta: {
      i18n: 'dashboard',
    },
    parentId: 0
  },
  ]
export default ({mock}) => {
  if (!mock) return;
  Mock.mock('/user/getTopMenu', 'get', () => {
    return {
      data: top
    }
  })

}
