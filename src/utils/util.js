var app = getApp().$vm || getApp(); //获取应用实例
setTimeout(res => {
  app = getApp().$vm || getApp();
}, 100)

import {
  TradeStatus,
  Logout,
  Pay
} from "./api";

//格式化数字， -- 如传入 10返回10， 1 返回 01 
const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

//格式化商品价格
const formatPrice = n => {
  n = (n * 1).toFixed(2);
  return n * 1;
};

//格式化imageUrl的图片路径---不分环境
const formatImageUrl = imageUrl => {
  return "https:" + imageUrl.substring(imageUrl.indexOf('//'));
};

//获取图片url
const thumbUrl = (imgId) => {
  if (!imgId) return "";
  return app.globalData.configRouter.imgHost + imgId;
};

/*跳转功能统一方法data为该---跳转对象值*/
const clickType = data => {
  /* 
    data = {
      clickType: '',
      value: ''
    }
  */
  const {
    clickType,
    value
  } = data;
  if (clickType) {
    switch (clickType) {
      case 'event':
        if (value) {
          wx.navigateTo({
            url: '/pages/special-subject/special-subject?events=' + value
          });
        }
        break;

      case 'products':
        if (value) {
          wx.navigateTo({
            url: '/pages/product/product?productId=' + value
          });
        }
        break;
      case "member":
        {
          wx.navigateTo({
            url: '/pages/member/my/index'
          });
        }
        break;
      default:
        break;
    }
  }
};

// 退出登录清除数据操作
const exit = function(obj) {
  /**
   * obj = {
   *   success: Function
   *   fail: Function
   * }
   */

  app.globalData.globalAddr = {}
  uni.removeStorageSync('access_token');
  uni.removeStorageSync('member_id');
  uni.removeStorageSync('mobile');
  obj.success()
  return;

  // 待支持
  app.uniAjax({
    url: Logout,
    type: 'POST',
    loading: {
      msg: '',
      mask: true
    }
  }).then(res => { //调用接口成功
    if (res.data.code == 200) {
      if (obj && obj.success && typeof(obj.success) == 'function') {
        obj.success()
      }
      app.globalData.globalAddr = {}
      uni.removeStorageSync('access_token');
      uni.removeStorageSync('member_id');
      uni.removeStorageSync('mobile');
    } else {
      uni.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 2000
      });
      if (obj && obj.fail && typeof(obj.fail) == 'function') {
        obj.fail()
      }
    }
  }).catch(res => { //调用接口失败
    uni.showToast({
      title: res.data.msg,
      icon: 'none',
      duration: 2000
    });
    if (obj && obj.fail && typeof(obj.fail) == 'function') {
      obj.fail()
    }
  });
};

//格式化时间
String.prototype.date = function(format) {
  if (!format) format = 'yyyy-MM-dd hh:mm:ss';
  var newDate = new Date();
  newDate.setTime(this.valueOf() * 1000);
  var date = {
    "M+": newDate.getMonth() + 1,
    "d+": newDate.getDate(),
    "h+": newDate.getHours(),
    "m+": newDate.getMinutes(),
    "s+": newDate.getSeconds(),
    "q+": Math.floor((newDate.getMonth() + 3) / 3),
    "S+": newDate.getMilliseconds()
  };

  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (newDate.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }

  return format;
};

//微信小程序比较版本号
const compareVersion = (v1, v2) => {
  v1 = v1.split('.');
  v2 = v2.split('.');
  let len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push('0');
  }

  while (v2.length < len) {
    v2.push('0');
  }

  for (let i = 0; i < len; i++) {
    let num1 = parseInt(v1[i]);
    let num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }

  return 0;
};

//用来判断自定义顶部导航栏是否支持当前版本，基础库2.4.3，微信版本7.0.0
const getCompareVersionStatus = () => {
  return compareVersion(wx.getSystemInfoSync().SDKVersion, '2.4.3') > -1 && compareVersion(wx.getSystemInfoSync().version,
    '7.0.0') > -1;
};

