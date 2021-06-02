import {
  HomeOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  CodeSandboxOutlined,
  UsergroupAddOutlined,
  TrademarkCircleOutlined,
  RadarChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
//项目的菜单配置
export default[
  {
    title: '首页', // 菜单标题名称
    key: 'home', // 对应的to
    icon: <HomeOutlined/>, // 图标名称
    to: '/admin/home'//对应路径
  },

  {
    title: '商品',
    key: 'prod_about',
    icon: <AppstoreOutlined/>,
    children: [ // 子菜单列表
      {
        title: '分类管理',
        key: 'category',
        icon: <UnorderedListOutlined/>,
        to: '/admin/prod_about/category'
      },
      {
        title: '商品管理',
        key: 'product',
        icon: <CodeSandboxOutlined/>,
        to: '/admin/prod_about/product'
      },
    ]
  },

  {
    title: '用户管理',
    key: 'user',
    icon: <UsergroupAddOutlined/>,
    to: '/admin/user'
  },

  {
    title: '角色管理',
    key: 'role',
    icon: <TrademarkCircleOutlined/>,
    to: '/admin/role'
  },

  {
    title: '图形图表',
    key: 'charts',
    icon: <RadarChartOutlined/>,
    children: [
      {
        title: '柱形图',
        key: 'bar',
        icon: <BarChartOutlined/>,
        to: '/admin/charts/bar'
      },
      {
        title: '折线图',
        key: 'line',
        icon: <LineChartOutlined/>,
        to: '/admin/charts/line'
      },
      {
        title: '饼图',
        key:  'pie',
        icon: <PieChartOutlined/>,
        to: '/admin/charts/pie'
      },
    ]
  },
]
