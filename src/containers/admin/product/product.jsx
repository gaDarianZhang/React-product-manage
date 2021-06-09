import React, { Component, Fragment } from 'react'
import {connect} from 'react-redux'
import {Card, Button, Select, Input, Table, message, Popconfirm} from 'antd'
import {PlusCircleOutlined, SearchOutlined} from '@ant-design/icons'
import {reqProductPageList, reqChangeProductStatus, reqSearchProductPageList} from '../../../request/requests'
import {createSaveProductInfoAction} from '../../../redux/actions/productActions'
import { PRODUCT_PAGE_SIZE} from '../../../config/config'

const {Option} = Select;
@connect(
  state=>({

  }),
  {
    saveProduct:createSaveProductInfoAction
  }
)
class Product extends Component {
  state={
    productList:[],
    total:0,//商品总数
    current:1,//当前所在页码
    searchType:"productName"
  }

  componentDidMount(){
    this.getProductPageList(1,PRODUCT_PAGE_SIZE);
  }


  // 页码发生变化时的回调function(current,pageSize)
  // handlePageChange=(current)=>{
  //   this.getProductPageList(current,PRODUCT_PAGE_SIZE);
  //   // this.setState({current});
  // }
  // 上架/下架商品
  changeProductStatus=async(productId,status)=>{
    let result = await reqChangeProductStatus(productId,status===1?2:1);
    if (result.status===0) {
      message.success("更新商品状态成功",1);
      // 通过维护状态来修改本地商品状态，当然也可以重新getProductPageList
      let productList = [...this.state.productList];
      productList.forEach((item)=>{
        if (item._id===productId) item.status=status===1?2:1;
      });
      this.setState({productList});
    }else{
      message.error(result.msg?result.msg:"更新商品状态失败",1);
    }
  }

  // 获取商品列表
  getProductPageList = async(pageNum=1,pageSize)=>{
    // console.log("getProduct");
    let result={};
    if (this.searchValue)  result = await reqSearchProductPageList(pageNum,pageSize,this.state.searchType,this.searchValue);
    else result = await reqProductPageList(pageNum,pageSize);
    const {status,data,msg} = result;
    if (status===0) {
      this.setState({
        productList:data.list,
        total:data.total,//商品总数
        current:pageNum,
      })
    } else{
      message.error(msg?msg:"商品列表获取失败,请联系管理员",1);
    }
  }

  // 添加新商品
  addProduct=()=>{
    this.props.history.push("/admin/prod_about/product/add_update/")
  }
  render() {
    const {total,current} = this.state;
    const dataSource = this.state.productList;  
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        align:'center',
        width:"15%",
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        render:(price)=>"￥"+price,
        align:'center',
        width:"8%",
      },
      {
        title: '状态',
        // dataIndex: 'status',
        key: 'status',
        align:'center',
        width:"10%",
        render:(oneProductInfo)=>{
          return(
            <Fragment>
              <Popconfirm placement="top" title={`确定将该商品${oneProductInfo.status===1?"下架":"上架"}吗？`} onConfirm={()=>this.changeProductStatus(oneProductInfo._id,oneProductInfo.status)} okText="确定" cancelText="取消">
                <Button 
                  type={oneProductInfo.status===1?"danger":"primary"}
                  // onClick={()=>this.changeProductStatus(oneProductInfo._id,oneProductInfo.status)}
                >
                  {oneProductInfo.status===1?"下架":"上架"}
                </Button>
              </Popconfirm>
              <br/>
              <span>{oneProductInfo.status===1?"在售":"已停售"}</span>
            </Fragment>  
          )
        }
      },
      {
        title: '操作',
        // dataIndex: 'productPrice',
        key: 'operation',
        align:'center',
        width:"10%",
        render:(oneProductInfo)=>{
          return(
            <Fragment>
              {/* <Link to={`/admin/prod_about/product/detail/${oneProductInfo._id}`}>详情</Link><br />
              <Link to={`/admin/prod_about/product/add_update/${oneProductInfo._id}`}>修改</Link> */}
              <Button 
                type="link" 
                onClick={()=>{this.props.history.push(`/admin/prod_about/product/detail/${oneProductInfo._id}`);this.props.saveProduct(oneProductInfo);}}
              >详情</Button><br />
              <Button 
                type="link" 
                onClick={()=>{this.props.history.push(`/admin/prod_about/product/add_update/${oneProductInfo._id}`);this.props.saveProduct(oneProductInfo);}}
              >修改</Button><br />
            </Fragment>
          )
        }
      },
    ];
    return (
      <Card 
        title={
          <Fragment>
            <Select defaultValue="productName" style={{ width: 120 }} onChange={(searchType)=>this.setState({searchType})}>
              <Option value="productName">按名称搜索</Option>
              <Option value="productDesc">按描述搜索</Option>
            </Select>
            <Input
              placeholder="输入搜索关键字"
              allowClear
              style={{margin:"0 10px",width:"20%"}}
              onChange={
                (event)=>{
                  this.searchValue = event.target.value;
                  if (!this.searchValue) {
                    this.getProductPageList(1,PRODUCT_PAGE_SIZE);//当搜索框被清空的时候，就自动重新发送请求获取所有商品列表
                  }
                }
              }//由于searchValue变化频繁，如果维护到状态中，就需要频繁渲染
            />
            <Button type="primary" onClick={()=>{this.getProductPageList(1,PRODUCT_PAGE_SIZE)}}><SearchOutlined />搜索</Button>
          </Fragment>
        } 
        extra={<Button type="primary" onClick={this.addProduct}><PlusCircleOutlined />添加商品</Button>} 
      >
        <Table 
          dataSource={dataSource} 
          columns={columns} 
          bordered
          rowKey={"_id"}
          pagination={{
            pageSize:PRODUCT_PAGE_SIZE,
            total:total,
            current:current,
            onChange:(pageNum)=>this.getProductPageList(pageNum,PRODUCT_PAGE_SIZE),
          }}
        />
      </Card>
    )
  }
}
export default Product