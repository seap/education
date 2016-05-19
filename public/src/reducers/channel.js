import { CHANNEL_DATA_LOADED } from '../constants/actionTypes';

const initialState = {};
export default function channel(state = initialState, action) {

  switch (action.type) {
    case CHANNEL_DATA_LOADED:
      let data = {};
      data[action.id] = action.data
      return Object.assign({}, state, data);
    default:
      return state;
  }
}
