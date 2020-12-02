/**
 * 发版上线需要修改 appVersion 的值
 */
const appVersion = 100; //版本号，规则为三位数字类似v1.0.0,示例 100 对应 v1.0.0，101 对应 v1.0.1

var configRouter;
const currentEvn = process.env.NODE_ENV; //development开发测试环境 || production生产环境

if (currentEvn == "development") {
  configRouter = {
    //api请求host域名-- 测试环境
    apiHost: 'https://goshop.shinmigo.com/',
    //图片服务器请求host域名 -- 生产环境
    imgHost: 'https://goshop.shinmigo.com/image/get-image?name='
  };
} else if (currentEvn == "production") {
  configRouter = {
    //api请求host域名 -- 生产环境
    apiHost: 'https://goshop.shinmigo.com/',
    //图片服务器请求host域名 -- 生产环境
    imgHost: 'https://goshop.shinmigo.com/image/get-image?name='
  };
} else{
  configRouter = {
    //api请求host域名-- 测试环境
    apiHost: 'https://goshop.shinmigo.com/',
    //图片服务器请求host域名 -- 生产环境
    imgHost: 'https://goshop.shinmigo.com/image/get-image?name='
  };
}

//#ifdef APP-PLUS
const source = 5; //app
//#endif
//#ifdef H5
const source = 2; //h5
//#endif
//#ifdef MP-WEIXIN
const source = 3; //微信小程序
//#endif
//#ifdef MP-ALIPAY
const source = 4; //支付宝小程序
//#endif

module.exports = {
  configRouter: configRouter,
  currentEvn: currentEvn,
  appVersion: appVersion,
  paltform: process.platform,
  source: source
};
