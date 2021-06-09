import {SAVE_CATEGORY_LIST} from '../constant'

let initState=[];
export default function categoryReducer(preState=initState,action){ 
  const {type,data} = action;
  switch (type) {
    case SAVE_CATEGORY_LIST:
      return data;
    default:
      return preState;
  }
}