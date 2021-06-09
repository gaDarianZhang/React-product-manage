import {SAVE_PRODUCT_INFO} from '../constant'

let initState = null;
export default function productReducer(preState=initState,action){
  let {type,data} = action;
  switch (type) {
    case SAVE_PRODUCT_INFO:
      return data;
    default:
      return preState;
  }
}