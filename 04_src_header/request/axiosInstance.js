import {message} from 'antd'
import axios from 'axios'
import qs from 'querystring'
import NProgress from 'nprogress'
import store from '../redux/store'
import {BASE_URL} from '../config/config'
import {createDeleteUserInfoAction} from '../redux/actions/loginActions'
import 'nprogress/nprogress.css'

const instance = axios.create({
  timeout:4000,
  baseURL:BASE_URL,
})
instance.interceptors.request.use((config)=>{
  // console.log("这是：",config.data);
  NProgress.start()
  // const token = store.getState().userInfo.token;
  const token = localStorage.getItem("token");
  if(token) config.headers.Authorization = "atguigu_"+token;
  const {method,data} = config;
  if(method.toLowerCase() === "post"){
    if(data instanceof Object){
      config.data = qs.stringify(data)
    }
  }
  return config;
})


instance.interceptors.response.use(
  response=>{
    NProgress.done();
    return response.data;
  },
  error=>{
    NProgress.done();
    if(error.response.status === 401){
      store.dispatch(createDeleteUserInfoAction());
      message.error("登录过期，请重新登录",1)
    }else{
      console.log("请求出错",error);
      message.error(error.message,1);//1s只能弹出的提示框消失
    }
    
    // return Promise.reject(error);
    return new Promise(()=>{});
  }
)
export default instance;