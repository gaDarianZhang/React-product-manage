import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {Button, Popconfirm} from 'antd'
import {FullscreenOutlined, FullscreenExitOutlined} from '@ant-design/icons'
import screenfull from 'screenfull'
import dayjs from 'dayjs'
import {createDeleteUserInfoAction} from '../../../redux/actions/loginActions'
import {reqGetWeather} from '../../../request/requests'
import menuConfig from '../../../config/menu_config.js'
import './css/header.less'

@connect(
  state=>({
    userInfo:state.userInfo,
    date:dayjs().format('YYYY-MM-DD HH:mm:ss'),
    menuTitle:state.menuTitle
  }),
  {
    deleteUserInfoAction:createDeleteUserInfoAction
  }
)
@withRouter
class Header extends Component {
  
  state = {
    isFullScreen:false,
    weather:{},
    menuTitle:""
  }


  componentDidMount(){
    // 监听全屏是否发生变化，包括esc退出全屏。但不包括f11全屏
    screenfull.on('change',()=>{
      let isFullScreen = !this.state.isFullScreen
      this.setState({isFullScreen})
    })
    // 启动定时器更新时间
    this.timerID = setInterval(()=>{
      this.setState({date:dayjs().format('YYYY-MM-DD HH:mm:ss')})
    },500)
    this.getWeather();
    // this.setTitle();
  }

  componentWillUnmount(){
    clearInterval(this.timerID)
  }

  fullScreen = ()=>{
    screenfull.toggle();
  }
  // 退出登录
  logout = ()=>{
    this.props.deleteUserInfoAction();
  }
  // 获取天气数据
  getWeather = async()=>{
    let weather = await reqGetWeather();
    this.setState({weather})
  }

  //使用路由地址匹配title
  setTitle = ()=>{
    let pathKey = this.props.location.pathname.split('/').pop();
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
    this.setState({menuTitle:title})
  }

  render() {
    const {wea,tem1,tem2} = this.state.weather;
    
    return (
      <div className="header">
        <div className="header-top">
          <Button size="small" onClick={this.fullScreen}>
            {this.state.isFullScreen?<FullscreenExitOutlined />:<FullscreenOutlined />}
          </Button>
          <span className="username">欢迎{this.props.userInfo.user.username}</span>
          {/* <Button type="link" size="small" onClick={this.logout}>退出登录</Button> */}
          <Popconfirm placement="bottomRight" title={"确定要退出登录吗？"} onConfirm={this.logout} okText="确认" cancelText="取消">
            <Button type="link" size="small">退出登录</Button>
          </Popconfirm>
        </div>
        <div className="header-bottom">
          <div className="left">
            {/* {this.state.menuTitle||this.props.menuTitle} */}
            {this.props.menuTitle}
          </div>
          <div className="right">
            {this.state.date}
            <img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="天气" />
            {wea}&nbsp;&nbsp;&nbsp;温度:{tem2}~{tem1}
          </div>
        </div>
      </div>
    )
  }
}

export default Header;
