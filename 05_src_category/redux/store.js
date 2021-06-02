import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import loginReducer from './reducers/loginReducer'
import menuReducer from './reducers/menuReducer'

const reducers = combineReducers(
  {
    userInfo:loginReducer,
    menuTitle:menuReducer
  }
)

export default createStore(reducers,composeWithDevTools(applyMiddleware(thunk)))