import { MESSAGE_SEND } from '../constants/actionTypes';
import fetch from 'isomorphic-fetch';
import Cookies from 'js-cookie';

// 发送消息
export function sendMessage(message) {
  message = message || '服务异常';
  return {
    type: MESSAGE_SEND,
    message: message
  };
}

export function wxConfig() {
  return async (dispatch, getState) => {
    try {
      await fetch(`/wechat/token`);
      let response = await fetch(`/wechat/signature`);
      let json = await response.json();
      wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wxb558fbe29d74764d', // 必填，公众号的唯一标识
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

export function stopRecord() {
  wx.stopRecord({
    success: function (res) {
      console.log('stop successed, res', res);

      wx.playVoice(res);
      console.log('playing...');
    }
});


}

export function record() {

    wx.startRecord();

}
