import fetch from 'isomorphic-fetch';
import Cookies from 'js-cookie';
import { push } from 'react-router-redux';
import * as ActionTypes from '../constants/actionTypes';

import { dateFormat } from '../common/js/utility';

// 重置state
export function resetState() {
  return {
    type: ActionTypes.ACTION_STATE_RESET
  }
}

// 发送消息
export function sendMessage(message) {
  message = message || '服务异常';
  return {
    type: ActionTypes.ACTION_MESSAGE_SEND,
    message: message
  };
}

// 确认消息
export function confirmMessage() {
  return {
    type: ActionTypes.ACTION_MESSAGE_CONFIRMATION
  }
}

// 数据请求
export function fetchRequest() {
  return {
    type: ActionTypes.ACTION_FETCH_REQUEST
  }
}

// 绑定成功
export function bindSuccess() {
  return {
    type: ActionTypes.ACTION_BINDING_SUCCESS
  }
}
// 注册
export function register(data) {
  return async (dispatch, getState) => {
    if (getState().app.isFetching) {
      return;
    }
    //数据校验
    if (!data.studentName) {
      return dispatch(sendMessage('请输入学生姓名！'));
    }
    if (!data.parentName) {
      return dispatch(sendMessage('请输入家长姓名！'));
    }
    if (!data.phone) {
      return dispatch(sendMessage('请输入手机号！'));
    }
    if (!data.password) {
      return dispatch(sendMessage('请输入密码！'));
    }
    dispatch(fetchRequest());

    //return dispatch(sendMessage('服务异常！'));
  }
}

// 学号密码绑定
export function bind(data) {
  return async (dispatch, getState) => {
    if (getState().app.isFetching) {
      return;
    }
    //数据校验
    if (!data.studentId) {
      return dispatch(sendMessage('请输入学号！'));
    }
    if (!data.password) {
      return dispatch(sendMessage('请输入密码！'));
    }
    // if (!data.remark) {
    //   return dispatch(sendMessage('请输入备注！'));
    // }
    const openid = Cookies.get('openid');
    const nickname = Cookies.get('nickname');
    dispatch(fetchRequest());
    try {
      let response = await fetch(`/webservice/account/bind?studentNo=${data.studentId}&password=${data.password}&remark=${data.remark}&openId=${openid}&nickname=${nickname}`);
      let json = await response.json();
      if (json.errno != 0) {
        return dispatch(sendMessage(json.errmsg));
      }
      // 绑定成功
      Cookies.set('studentid', data.studentId);
      dispatch(bindSuccess());
    } catch (e) {
      return dispatch(sendMessage('服务异常'));
    }
  }
}

export function wxConfig() {
  return async (dispatch, getState) => {
    try {
      await fetch(`/wechat/token`);
      let response = null;
      if (__DEVELOPMENT__) {
        response = await fetch(`/wechat/signature?url=${encodeURIComponent(window.location.href)}`);
      } else {
        response = await fetch(`/wechat/signature?url=${encodeURIComponent('http://w.siline.cn/task/list')}`);
      }
      let json = await response.json();
      wx.config({
        debug: __DEVELOPMENT__, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wx95013eaa68c846c7', // 必填，公众号的唯一标识
        timestamp: json.timestamp , // 必填，生成签名的时间戳
        nonceStr: json.noncestr, // 必填，生成签名的随机串
        signature: json.signature,// 必填，签名，见附录1
        jsApiList: ['startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      wx.ready(function(){
        console.log('wx config ready.');
      });

    } catch (e) {
      console.log(e);
    }
  }
}

function addLocalRecord(record) {
  record.name = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
  return {
    type: ActionTypes.ACTION_TASK_RECORD_STOP,
    record
  }
}
// 开始录音
export function startRecord() {
  return (dispatch, getState) => {
    if (getState().app.isRecording) {
      return;
    }
    wx && wx.startRecord();
    wx.onVoiceRecordEnd({
      // 录音时间超过一分钟没有停止的时候会执行 complete 回调
      complete: function (res) {
        dispatch(addLocalRecord(res));
      }
    });
    dispatch({
      type: ActionTypes.ACTION_TASK_RECORD_START
    });
  };
}

// 停止录音
export function stopRecord() {
  return (dispatch, getState) => {
    wx && wx.stopRecord({
      success: function (res) {
        console.log('stop successed, res', res);
        dispatch(addLocalRecord(res));
        // wx.playVoice(res);
      }
    });
  }
}

export function playRecord(record) {
  return (dispatch, getState) => {
    wx && wx.playVoice(record);
  }
}

export function deleteRecord(record) {
  console.log(record);
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.ACTION_TASK_RECORD_DELETE,
      record
    });
  }
}

