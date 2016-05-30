import express from 'express';
import crypto from 'crypto';
import fetch from 'isomorphic-fetch';

const router = express.Router();

// 微信配置
const config = {
    baseUrl: 'http://w.siline.cn',
    token: 'seayangtoken',
    appid: 'wx95013eaa68c846c7',
    appsecret: 'fc697dc4bc4e077a3ea4adb823caf69a',
    encodingAESKey: 'QHhz7I8hHAGafbNxx40MLMtE2jOcfBJ6Ctcg1bpDXsM'
};

function sha1(str){
  let md5sum = crypto.createHash("sha1");
  md5sum.update(str);
  str = md5sum.digest("hex");
  return str;
}

//创建签名
function createSignature(url, ticketObj) {
  const noncestr = createNonceStr();
  // noncestr=Wm3WZYTPz0wzccnW
  // jsapi_ticket=sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg
  // timestamp=1414587457
  // url=http://mp.weixin.qq.com?params=value
  let sha1String = `jsapi_ticket=${ticketObj.ticket}&noncestr=${noncestr}&timestamp=${ticketObj.timestamp}&url=${url}`;
  return {
    signature: sha1(sha1String),
    ticket: ticketObj.ticket,
    timestamp: ticketObj.timestamp,
    noncestr: noncestr,
    url: url
  }
}

// 随机字符串产生
function createNonceStr() {
	return Math.random().toString(36).substr(2, 15);
};

// 时间戳产生
function createTimeStamp() {
	return parseInt(new Date().getTime() / 1000);
};

// 微信接入验证
// http://mp.weixin.qq.com/wiki/8/f9a0b8382e0b77d87b3bcc1ce6fbc104.html
// 参数        描述
// signature   微信加密签名，signature结合了开发者填写的token参数和请求中的timestamp参数、nonce参数。
// timestamp	 时间戳
// nonce	     随机数
// echostr	   随机字符串
router.get('/validate', (req, res) => {
  console.log('weixin validate...');
  const signature = req.query.signature;
  const timestamp = req.query.timestamp;
  const nonce = req.query.nonce;
  const echostr = req.query.echostr;

  // 将token、timestamp、nonce三个参数进行字典序排序
  let oriArray = new Array();
  oriArray[0] = config.token;
  oriArray[1] = timestamp;
  oriArray[2] = nonce;
  oriArray.sort();

  let original = oriArray.join('');
  let scyptoString = sha1(original);
  if (signature == scyptoString){
    res.end(echostr);
  } else {
    res.end('false');
  }
});

let cachedToken = null;
//获取access_token
router.get('/token', async (req, res) => {
  let timestamp = createTimeStamp();
  if (cachedToken) {
    if (timestamp < cachedToken.timestamp + cachedToken.expires_in - 300) {
      return res.json(cachedToken);
    }
  }
  try {
    let response = await fetch(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appid}&secret=${config.appsecret}`);
    let json = await response.json();
    json.timestamp = timestamp;
    console.log(json);
    cachedToken = json;
    res.json(json);
  } catch (e) {
    console.log(e);
    res.json('false');
  }
});

let cachedTicket = null;
//获取ticket
router.get('/ticket', async (req, res) => {
  let timestamp = new Date().getTime() / 1000;
  if (cachedTicket) {
    if (timestamp < cachedTicket.timestamp + cachedTicket.expires_in - 300) {
      return res.json(cachedTicket);
    }
  }
  try {
    let response = await fetch(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${cachedToken.access_token}&type=jsapi`);
    let json = await response.json();
    json.timestamp = timestamp;
    console.log(json);
    cachedTicket = json;
    res.json(json);
  } catch (e) {
    console.log(e);
    res.json('false');
  }
});

let cachedSignatures = {};
//获取signature
router.get('/signature', async (req, res) => {
  const timestamp = createTimeStamp();
  //如果ticket失效
  if (!cachedTicket || timestamp > cachedTicket.timestamp + cachedTicket.expires_in - 300 ) {
    try {
      let response = await fetch(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${cachedToken.access_token}&type=jsapi`);
      let json = await response.json();
      json.timestamp = timestamp;
      cachedTicket = json;
    } catch (e) {
      console.log(e);
      return res.json('false');
    }
  }

  const url = req.query.url || config.baseUrl; // || req.originalUrl;
  let signatureObj = cachedSignatures[url];
  if (signatureObj && (signatureObj.ticket == cachedTicket.ticket)) {
    return res.json(signatureObj);
  }
  //重新生成签名
  signatureObj = createSignature(url, cachedTicket);
  console.log('url:', url);
  console.log(signatureObj);
  cachedSignatures[url] = signatureObj;
  res.json(signatureObj);
});

export default router;
