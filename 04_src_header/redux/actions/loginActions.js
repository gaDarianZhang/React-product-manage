import {SAVE_USER_INFO, DELETE_USER_INFO} from '../constant'

export const createSaveUserInfoAction = (data)=>{
  // 将登录信息添加到localStorage中
  localStorage.setItem("user",JSON.stringify(data.user));
  localStorage.setItem("token",data.token);
  return {type:SAVE_USER_INFO,data}
}

export const createDeleteUserInfoAction = ()=>{
  // 将登录信息添加到localStorage中
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  return {type:DELETE_USER_INFO}
}
