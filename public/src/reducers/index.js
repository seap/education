import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import main from './main';
import appoint from './appoint';
import channel from './channel';
import product from './product';
import message from './message';


const rootReducer = combineReducers({
  main,
  ip: ((state = null) => state),
  appoint,
  channel,
  product,
  message,
  routing: routerReducer
});

export default rootReducer;
