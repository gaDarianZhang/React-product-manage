import React, { Component, Fragment } from 'react'
import {connect} from 'react-redux'
import {Card,Button,Table, Modal,Form, Input, Tree, message} from 'antd'
import {PlusCircleOutlined,CloseSquareOutlined} from '@ant-design/icons'
import dayjs from 'dayjs'
import {reqRoleList,reqAddOneRole,reqSetRoleAuth} from '../../../request/requests'
import menuConfig from '../../../config/menu_config'

@connect(
  state=>({
    username:state.userInfo.user.username
  })
)
class Role extends Component {

  state={
    isShowAdd:false,
    isShowAuth:false,
    roleList:[],
    checkedKeys:[],
    menuConfig:[{title:'平台功能',key:'top',children:menuConfig}],
    _id:''//设置权限的角色id
  }
  componentDidMount(){
    this.getRoleList();
  }
  // 请求获取角色列表
  getRoleList=async()=>{
    let result = await reqRoleList();
    const {status,data,msg} = result;
    if(status===0) this.setState({roleList:data.reverse()});
    else message.error(msg?msg:'获取角色列表失败',1);
  }
  // 新增角色确认
  addRole=()=>{
    this.roleInp.validateFields(["newRole"])
      .then(
        values=>{
          const newRole = values.newRole;
          return reqAddOneRole(newRole);
        }
      )
      .then(
        result=>{
          const {status,data,msg} = result;
          if (status===0) {
            let roleList = [...this.state.roleList];
            roleList.unshift(data);
            this.setState({roleList,isShowAdd:false});
            this.roleInp.resetFields();
          }else{
            message.error(msg?msg:'添加角色失败',1);
          }
        }
      )
      .catch(
        reason=>{
          message.error('添加角色失败',1);
        }
      )
  }
  // 新增角色取消
  closeAddRole=()=>{
    this.roleInp.resetFields();
    this.setState({isShowAdd:false});
  }
  // 设置授权确认
  setAuth=async()=>{
    const {_id,checkedKeys} = this.state;
    let result = await reqSetRoleAuth(_id,checkedKeys,this.props.username);
    const {status,msg} = result;
    if (status===0) {
      message.success("权限设置成功",1);
      this.setState({isShowAuth:false});
      this.getRoleList();//更新角色信息
    }else{
      message.error(msg?msg:"权限设置失败",1);
    }
  }
  // 设置授权取消
  closeSetAuth=()=>{
    this.setState({isShowAuth:false});
    // console.log("关闭设置权限");
  }


  onCheck = (checkedKeys) => {
    this.setState({checkedKeys});
  };

  render() {
    const dataSource=this.state.roleList;
    const columns=[
      {
        title:'角色名称',
        dataIndex:'name',
        key:'name',
        align:'center',
      },
      {
        title:'创建时间',
        dataIndex:'create_time',
        key:'create_time',
        align:'center',
        render:(createTime)=>dayjs(createTime).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        title:'授权时间',
        dataIndex:'auth_time',
        key:'auth_time',
        align:'center',
        render:(authTime)=>authTime?dayjs(authTime).format('YYYY-MM-DD HH:mm:ss'):''
      },
      {
        title:'授权人',
        dataIndex:'auth_name',
        key:'auth_name',
        align:'center',
      },
      {
        title:'操作',
        // dataIndex:'auth_name',
        align:'center',
        key:'option',
        render:(data)=><Button type='link' onClick={()=>{this.setState({isShowAuth:true,checkedKeys:data.menus,_id:data._id})}}>设置权限</Button>
      },
    ];
    // tree data
    const treeData = this.state.menuConfig;
    return (
      <Fragment>
        <Card title={<Button type='primary' onClick={()=>{this.setState({isShowAdd:true})}}><PlusCircleOutlined />新增角色</Button>}>
          <Table
            bordered
            dataSource={dataSource}
            columns={columns}
            rowKey="_id"
          />
        </Card>
        <Modal 
          title="新增角色"
          visible={this.state.isShowAdd}
          onOk={this.addRole}
          onCancel={this.closeAddRole}
          okText='确定'
          cancelText="取消"
          closeIcon={<CloseSquareOutlined />}
        >
          <Form
            name="addRole"
            ref={role=>this.roleInp=role}
          >
            <Form.Item
              name='newRole'
              rules={[{required:true,message:'必须输入角色名'}]}
            >
              <Input placeholder='请输入新的角色名'/>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="设置权限"
          visible={this.state.isShowAuth}
          onOk={this.setAuth}
          onCancel={this.closeSetAuth}
          okText='确定'
          cancelText="取消"
          closeIcon={<CloseSquareOutlined />}
        >
          <Tree
            checkable
            defaultExpandAll
            onExpand={this.onExpand}
            onCheck={this.onCheck}
            checkedKeys={this.state.checkedKeys}
            treeData={treeData}
          />
        </Modal>
      </Fragment>
    )
  }
}
export default Role;