import React, { Component, Fragment } from 'react'
import {connect} from 'react-redux'
import {Card,Button,Table, message, Modal, Form, Input} from 'antd'
import {PlusCircleOutlined, CloseSquareOutlined} from '@ant-design/icons'
import {reqGetProductCategories,reqAddCategory, reqUpdateCategory} from '../../../request/requests'
import {createSaveCategoryListAction} from '../../../redux/actions/categoryActions'
import {PAGE_SIZE} from '../../../config/config'

// 拿到的商品分类数据格式：
// name: "智能手机"
// __v: 0
// _id: "5dccd15af495734150be910e"
@connect(
  state=>({

  }),
  {
    saveCategoryList:createSaveCategoryListAction
  }
)
class Category extends Component {

  state = {
    categoryInfo:[],
    isModalVisible:false,
    operationType:"",//用于表明弹出的对话框是用于新增数据还是修改数据
    chosedCategoryInfo:{}//用于保存将要修改的这个分类信息
  }

  componentDidMount(){
    // 挂载时就开始请求数据
    this.getCategoryInfo();
  }

  getCategoryInfo = async()=>{
    let result = await reqGetProductCategories();
    let {status,data,msg} = result;
    if (status===0) {
      this.setState({categoryInfo:data.reverse()});
      // console.log(data);
      this.props.saveCategoryList(data);
    }else{
      message.error(msg,1);
    }
  }

  showModal = (event,oneCategoryInfo) => {
    let operationType = event.target.innerText==="新增"?"add":"update";
    this.setState(()=>({isModalVisible:true,operationType,chosedCategoryInfo:oneCategoryInfo}),()=>{
      /* 
      !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      在这个回调中，以保证Modal真正显示，因为只有Modal显示后Modal内的子元素才被创建。默认Modal再关闭后内部元素不会被销毁，
      但是可以设置当Modal关闭后内部元素被销毁。
      */
      if(operationType==="update") this.inp.setFieldsValue({category:oneCategoryInfo.name})

    })

  };

  handleOk = () => {
    // console.log(this.inp);
    this.inp.validateFields(["category"])//统一处理表单内的验证情况
      .then(
        value=>{
          if (this.state.operationType==="add"){
            this.todoAdd(value.category);
          }   
          else if (this.state.operationType==='update') {
            this.todoUpdate(this.state.chosedCategoryInfo._id,value.category)
          }
        },
        reason=>{
          message.error("必须输入商品种类",1);
        }
      )
  };

  handleCancel = () => {
    this.setState({isModalVisible:false});
    this.inp.resetFields();//会引起整个field的重新挂载
  };

  todoAdd = async (categoryName)=>{
    let result = await reqAddCategory(categoryName);
    let {status,msg} = result;
    if (status === 0) {
      message.success("添加数据成功",1);
      this.getCategoryInfo();
      this.setState({isModalVisible:false})
      this.inp.resetFields();
    }else if (status===1) {
      message.error(msg,1);
    }
  }
  todoUpdate = async(id,categoryName)=>{
    let {status,msg} = await reqUpdateCategory(id,categoryName);
    if (status===0) {
      message.success("商品种类更新成功",1);
      this.getCategoryInfo();
      this.setState({isModalVisible:false})
      this.inp.resetFields();
    }else if (status===1) {
      message.error(msg,1)
    }
  }

  render() {
    const dataSource = this.state.categoryInfo;
    const {isModalVisible,operationType} = this.state;
    const columns = [
      {
        title: '分类名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        width: "30%",
        /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          标识该列显示什么数据，和dataSource中的一种数据属性对应。
          如果同时出现了render，就显示render内容。而且如果写了dataIndex，
          虽然会被render覆盖，但render回调的参数就是所在行的dataIndex所对应的数据。
          如果没有dataIndex，那么回调的参数就是改行的所有数据
        */
        // dataIndex: "name",
        key: 'operation',
        align:"center",
        /* 
          !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          render向该列中添加统一添加内容
        */
        render:(oneCategoryInfo)=>{
          // console.log(a);
          return <Button type="link" onClick={(event)=>{this.showModal(event,oneCategoryInfo)}}>修改分类</Button>
        }
      },
    ];
    return (
      <Fragment>
        <Card 
          size="small" 
          title="商品分类信息" 
          extra={
            <Button type="primary" onClick={(event)=>{this.showModal(event,{})}}>
              <PlusCircleOutlined />新增
            </Button>
          }
        >
          <Table 
            dataSource={dataSource} 
            columns={columns} 
            bordered={true} 
            rowKey="_id" //dataSource中的“_id”属性作为代替“key”属性，默认是“key”属性
            pagination={{pageSize:PAGE_SIZE,showQuickJumper:true}}
          />
        </Card>
        <Modal 
          title={operationType==="add"?"添加商品分类":"修改商品分类"}
          visible={isModalVisible} 
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确定"
          cancelText="取消"
          closeIcon={<CloseSquareOutlined />}
        >
          <Form
            name="product"
            className="product-Category-form"
            /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            initialValues	表单默认值，只有初始化以及重置时生效	object
            你不能用控件的 value 或 defaultValue 等属性来设置表单域的值，默认值可以用 Form 里的 initialValues 来设置。
            注意 initialValues 不能被 setState 动态更新，你需要用 setFieldsValue 来更新。
            */
            // initialValues={{ category: "sad"}}
            ref={
              input=>{
                this.inp=input;
                // console.log("被创建");
              }
            }
          >
            <Form.Item
              name="category"
              rules={[{ required: true, message: '必须输入商品种类' }]}
            >
              <Input placeholder="请输入商品种类" />
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    )
  }
}

export default Category