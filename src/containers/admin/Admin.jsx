import React, { Component} from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import { createDeleteUserInfoAction } from '../../redux/actions/loginActions';

class Admin extends Component {
  logout = ()=>{
    this.props.deleteUserInfoAction();
  }
  render() {
    console.log(this);
    const {userInfo} = this.props;
    if (!userInfo.isLogin) {
      return <Redirect to="/login"></Redirect>
    }else{
      return (
        <div>
          欢迎用户{this.props.userInfo.user.username}来到Admin界面
          <button onClick={this.logout}>点击退出登录</button>
        </div>
      )
    }
  }
}

export default connect(
  state=>({
    userInfo:state.userInfo
  }),
  {
    deleteUserInfoAction:createDeleteUserInfoAction
  }
)(Admin)
