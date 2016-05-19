import { MESSAGE_SEND, MESSAGE_CONFIRMATION } from '../constants/actionTypes';

const initialState = null;
export default function channel(state = initialState, action) {

  switch (action.type) {
    case MESSAGE_SEND:
      return action.message;
    case MESSAGE_CONFIRMATION:
      return null;
    default:
      return state;
  }
}
