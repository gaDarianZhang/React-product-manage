import {SAVE_MENU_TITLE} from '../constant'
import menuConfig from '../../config/menu_config'



let initState = ""
export default function(preState=initState,action){
  const {type,data} = action;
  switch (type) {
    case SAVE_MENU_TITLE:
      return data;
    default:
      return preState;
  }
}