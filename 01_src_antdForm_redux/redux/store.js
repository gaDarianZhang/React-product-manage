import {createStore, applyMiddleware, combineReducers} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import testReducer from './reducers/testReducer'

const reducers = combineReducers(
  {
    test:testReducer
  }
)

export default createStore(reducers,composeWithDevTools(applyMiddleware(thunk)))