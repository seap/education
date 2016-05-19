import { MAIN_DATA_LOADED } from '../constants/actionTypes';

const initialState = null;

export default function main(state = initialState, action) {
  switch (action.type) {
    case MAIN_DATA_LOADED:
      return action.data;

    default:
      return state;
  }
}
