import React, { Component, Fragment } from 'react'
import {connect} from 'react-redux'
import {Card,Button,List, message} from 'antd'
import {RollbackOutlined} from '@ant-design/icons'
import {reqOneProductInfo,reqCategoryInfo} from '../../../request/requests'
import {BASE_URL} from '../../../config/config'
import './productDetail.less'

@connect(
  state=>({
    productInfo:state.productInfo
  }),
  {}
)
class ProductDetail extends Component {
  state={
    name:'',
    desc:'',
    price:0,
    detail:'',
    imgs:[],
    categoryId:'',
    categoryName:'',
    isLoading:true
  }
  componentDidMount(){
    
    if (!this.props.productInfo) this.getProductInfo(this.props.match.params.id);
    else this.getCategoryInfo(this.props.productInfo.categoryId);
  }

  getProductInfo=async(productId)=>{
    // console.log("by network get productInfo");
    let result = await reqOneProductInfo(productId);
    const {status,data,msg} = result;
    if (status===0) {
      const {name,desc,price,detail,imgs,categoryId} = data;
      this.setState({name,desc,price,detail,imgs,categoryId});
      //再通过发送网络请求拿到商品分类名称
      this.getCategoryInfo(categoryId);
    }else{
      message.error(msg?msg:"请求商品出错",1);
    }
  }

  getCategoryInfo=async(categoryId)=>{
    let result = await reqCategoryInfo(categoryId);
    let {status,data,msg} = result;
    if (status===0) {
      // console.log(result);
      this.setState({categoryName:data.name,isLoading:false});
    }else{
      message.error(msg?msg:"请求商品出错",1)
    }
  }
  render() {
    const {name,desc,price,detail,imgs} = this.props.productInfo?this.props.productInfo:this.state;
    return (
      <Card 
        title={
          <Fragment>
            <Button onClick={()=>{this.props.history.goBack()}}><RollbackOutlined /></Button>
            <span className="detailText">商品详情</span>
          </Fragment>
        }
        loading={this.state.isLoading}
      >
        <List
          size="large"
          bordered
          // dataSource={data}
          // renderItem={item => <List.Item>{item}</List.Item>}
        >
          <List.Item className="list-item">
            <span className="list-title">商品名称：</span>
            <span>{name}</span>
          </List.Item>
          <List.Item className="list-item">
            <span className="list-title">商品描述：</span>
            <span>{desc}</span>
          </List.Item>
          <List.Item className="list-item">
            <span className="list-title">商品价格：</span>
            <span>{price}</span>
          </List.Item>
          <List.Item className="list-item">
            <span className="list-title">商品分类：</span>
            <span>{this.state.categoryName}</span>
          </List.Item>
          <List.Item className="list-item">
            <span className="list-title">商品图片：</span>
            <span>
              {
                imgs.map((item)=>{
                  return (
                    <img key={item} src={`${BASE_URL}/upload/${item}`} alt="商品图片" />
                  )
                })
              }
            </span>
          </List.Item>
          <List.Item className="list-item">
            <span className="list-title">商品详情：</span>
            <span dangerouslySetInnerHTML={{__html:detail}}></span>
          </List.Item>
        </List>
      </Card>
    )
  }
}

export default ProductDetail;