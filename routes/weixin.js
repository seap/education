import express from 'express';
import crypto from 'crypto';
const router = express.Router();

//微信配置
const config = {
    token: 'sea.yang.token',
    appid: 'wx1d93f16c31b0cf45',
    encodingAESKey: 'xxxxxxxxxxxxxxxxxxxxxxxx'
};

function sha1(str){
  let md5sum = crypto.createHash("sha1");
  md5sum.update(str);
  str = md5sum.digest("hex");
  return str;
}

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
  console.log("Original str : " + original);
  console.log("Signature : " + signature );
  let scyptoString = sha1(original);
  if (signature == scyptoString){
    res.end(echostr);
    console.log("Confirm and send echo back");
  } else {
    res.end("false");
    console.log("Failed!");
  }
});


export default router;
