
import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import {Menu} from 'antd'
import menuConfig from '../../../config/menu_config'
import logo from '../../../static/images/logo.png'
import './leftNav.less'

const {SubMenu} = Menu;

@withRouter
class LeftNav extends Component {

  //用于生成菜单项
  createMenu = (menuList)=>{
    return menuList.map((item)=>{
      if (!item.children) {
        return(
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.to}>
              {item.title}
            </Link>
          </Menu.Item>
        )
      }else{
        return(
          <SubMenu key={item.key} icon={item.icon} title={item.title}>
            {this.createMenu(item.children)}
          </SubMenu>
        )
      }
    })
  }

  render() { 
    console.log(this.props.location);
    return (
      <div>
        <div className="leftnav-header">
          <img src={logo} alt="logo" />
          {this.props.menuCollapsed?"":<h1>商品管理系统</h1>}
        </div>
        <Menu
          // defaultSelectedKeys={['home']}
          defaultSelectedKeys={this.props.location.pathname.split('/').pop()}
          defaultOpenKeys={this.props.location.pathname.split('/').slice(2)}
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