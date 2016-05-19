import { CURRENT_CITY_DATA_LOADED, CITY_ADVISER_DATA_LOADED } from '../constants/actionTypes';

const initialState = {
};

export default function appoint(state = initialState, action) {
  switch (action.type) {
    case CURRENT_CITY_DATA_LOADED:
      return action.data;

    default:
      return state;
  }
}
