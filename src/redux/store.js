import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import loginReducer from './reducers/loginReducer'
import menuReducer from './reducers/menuReducer'
import productReducer from './reducers/productReducer'
import categoryReducer from './reducers/categoryReducer'

const reducers = combineReducers(
  {
    userInfo:loginReducer,
    menuTitle:menuReducer,
    productInfo:productReducer,
    categoryList:categoryReducer,
  }
)

export default createStore(reducers,composeWithDevTools(applyMiddleware(thunk)))