import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import loginReducer from './reducers/loginReducer'

const reducers = combineReducers(
  {
    userInfo:loginReducer
  }
)

export default createStore(reducers,composeWithDevTools(applyMiddleware(thunk)))