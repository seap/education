import * as ActionTypes from '../constants/actionTypes';

const initialState = {
  isFetching: false,
  message: null,
  myClasses: [],
};
export default function app(state = initialState, action) {

  switch (action.type) {
    case ActionTypes.ACTION_MESSAGE_SEND:
      return Object.assign({}, state, {isFetching: false, message: action.message});
    case ActionTypes.ACTION_MESSAGE_CONFIRMATION:
      return Object.assign({}, state, {message: null});
    case ActionTypes.ACTION_FETCH_REQUEST:
      return Object.assign({}, state, {isFetching: true});

    case ActionTypes.ACTION_MY_CLASS_LOADED:
      return Object.assign({}, state, {myClasses: action.classes});

    case ActionTypes.ACTION_MY_TASK_LOADED:
      let newAllTasks = {};
      newAllTasks[action.id + ''] = action.tasks;
      return Object.assign({}, state, {allTasks: newAllTasks});

    case ActionTypes.ACTION_MY_ALL_TASK_LOADED:
      return Object.assign({}, state, {myClasses: action.tasks});
    default:
      return state;
  }
}
