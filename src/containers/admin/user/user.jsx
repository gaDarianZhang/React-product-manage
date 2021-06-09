import React, { Component, Fragment } from 'react'
import {Card, Table, Button, Form, Input, Modal, message, Select} from 'antd'
import {PlusCircleOutlined, CloseSquareOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import {reqUserList,reqAddOneUser,reqUpdateOneUser,reqDeleteOneUser} from '../../../request/requests'
const {Option} = Select;
export default class User extends Component {

  state={
    userList:[],
    roleList:[],
    isShow:false,
    operType:'add',
    _id:''
  }
  componentDidMount(){
    this.getUserList();
  }
  // 获取用户列表
  getUserList=async()=>{
    let result = await reqUserList();
    const {status,data,msg} = result;
    if (status===0) this.setState({userList:data.users.reverse(),roleList:data.roles});
    else message.error(msg?msg:'请求用户列表失败',1);
  }
  // 发送请求添加新用户
  addOneUser=async(user)=>{
    let result = await reqAddOneUser(user);
    const {status,data,msg} = result;
    if (status===0) {
      message.success('添加用户成功',1);
      this.userForm.resetFields();
      let userList=[data,...this.state.userList];
      this.setState({isShow:false,userList});
    } else{
      message.error(msg?msg:"添加用户失败",1);
    }
  }
  // 发送请求修改用户信息
  updateOneUser=async(_id,username,phone,email,role_id)=>{
    let result = await reqUpdateOneUser(_id,username,phone,email,role_id);
    const {status,msg} = result;
    if (status===0) {
      message.success('修改用户成功',1);
      this.userForm.resetFields();
      this.getUserList();
      this.setState({isShow:false});
    } else{
      message.error(msg?msg:"修改用户信息失败",1);
    }
  }
  // 展示待修改用户信息
  showInfoForUpdate=(user)=>{
    // console.log(user);
    const {_id,username,phone,email,role_id} = user;
    this.setState({isShow:true,operType:'update',_id},()=>{
      this.userForm.setFieldsValue({username,password:'123123',phone,email,role_id});
    });
    // this.pwd.disabled=true;
  }
  deleteOneUser=async(userId)=>{
    let result = await reqDeleteOneUser(userId);
    const {status,msg} = result;
    if (status===0) {
      message.success("删除用户成功",1);
      this.getUserList();
    }else{
      message.error(msg?msg:"删除用户失败",1);
    }
  }
  // 添加或修改用户信息的弹出框的确认按钮回调
  addUpdateUser=()=>{
    this.userForm.validateFields()
      .then(
        value=>{
          // console.log(value);
          const {username,phone,email,role_id} = value;
          if (this.state.operType==='add') this.addOneUser(value);
          else this.updateOneUser(this.state._id,username,phone,email,role_id)
        }
      )
      .catch(
        reason=>{
          message.error("请按要求填入各项内容",1)
        }
      )
  }
  // 添加或修改用户信息的弹出框的取消按钮回调
  closeModal=()=>{
    this.userForm.resetFields();
    this.setState({isShow:false});
  }
  pwdValidator=(_,value)=>{
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
  render() {
    const {roleList,userList,isShow,operType} = this.state;
    const dataSource=userList;
    const columns=[
      {
        title:'用户名',
        dataIndex:'username',
        key:'username',
        align:'center',
      },
      {
        title:'邮箱',
        dataIndex:'email',
        key:'email',
        align:'center',
      },
      {
        title:'电话',
        dataIndex:'phone',
        key:'phone',
        align:'center',
      },
      {
        title:'注册时间',
        dataIndex:'create_time',
        key:'create_time',
        align:'center',
        render:(time)=>dayjs(time).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title:'所属角色',
        dataIndex:'role_id',
        key:'role_id',
        align:'center',
        render:roleId=>roleList.find(item=>item._id===roleId).name
      },
      {
        title:'操作',
        key:'operation',
        align:'center',
        render:(user)=><Fragment>
            <Button type='link' onClick={()=>this.showInfoForUpdate(user)}>修改</Button>
            <Button type='link' onClick={()=>this.deleteOneUser(user._id)}>删除</Button>
          </Fragment>
      },
    ]
    return (
      <Fragment>
        <Card
          title={<Button type='primary' onClick={()=>this.setState({isShow:true,operType:'add'})}><PlusCircleOutlined />添加用户</Button>}
        >
          <Table
            bordered
            dataSource={dataSource}
            columns={columns}
            rowKey="_id"
          />
        </Card>
        <Modal 
          title="添加用户"
          visible={isShow}
          onOk={this.addUpdateUser}
          onCancel={this.closeModal}
          okText='确定'
          cancelText='取消'
          closeIcon={<CloseSquareOutlined />}
        >
          <Form
            name="user" 
            initialValues={{role_id:''}}
            labelCol={{md:5}}
            wrapperCol={{md:15}}
            ref={user=>this.userForm=user}
          >
            <Form.Item
              label="用户名"
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
              <Input placeholder='请输入用户名'/>
            </Form.Item>
            <Form.Item 
              label="密码"
              name='password'
              rules={[
                {validator:this.pwdValidator},
                {required:true,message:''}
              ]}
              hidden={operType==='update'}
            >
              <Input placeholder='请输入密码' />
            </Form.Item>
            <Form.Item
              label="手机号"
              name='phone'
              rules={[
                {required:true,message:'手机号不能为空'}
              ]}
            >
              <Input placeholder='请输入手机号'/>
            </Form.Item>
            <Form.Item
              label="邮箱"
              name='email'
              rules={[
                {required:true,message:'邮箱不能为空'}
              ]}
            >
              <Input placeholder='请输入邮箱'/>
            </Form.Item>
            <Form.Item
              label="角色"
              name='role_id'
              rules={[
                {required:true,message:'邮箱不能为空'}
              ]}
            >
              <Select>
                <Option value=''>请选择一个角色</Option>
                {
                  roleList.map(item=>{
                    return <Option value={item._id} key={item._id}>{item.name}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    )
  }
}
