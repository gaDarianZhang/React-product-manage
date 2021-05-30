import {testType1,testType2} from '../constant'

const initState = "testState";
export default function (preState=initState,action){
  const {type,data} = action;
  switch (type) {
    case testType1:
      return preState + "testType1";
    case testType2:
      return preState + "testType2";
    default:
      return preState;
  }
}