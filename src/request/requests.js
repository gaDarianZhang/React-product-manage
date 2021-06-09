/* 用于发送项目中所有的请求 */
import jsonp from 'jsonp'
import {message} from 'antd'
import myAxios from './axiosInstance'
import {APPID,APPSECRET,CITY} from '../config/config'

// 登录请求
export const reqLogin = (username,password)=> myAxios.post("/login",{username,password})

// 获取商品种类
export const reqGetProductCategories = ()=>myAxios.get("/manage/category/list")

// 获取天气信息
export const reqGetWeather = ()=>{
  return new Promise((resolve,reject)=>{
    jsonp(`https://v0.yiketianqi.com/api?version=v9&appid=${APPID}&appsecret=${APPSECRET}&city=${CITY}`,
      {timeout:4000},
      (err,data)=>{
        if(err){
          message.error("请求天气信息出错",1);
          return new Promise(()=>{})//中断promise链
        }else{
          const {wea,tem1,tem2} = data.data[0];
          resolve({wea,tem1,tem2})
        }
      })
  })  
}

// 添加一个商品分类
export const reqAddCategory = (categoryName)=> myAxios.post("/manage/category/add",{categoryName});

// 修改一个商品分类
export const reqUpdateCategory = (categoryId,categoryName)=> myAxios.post("/manage/category/update",{categoryId,categoryName});

// 按页获取商品列表
export const reqProductPageList = (pageNum,pageSize)=>myAxios.get("/manage/product/list",{params:{pageNum,pageSize}});

// 对商品进行上架和下架处理
export const reqChangeProductStatus = (productId,status)=>myAxios.post('/manage/product/updateStatus',{productId,status});

// 按页获取搜索到的商品列表
// 巧妙的用法
export const reqSearchProductPageList = (pageNum,pageSize,searchType,searchValue)=>myAxios.get("/manage/product/search",{params:{pageNum,pageSize,[searchType]:searchValue}});

//根据商品ID获取商品信息
export const reqOneProductInfo = (productId)=>myAxios.get("/manage/product/info",{params:{productId}});

//根据分类ID获取商品分类名称
export const reqCategoryInfo = (categoryId)=>myAxios.get("/manage/category/info",{params:{categoryId}});

//删除一个图片
export const reqDeletePicture = (name)=>myAxios.post("/manage/img/delete",{name});

//添加一个商品
export const reqAddOneProduct = (categoryId,name,desc,price,detail,imgs)=>myAxios.post("/manage/product/add",{categoryId,name,desc,price,detail,imgs});

//更新商品信息
export const reqUpdateOneProduct = (categoryId,name,desc,price,detail,imgs,_id)=>myAxios.post("/manage/product/update",{categoryId,name,desc,price,detail,imgs,_id})

// 获取角色列表
export const reqRoleList = ()=>myAxios.get('/manage/role/list');

// 添加角色
export const reqAddOneRole = (roleName)=>myAxios.post('/manage/role/add',{roleName});

//给角色设置权限
export const reqSetRoleAuth = (_id,menus,auth_name)=>myAxios.post('/manage/role/update',{_id,menus,auth_name,auth_time:Date.now()});

// 获取所有用户列表
export const reqUserList=()=>myAxios.get('/manage/user/list');
// 添加新用户
export const reqAddOneUser=({username,password,phone,email,role_id})=>myAxios.post('/manage/user/add',{username,password,phone,email,role_id});

// 更新用户信息
export const reqUpdateOneUser=(_id,username,phone,email,role_id)=>myAxios.post('/manage/user/update',{_id,username,phone,email,role_id});

//删除一个用户
export const reqDeleteOneUser=(userId)=>myAxios.post('/manage/user/delete',{userId});