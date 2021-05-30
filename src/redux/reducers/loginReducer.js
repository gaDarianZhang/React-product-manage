import {SAVE_USER_INFO, DELETE_USER_INFO} from '../constant'

let user = localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):"";
let token = localStorage.getItem("token");
let isLogin = user && token ? true:false;

const initState = {
  user,
  token,
  isLogin
};
export default function reducer (preState=initState,action){
  const {type,data} = action;
  switch (type) {
    case SAVE_USER_INFO:
      return {user:data.user,token:data.token,isLogin:true};
    case DELETE_USER_INFO:
      return {user:"",token:"",isLogin:false}
    default:
      return preState;
  }
}