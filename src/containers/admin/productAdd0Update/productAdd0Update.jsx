import React, { Component, Fragment } from 'react'
import {connect} from 'react-redux'
import {Form, Input, Card,Button, Select, message} from 'antd'
import {RollbackOutlined} from '@ant-design/icons'
import {reqGetProductCategories,reqAddOneProduct,reqOneProductInfo, reqUpdateOneProduct} from '../../../request/requests'
import PicturesWall from './picturesWall'
import RichTextEditor from './richTextEditor'

const {Option} = Select;

@connect(
  state=>({
    categoryList:state.categoryList,
    productInfo:state.productInfo,

  })
)
class ProductAdd0Update extends Component {
  state={
    categoryList:[],
    operationType:'add',
  }
  componentDidMount(){
    // 获取商品分类列表
    if (this.props.categoryList.length) this.setState({categoryList:this.props.categoryList})
    else this.getCategoryList();

    const {id} = this.props.match.params;
    if(id){
      this.setState({operationType:'update'});
      if (!this.props.productInfo) this.getProductInfo(id);
      else {
        // this.setState({productInfo:this.props.productInfo});
        const {name,desc,price,categoryId,imgs,detail} = this.props.productInfo;
        this.form.setFieldsValue({name,desc,price,categoryId});
        this.pictureWall.setPictures(imgs);
        this.richTextEditor.setRichText(detail);
      }
    }
  }

  getCategoryList=async()=>{
    let result = await reqGetProductCategories();
    const {status,data,msg} = result;
    if (status===0) this.setState({categoryList:data})
    else message.error(msg?msg:"获取商品分类列表失败",1);
  }
  getProductInfo=async(productId)=>{
    let result = await reqOneProductInfo(productId);
    const {status,data,msg} = result;
    if (status===0) {
      // this.setState({productInfo:data});
      const {name,desc,price,categoryId,imgs,detail} = data;
      this.form.setFieldsValue({name,desc,price,categoryId});
      this.pictureWall.setPictures(imgs);
      this.richTextEditor.setRichText(detail);
    }else{
      message.error(msg?msg:"请求商品出错",1);
    }
  }

  submitProduct = ()=>{
    this.form.validateFields()//拿数组作为参数的话，就是只验证指定item，不给参数的话，就是form内所有item
      .then(
        values=>{
          values.imgs = this.pictureWall.getPicturesName();
          values.detail = this.richTextEditor.getRichText();
          const {categoryId,name,desc,price,detail,imgs} = values;
          if (this.state.operationType==="add") return reqAddOneProduct(categoryId,name,desc,price,detail,imgs);
          else return reqUpdateOneProduct(categoryId,name,desc,price,detail,imgs,this.props.match.params.id);
        }
      )
      .then(
        result=>{
          const {status,msg} = result;
          if (status===0) this.props.history.goBack();
          else message.error(msg?msg:"数据提交失败",1);
        }
      )
      .catch(
        error=>{
          message.error("商品名称、描述、价格和分类为必填内容",1);
        }
      )
  }
  render() {
    const layout={
      labelCol: { md: 5 },
      wrapperCol: { md: 12 },
    }
    const {operationType} = this.state;
    
    return (
      <Card 
        title={
          <Fragment>
            <Button onClick={()=>{this.props.history.goBack()}}><RollbackOutlined /></Button>
            <span className="detailText">商品{operationType==='add'?"添加":"修改"}</span>
          </Fragment>
        }
      >
        <Form 
          {...layout} 
          name='addUpdateProduct'
          initialValues={{categoryId:''}}
          ref={form=>this.form=form}
        >
          <Form.Item
            label="商品名称"
            name="name"
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input placeholder='商品名称'/>
          </Form.Item>

          <Form.Item
            label="商品描述"
            name="desc"
            rules={[{ required: true, message: '请输入商品描述' }]}
          >
            <Input placeholder='商品描述'/>
          </Form.Item>

          <Form.Item
            label="商品价格"
            name="price"
            rules={[{ required: true, message: '请输入商品价格' }]}
          >
            <Input type="number" prefix="￥" placeholder='商品价格' addonAfter="元"/>
          </Form.Item>

          <Form.Item
            label="商品分类"
            name="categoryId"
            rules={[{ required: true, message: '请选择商品分类' }]}
          >
            <Select>
            <Option value="">请选择商品分类</Option>
              {
                this.state.categoryList.map((item)=>{
                  return(
                    <Option value={item._id} key={item._id}>{item.name}</Option>
                  )
                })
              }
            </Select>
          </Form.Item>

          <Form.Item
            label="商品图片"
            name="imgs"
          >
            <PicturesWall ref={pictures=>this.pictureWall=pictures}/>
          </Form.Item>

          <Form.Item
            label="商品详情"
            name="detail"
            wrapperCol={{md:15}}
          >
            <RichTextEditor ref={richTextEditor=>this.richTextEditor=richTextEditor}/>
          </Form.Item>

          <Button type="primary" htmlType="submit" onClick={this.submitProduct}>提交</Button>
        </Form>
      </Card>
    )
  }
}

export default  ProductAdd0Update