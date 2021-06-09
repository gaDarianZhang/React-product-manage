import {SAVE_MENU_TITLE} from '../constant'


let initState = ""
export default function menuReducer(preState=initState,action){
  const {type,data} = action;
  switch (type) {
    case SAVE_MENU_TITLE:
      return data;
    default:
      return preState;
  }
}