/* 用于发送项目中所有的请求 */
import myAxios from './axiosInstance'

// 登录请求
export const reqLogin = (username,password)=> myAxios.post("/login",{username,password})