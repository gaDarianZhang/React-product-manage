import React, { Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {Layout} from 'antd'

import {reqGetProductCategories} from '../../request/requests'
import { createDeleteUserInfoAction } from '../../redux/actions/loginActions';
import Header from './header/header'
import Home from '../../components/admin/home/home'
import LeftNav from './leftNav/leftNav'
import Bar from './bar/bar'
import Category from './category/category'
import Line from './line/line'
import Pie from './pie/pie'
import Product from './product/product'
import Role from './role/role'
import User from './user/user'
import myAxios from '../../request/axiosInstance'
import './css/admin.less'
const { Footer, Sider, Content } = Layout;


@connect(
  state=>({
    userInfo:state.userInfo,
  }),
  {
    deleteUserInfoAction:createDeleteUserInfoAction
  }
)
class Admin extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    // console.log(collapsed);
    this.setState({ collapsed });
  };
  getProductCategories = async () =>{
    const result = await reqGetProductCategories();
    console.log(result);
  }
  render() {
    const {userInfo} = this.props;
    const { collapsed } = this.state;//////
    if (!userInfo.isLogin) {
      return <Redirect to="/login"></Redirect>
    }else{
      //仅仅是为了防止token被篡改或者过期的情况下，刷新页面也不能及时提醒登录过期。
      myAxios.get('/manage/role/list')
      return (
        <Layout className="admin">
          <Sider className="sider" collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
            <LeftNav menuCollapsed={collapsed}/>
          </Sider>
          <Layout>
            <Header/>
            <Content className="content">
              <Switch>
                <Route path="/admin/home" component={Home}/>
                <Route path="/admin/prod_about/category" component={Category}/>
                <Route path="/admin/prod_about/product" component={Product}/>
                <Route path="/admin/user" component={User}/>
                <Route path="/admin/role" component={Role}/>
                <Route path="/admin/charts/bar" component={Bar}/>
                <Route path="/admin/charts/line" component={Line}/>
                <Route path="/admin/charts/pie" component={Pie}/>
                <Redirect to="/admin/home"/>
              </Switch>
              {/* <button onClick={this.getProductCategories}>点击</button> */}
            </Content>
            <Footer className="footer">为了更好的体验，请选择谷歌浏览器</Footer>
          </Layout>
        </Layout>
      )
    }
  }
}

export default Admin;
