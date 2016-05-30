import * as ActionTypes from '../constants/actionTypes';

const initialState = {
  isFetching: false,
  message: null
};
export default function app(state = initialState, action) {

  switch (action.type) {
    case ActionTypes.ACTION_MESSAGE_SEND:
      return Object.assign({}, state, {isFetching: false, message: action.message});
    case ActionTypes.ACTION_MESSAGE_CONFIRMATION:
      return Object.assign({}, state, {message: null});
    case ActionTypes.ACTION_FETCH_REQUEST:
      return Object.assign({}, state, {isFetching: true});
    default:
      return state;
  }
}
