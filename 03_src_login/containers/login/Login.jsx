import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {connect} from 'react-redux'
import {createSaveUserInfoAction} from '../../redux/actions/loginActions'
import {reqLogin} from '../../request/requests'
import './css/login.less'
import logo from './images/logo.png'


class Login extends Component {
  render() {
    
    if (this.props.isLogin) {
      return <Redirect to="/admin"/>
    }
    return (
      <div className="login">
        <header>
          <img src={logo} alt="logo" />
          <h1>商品管理系统</h1>
        </header>
        <section>
          <h1>用户登录</h1>
          <NormalLoginForm 
            actions={
              {
                saveUserInfoAction:this.props.saveUserInfoAction
              }
            }
            history={this.props.history}
          />
        </section>
      </div>
    )
  }
}
export default connect(
  state=>({
    isLogin:state.userInfo.isLogin
  }),
  {
    saveUserInfoAction:createSaveUserInfoAction
  }
)(Login)

const NormalLoginForm = (props) => {//函数组件接受props
  const {history,actions} = props;
  const {saveUserInfoAction} = actions;//通过函数组件的props形参传递数据
  const onFinish = async (values) => {// 加上async为了能使用await
    const {username,password} = values;
    // #
    // reqLogin(username,password)
    //   .then(result=>{
    //     if (result.data.status===0) {
    //       console.log(result);
    //     }else{
    //       message.error(result.data.msg)
    //     }
    //   })
    //   .catch(reason=>{//请求失败，登录信息错误的话服务器也会返回内容的
    //     console.log(reason);
    //   })
    // #

    // await只能接受成功的promise，为了处理失败的promise是需要使用try。。catch，
    // 这里是因为使用了响应拦截器提前处理了失败。
    const result = await reqLogin(username,password);
    const {status,msg,data} = result;
    if (status === 0) {
      // 登录成功
      console.log("登录成功",data);
      // 把登录成功拿到的数据存到store中
      saveUserInfoAction(data);
      // 跳转到admin页面
      history.replace("/admin");

    }else {
      message.warning(msg,1);
    }
  };

  const pwdValidator = (_,value)=>{
    let message = "";
    if (!value) {
      message = "密码不能为空！"
    }else if (!(/^\w+$/).test(value)) {
      message = "密码只能包含数字、字母和下划线"
    }else if(value.length<4){
      message = "密码不能少于4个字符"
    }else if(value.length>12){
      message = "密码不能超过12个字符"
    }else{
      message = "ok"
    }
    return message==="ok"?Promise.resolve():Promise.reject(message);
  }
  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: '用户名不能为空！',
          },
          {
            max:12,
            message: '用户名不能超过12个字符'
          },
          {
            min:4,
            message:'不能少于4个字符',
          },
          {
            pattern: /^\w+$/,
            message:'用户名只能包括数字、字母和下划线'
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} 
          placeholder="Username" 
        />
      </Form.Item>


      <Form.Item
        name="password"
        rules={[
          {
            validator: pwdValidator,
          }
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>


      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="/#">
          Forgot password
        </a>
      </Form.Item>


      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button" block>
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};

