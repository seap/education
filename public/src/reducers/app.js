import { ACTION_MESSAGE_SEND, ACTION_MESSAGE_CONFIRMATION } from '../constants/actionTypes';

const initialState = {
  isFetching: false,
  message: null
};
export default function app(state = initialState, action) {

  switch (action.type) {
    case ACTION_MESSAGE_SEND:
      return Object.assign({}, state, {message: action.message});
    case ACTION_MESSAGE_CONFIRMATION:
      return Object.assign({}, state, {message: null});
    default:
      return state;
  }
}
