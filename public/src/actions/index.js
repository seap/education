import fetch from 'isomorphic-fetch';
import Cookies from 'js-cookie';
import { push } from 'react-router-redux';
import * as ActionTypes from '../constants/actionTypes';

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
    dispatch(fetchRequest());
    //return dispatch(sendMessage('服务异常！'));
  }
}

export function wxConfig() {
  return async (dispatch, getState) => {
    try {
      await fetch(`/wechat/token`);
      alert(window.location.href);
      // let response = await fetch(`/wechat/signature?url=${encodeURIComponent(window.location.href)}`);
      let response = await fetch(`/wechat/signature?url=${encodeURIComponent(‘http://w.siline.cn/task/list’)}`);
      let json = await response.json();
      alert('url: ', json.url);

      wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
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

// 开始录音
export function startRecord() {
  return (dispatch, getState) => {
    wx && wx.startRecord();
  };
}

// 停止录音
export function stopRecord() {
  return (dispatch, getState) => {
    wx && wx.stopRecord({
      success: function (res) {
        console.log('stop successed, res', res);
        wx.playVoice(res);
        console.log('playing...');
      }
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
    // const openId = Cookies.get('openid');
    // if (!openId) {
    //   //未绑定登录
    //   return dispatch(push(`/bind?referer=${encodeURIComponent(window.location.href)}`));
    // }
    const openId = 'oUoJLv6jTegVkkRhXBnhq5XSvvBQ';
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
      // myClasses.map(async (clazz) => {
      //   response = await fetch(`/webservice/student/query_task?openId=${openId}&classId=${clazz.clazz_id}`);
      //   json = await response.json();
      //   if (json.errno === 0) {
      //     clazz.tasks = json.data
      //   }
      // });
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

export function fetchTaskDetail(params) {
  return async (dispatch, getState) => {
    // const openId = Cookies.get('openid');
    // if (!openId) {
    //   //未绑定登录
    //   return dispatch(push(`/bind?referer=${encodeURIComponent(window.location.href)}`));
    // }
    const openId = 'oUoJLv6jTegVkkRhXBnhq5XSvvBQ';
    try {
      let response = await fetch(`/webservice/student/query_task_info?openId=${openId}&taskId=${params.taskId}`);
      let json = await response.json();
      if (json.errno !== 0 && json.data) {
        return dispatch(sendMessage(json.errmsg));
      }

      dispatch(taskDetailLoaded(json.data));
    } catch (e) {
      console.log(e);
    }
  }
}
