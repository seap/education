import * as ActionTypes from '../constants/actionTypes';

const initialState = {
  isFetching: false,
  message: null,
  bindSuccess: false,
  myInfo:null,
  classList: [], //所有可支付班级
  myClasses: null,
  currentTask: null,
  isRecording: false,
  localRecordList: []
};
export default function app(state = initialState, action) {

  switch (action.type) {
    case ActionTypes.ACTION_STATE_RESET:
      return initialState;
    case ActionTypes.ACTION_MESSAGE_SEND:
      return Object.assign({}, state, {isFetching: false, message: action.message});
    case ActionTypes.ACTION_MESSAGE_CONFIRMATION:
      return Object.assign({}, state, {message: null});
    case ActionTypes.ACTION_FETCH_REQUEST:
      return Object.assign({}, state, {isFetching: true});

    case ActionTypes.ACTION_BINDING_SUCCESS:
      return Object.assign({}, state, {isFetching: false, message: '绑定成功！', bindSuccess: true});
    case ActionTypes.ACTION_MY_INFO_LOAD:
      return Object.assign({}, state, {myInfo: action.payload});
    case ActionTypes.ACTION_CLASS_LIST_LOAD:
      return Object.assign({}, state, {classList: action.payload});
    case ActionTypes.ACTION_MY_CLASS_LOADED:
      return Object.assign({}, state, {myClasses: action.classes});

    case ActionTypes.ACTION_MY_TASK_LOADED:
      let newAllTasks = {};
      newAllTasks[action.id + ''] = action.tasks;
      return Object.assign({}, state, {allTasks: newAllTasks});

    case ActionTypes.ACTION_MY_ALL_TASK_LOADED:
      return Object.assign({}, state, {myClasses: action.tasks, isFetching: false});

    case ActionTypes.ACTION_TASK_DETAIL_LOADED:
      return Object.assign({}, state, {currentTask: action.task, localRecordList:[], isFetching: false});

    case ActionTypes.ACTION_TASK_RECORD_START:
      return Object.assign({}, state, {isRecording: true});

    case ActionTypes.ACTION_TASK_RECORD_STOP:
      state.localRecordList.push(action.record);
      return Object.assign({}, state, {isRecording: false});
    case ActionTypes.ACTION_TASK_RECORD_DELETE:
      let localRecordList = state.localRecordList.filter(record =>
        record.localId != action.record.localId
      );
      return Object.assign({}, state, {localRecordList});
    case ActionTypes.ACTION_WRITEON_DETAIL:
      return Object.assign({}, state, {writeon: action.payload, isFetching: false });
    case ActionTypes.ACTION_STUFF_DETAIL:
      return Object.assign({}, state, {stuff: action.payload, isFetching: false });
    default:
      return state;
  }
}
