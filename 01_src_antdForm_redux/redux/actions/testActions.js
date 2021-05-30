import {testType1,testType2} from '../constant'

export const createAction1 = (data)=>({type:testType1,data})
export const createAction2 = data => ({type:testType2,data})
export const createAction3 = (data,time) => (dispatch)=>{
  setTimeout(() => {
    dispatch(createAction2(data))
  }, time);
}