import React, { Component } from 'react'
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {connect} from 'react-redux'
import {createAction1,createAction2,createAction3} from '../../redux/actions/testActions'
import './css/login.less'
import logo from './images/logo.png'
// import store from '../../redux/store'


class Login extends Component {
  render() {
    return (
      <div className="login">
        <header>
          <img src={logo} alt="logo" />
          <h1>商品管理系统{this.props.testState}</h1>
        </header>
        <section>
          <h1>用户登录</h1>
          <NormalLoginForm actions={
            {
              action1:this.props.createAction1,
              action2:this.props.createAction2,
              action3:this.props.createAction3,
            }
          }/>
        </section>
      </div>
    )
  }
}
export default connect(
  state=>({
    testState: state.test
  }),
  {
    createAction1,
    createAction2,
    createAction3
  }
)(Login)

const NormalLoginForm = (props) => {//函数组件接受props
  // const {action1,action2,action3} = props.actions;//通过函数组件的props形参传递数据
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    // console.log(store.getState().test)//直接引入store来给函数组件传递数据
    // action1("action1"); 
    // action2("action2");
    // action3("action3",1000);
  };
  // const onChange = (event) =>{
  //   const target = event.target;
  //   console.log(target);
  //   if(target.id==="normal_login_username"){
  //     console.log("输入的用户名:",target.value);
  //   }else if (target.id==="normal_login_password") {
  //     console.log("输入的密码：",target.value);
  //   }

  // }
  const pwdValidator = (_,value)=>{
    // console.log(value);
    let message = "";
    if (!value) {
      message = "密码不能为空！"
    }else if (!(/^\w+$/).test(value)) {
      message = "密码只能包含数字、字母和下划线"
    }else if(value.length<6){
      message = "密码不能少于6个字符"
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
          // ({getFieldValue})=>({
          //   validator(_,value) {
          //     console.log(getFieldValue("password"));
          //     return Promise.resolve();
          //   },
          // })
        ]}
        // onChange = {onChange}//这是一种方法，但是使用antd集成的更好
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
        // onChange={onChange}
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

