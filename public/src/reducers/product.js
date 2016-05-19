import { PRODUCT_DATA_LOADED } from '../constants/actionTypes';

const initialState = null;
export default function product(state = initialState, action) {
  switch (action.type) {
    case PRODUCT_DATA_LOADED:
      return action.data;
    default:
      return state;
  }
}