function allMyTaskLoaded(tasks) {
  return {
    type: ActionTypes.ACTION_MY_ALL_TASK_LOADED,
    tasks
  };
}

//查询我的所有作业
export function fetchAllMyTasks() {
  return async (dispatch, getState) => {
    if (getState().app.isFetching) {
      return;
    }
    let openId = Cookies.get('openid');
    if (__DEVELOPMENT__) {
      openId = 'oUoJLv6jTegVkkRhXBnhq5XSvvBQ';
    }
    if (!openId) {
      //未绑定登录
      return dispatch(push(`/bind?referer=${encodeURIComponent(window.location.href)}`));
    }
    dispatch(fetchRequest());
    try {
      let response = await fetch(`/webservice/student/query_clazz?openId=${openId}`);
      let json = await response.json();
      if (json.errno !== 0 && json.data) {
        return dispatch(sendMessage(json.errmsg));
      }

      let myClasses = json.data;
      for (let i = 0; i < myClasses.length; i++) {
        response = await fetch(`/webservice/student/query_task?openId=${openId}&classId=${myClasses[i].clazz_id}`);
        json = await response.json();
        if (json.errno === 0) {
          myClasses[i].tasks = json.data
        }
      }
      dispatch(allMyTaskLoaded(myClasses));
    } catch (e) {
      console.log(e);
    }

  }
}

function taskDetailLoaded(task) {
  return {
    type: ActionTypes.ACTION_TASK_DETAIL_LOADED,
    task
  };
}

//查询作业详情
export function fetchTaskDetail(params) {
  return async (dispatch, getState) => {
    if (getState().app.isFetching) {
      return;
    }
    let openId = Cookies.get('openid');
    if (__DEVELOPMENT__) {
      openId = 'oUoJLv6jTegVkkRhXBnhq5XSvvBQ';
    }
    if (!openId) {
      //未绑定登录
      return dispatch(push(`/wechat/login?referer=${encodeURIComponent(window.location.href)}`));
    }
    dispatch(fetchRequest());
    try {
      let response = await fetch(`/webservice/student/query_task_info?openId=${openId}&taskId=${params.taskId}`);
      let json = await response.json();
      if (json.errno !== 0 && json.data) {
        return dispatch(sendMessage(json.errmsg));
      }
      dispatch(taskDetailLoaded(json.data));
    } catch (e) {
      dispatch(sendMessage('网络服务异常！'));
    }
  }
}

//查询个人信息
export function fetchMyInfo() {
  return async (dispatch, getState) => {
    let openId = Cookies.get('openid');
    if (__DEVELOPMENT__) {
      openId = 'oUoJLv6jTegVkkRhXBnhq5XSvvBQ';
    }
    if (!openId) {
      //未绑定登录
      return dispatch(push(`/wechat/login?referer=${encodeURIComponent(window.location.href)}`));
    }
    try {
      let response = await fetch(`/webservice/student/self_info?openId=${openId}`);
      let json = await response.json();
      if (json.errno !== 0 && json.data) {
        return dispatch(sendMessage(json.errmsg));
      }
      dispatch({
        type: ActionTypes.ACTION_MY_INFO_LOAD,
        payload: json.data
      });
    } catch (e) {
      dispatch(sendMessage('网络服务异常！'));
    }
  }
}


//查询已激活班级
export function fetchClassList() {
  return async (dispatch, getState) => {
    try {
      let response = await fetch(`/webservice/clazz/query_clazz`);
      let json = await response.json();
      if (json.errno !== 0 && json.data) {
        return dispatch(sendMessage(json.errmsg));
      }
      dispatch({
        type: ActionTypes.ACTION_CLASS_LIST_LOAD,
        payload: json.data
      });
    } catch (e) {
      dispatch(sendMessage('网络服务异常！'));
    }
  }
}

