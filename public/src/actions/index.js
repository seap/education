import { MESSAGE_SEND } from '../constants/actionTypes';
import fetch from 'isomorphic-fetch';
import Cookies from 'js-cookie';

// 发送消息
function sendMessage(message) {
  message = message || '服务异常';
  return {
    type: MESSAGE_SEND,
    message: message
  };
}
