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

export const reqAddCategory = (categoryName)=> myAxios.post("/manage/category/add",{categoryName})

export const reqUpdateCategory = (categoryId,categoryName)=> myAxios.post("/manage/category/update",{categoryId,categoryName})