//查询板书列表
export function fetchWriteonList() {
  return async (dispatch, getState) => {
    if (getState().app.isFetching) {
      return;
    }
    let openId = Cookies.get('openid');
    if (__DEVELOPMENT__) {
      openId = 'oUoJLv6jTegVkkRhXBnhq5XSvvBQ';
    }
    if (!openId) {
      //未绑定登录
      return dispatch(push(`/bind?referer=${encodeURIComponent(window.location.href)}`));
    }
    dispatch(fetchRequest());
    try {
      let response = await fetch(`/webservice/student/query_clazz?openId=${openId}`);
      let json = await response.json();
      if (json.errno !== 0 && json.data) {
        return dispatch(sendMessage(json.errmsg));
      }

      let myClasses = json.data;
      for (let i = 0; i < myClasses.length; i++) {
        response = await fetch(`/webservice/student/query_writeon?openId=${openId}&classId=${myClasses[i].clazz_id}`);
        json = await response.json();
        if (json.errno === 0) {
          myClasses[i].writeons = json.data
        }
      }
      dispatch(allMyTaskLoaded(myClasses));
    } catch (e) {
      dispatch(sendMessage('网络服务异常！'));
    }

  }
}

//查询板书列表
export function fetchStuffList() {
  return async (dispatch, getState) => {
    if (getState().app.isFetching) {
      return;
    }
    let openId = Cookies.get('openid');
    if (__DEVELOPMENT__) {
      openId = 'oUoJLv6jTegVkkRhXBnhq5XSvvBQ';
    }
    if (!openId) {
      //未绑定登录
      return dispatch(push(`/bind?referer=${encodeURIComponent(window.location.href)}`));
    }
    dispatch(fetchRequest());
    try {
      let response = await fetch(`/webservice/student/query_clazz?openId=${openId}`);
      let json = await response.json();
      if (json.errno !== 0 && json.data) {
        return dispatch(sendMessage(json.errmsg));
      }

      let myClasses = json.data;
      for (let i = 0; i < myClasses.length; i++) {
        response = await fetch(`/webservice/student/query_stuff?openId=${openId}&classId=${myClasses[i].clazz_id}`);
        json = await response.json();
        if (json.errno === 0) {
          myClasses[i].stuffs = json.data
        } else {
          return dispatch(sendMessage(json.errmsg));
        }
      }
      dispatch(allMyTaskLoaded(myClasses));
    } catch (e) {
      dispatch(sendMessage('网络服务异常！'));
    }

  }
}

//查询材料详情
export function fetchStuffDetail(params) {
  return async (dispatch, getState) => {
    if (getState().app.isFetching) {
      return;
    }
    let openId = Cookies.get('openid');
    if (__DEVELOPMENT__) {
      openId = 'oUoJLv6jTegVkkRhXBnhq5XSvvBQ';
    }
    if (!openId) {
      //未绑定登录
      return dispatch(push(`/wechat/login?referer=${encodeURIComponent(window.location.href)}`));
    }
    dispatch(fetchRequest());
    try {
      let response = await fetch(`/webservice/student/query_stuff_info?openId=${openId}&stuffId=${params.stuffId}`);
      let json = await response.json();
      if (json.errno !== 0 && json.data) {
        return dispatch(sendMessage(json.errmsg));
      }
      dispatch({
        type: ActionTypes.ACTION_STUFF_DETAIL,
        payload: json.data
      });
    } catch (e) {
      dispatch(sendMessage('网络服务异常！'));
    }
  }
}


//查询通知列表
export function fetchNoticeList() {
  return async (dispatch, getState) => {
    if (getState().app.isFetching) {
      return;
    }
    let openId = Cookies.get('openid');
    if (__DEVELOPMENT__) {
      openId = 'oUoJLv6jTegVkkRhXBnhq5XSvvBQ';
    }
    if (!openId) {
      //未绑定登录
      return dispatch(push(`/bind?referer=${encodeURIComponent(window.location.href)}`));
    }
    dispatch(fetchRequest());
    try {
      let response = await fetch(`/webservice/student/query_clazz?openId=${openId}`);
      let json = await response.json();
      if (json.errno !== 0 && json.data) {
        return dispatch(sendMessage(json.errmsg));
      }

      let myClasses = json.data;
      for (let i = 0; i < myClasses.length; i++) {
        response = await fetch(`/webservice/clazz/query_clazz_notice?openId=${openId}&clazzId=${myClasses[i].clazz_id}`);
        json = await response.json();
        if (json.errno === 0) {
          myClasses[i].notices = json.data
        } else {
          return dispatch(sendMessage(json.errmsg));
        }
      }
      dispatch(allMyTaskLoaded(myClasses));
    } catch (e) {
      dispatch(sendMessage('网络服务异常！'));
    }
  }
}
