
import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import {Menu} from 'antd'
import menuConfig from '../../../config/menu_config'
import {createSaveTitleAction} from '../../../redux/actions/menuActions.js'
import logo from '../../../static/images/logo.png'
import './leftNav.less'

const {SubMenu} = Menu;

// 把导航栏title维护到redux中去
@connect(
  state=>({
    menus:state.userInfo.user.role.menus,
    username:state.userInfo.user.username
  }),
  {
    saveTitle:createSaveTitleAction
  }
)
@withRouter
class LeftNav extends Component {

  componentDidMount(){
    let pathnameList = this.props.location.pathname.split('/').slice(1,);
    let pathKey = pathnameList.length>=3?pathnameList[2]:pathnameList[1];

    // let pathKey = this.props.location.pathname.split('/').pop();
    let title = "";
    menuConfig.forEach(item => {
      if (item.children instanceof Array) {
        let tmp = item.children.find((citem)=>{
          return citem.key===pathKey;
        });
        if (tmp) {
          title = tmp.title;          
        }
      }else{
        if (item.key===pathKey) {
          title = item.title;
        }
      }
    });
    // this.setState({menuTitle:title})
    this.props.saveTitle(title)
  }
  // 判断用户是否拥有某项菜单的权限
  // hasAuth=(item)=>{//item是一项菜单，返回true表示保留该项菜单
  //   if (this.props.username==='admin') {
  //     return true;
  //   }else{
  //     return this.props.menus.find(item1=>item1===item.key)
  //   }
  // }
  //用于生成菜单项
  createMenu = (menuList)=>{
    const {username,menus} = this.props;
    return menuList.map((item)=>{
      if (!item.children) {
        if ((username==='admin')||menus.find(item1=>item1===item.key)) {
          return(
            <Menu.Item key={item.key} icon={item.icon} onClick={()=>{this.props.saveTitle(item.title)}}>
              <Link to={item.to}>
                {item.title}
              </Link>
            </Menu.Item>
          )
        }else return null
      }else{
        if ((username==='admin')||item.children.some(item2=>menus.indexOf(item2.key)!==-1)) {
          return(
            <SubMenu key={item.key} icon={item.icon} title={item.title}>
              {this.createMenu(item.children)}
            </SubMenu>
          )
        }else return null
      }
    })
  }

  render() { 
    let pathnameList = this.props.location.pathname.split('/').slice(1,);
    let pathnameListforMenu = pathnameList.length>=3?pathnameList.slice(0,3):pathnameList;
    return (
      <div>
        <div className="leftnav-header">
          <img src={logo} alt="logo" />
          {this.props.menuCollapsed?"":<h1>商品管理系统</h1>}
        </div>
        <Menu
          // defaultSelectedKeys={['home']}
          defaultSelectedKeys={pathnameListforMenu.slice(-1,)}
          defaultOpenKeys={pathnameListforMenu.slice(1,2)}
          // defaultSelectedKeys={this.props.location.pathname.split('/').pop()}
          // defaultOpenKeys={this.props.location.pathname.split('/').slice(2,)}
          mode="inline"
          theme="dark"
          multiple={false}
        >
          {this.createMenu(menuConfig)}
          

        </Menu>
      </div>
    )
  }
}

export default LeftNav