//支付函数
const getPay = paramObj => {
  //支付函数参数
  // paramObj = {
  //   orderId:'',
  //   paymentSuccess: Function,//返回res
  //   paymentError: Function,//返回toost信息
  // }
  // 暂时只支持微信小程序支付，所以参数默认
  app.uniAjax({
    url: Pay,
    type: 'POST',
    data: {
      payment_code: 'Wechat',
      trade_type: 'JSAPI',
      order_id: paramObj.orderId
    },
    loading: {
      msg: '申请支付',
      mask: true
    }
  }).then(res => { //调用接口成功
    let data = res.data;
    if (data.code > 0) {
      let payParam = res.data.data[0];
      wx.showLoading({
        mask: true
      });
      wx.requestPayment({
        "timeStamp": payParam.timeStamp,
        "nonceStr": payParam.nonceStr,
        "package": payParam.package,
        "signType": "MD5",
        "paySign": payParam.paySign,
        complete: res => {
          if (res.errMsg == "requestPayment:fail cancel") {
            //支付失败
            uni.showToast({
              title: '支付失败',
              icon: 'none',
              duration: 2000,
              mask: true
            });
            paramObj.paymentError('支付失败');
          } else if (res.errMsg == "requestPayment:ok") {
            uni.hideLoading();
            paramObj.paymentSuccess();
            //支付成功---查询支付状态
            // app.wxAjax({
            //   url: TradeStatus,
            //   apiversion: 'v1',
            //   type: 'GET',
            //   needAccessToken: true,
            //   loading: {
            //     msg: '',
            //     mask: true
            //   },
            //   data: {
            //     orderId: paramObj.orderId,
            //     queryType: 'pay'
            //   }
            // }, res => {
            //   if (res.data.status == '1') {
            //     paramObj.paymentSuccess(res.data);
            //   } else {
            //     paramObj.paymentError(res.data.status_txt);
            //   }
            // });
          } else {
            //支付失败
            uni.showToast({
              title: res.errMsg,
              icon: 'none',
              duration: 2000,
              mask: true
            });
            paramObj.paymentError(res.errMsg);
          }
        }
      });
    } else {
      wx.showToast({
        title: data.message,
        icon: 'none',
        duration: 1000,
        mask: true
      });
      paramObj.paymentError(data.message);
    }
  }).catch(res => { //调用接口失败
    wx.showToast({
      title: data.message,
      icon: 'none',
      duration: 1000,
      mask: true
    });
  });
};


const isSuccessCode = (code) => {
  let isSucess = false;
  if (code == 1) {
    isSucess = true;
  }
  return isSucess;
}

//从地址列表中获取全局地址
const setGlobalAddr = addressList => {
  let globalAddr = app.globalData.globalAddr;
  let defAddr = {};
  for (let val of addressList) {
    //列表中已经存在全局地址--更新数据
    if (val.id == globalAddr.id) {
      app.globalData.globalAddr = val;
      return val;
    }
    if (val.defaultStatus == 1) {
      defAddr = val;
    }
  }
  // 列表中不存在全局地址时
  if (defAddr.id) {
    app.globalData.globalAddr = defAddr;
  } else {
    app.globalData.globalAddr = addressList[0] || {};
  }
  return app.globalData.globalAddr;
}
module.exports = {
  app: app, //应用实例----如果页面引入当前公共函数就不需要再获取应用实例
  thumbUrl: thumbUrl, //获取图片url
  formatImageUrl: formatImageUrl, //
  formatPrice: formatPrice,
  formatNumber: formatNumber, //格式化数字， -- 如传入 10返回10， 1 返回 01 
  getPay: getPay, //微信支付
  clickType: clickType, //点击事件,
  compareVersion: compareVersion, //微信小程序比较版本号
  getCompareVersionStatus: getCompareVersionStatus, //用来判断自定义顶部导航栏是否支持当前版本，基础库2.4.3，微信版本7.0.0
  exit: exit, //退出登录
  isSuccessCode: isSuccessCode, //接口返回正确
  setGlobalAddr: setGlobalAddr, //登录后设置全局默认地址
};
