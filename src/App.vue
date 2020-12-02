<script>
  //获取api
  import {
    GetOpenIdByCode
  } from "@/utils/api";
  //获取基础配置信息
  const {
    configRouter,
    currentEvn,
    appVersion,
    business_key,
    paltform,
    source
  } = require("./config/config.js");
  let versionStr = appVersion.toString().split('').join('.');
  export default {
    onLaunch: function() {
      // #ifdef MP-WEIXIN
      this.checkHasNewVersion();
      this.globalData.openid = uni.getStorageSync('openid') || '';
      uni.getSystemInfo({
        success: res => {
          let {
            model,
            system,
            windowHeight,
            statusBarHeight
          } = res;
          this.globalData.topNavHeight = statusBarHeight; //获取设备顶部窗口的高度

          this.globalData.windowHeight = windowHeight;

          if (model.indexOf("iPhone X") > -1 || model.indexOf("iPhone 11") > -1) {
            //判断用户手机是不是iPhone X
            this.globalData.isIpx = true;
          }

          if (system.indexOf("Android") > -1 || system.indexOf("android") > -1) {
            this.globalData.mobileSystems = "Android";
          } else {
            this.globalData.mobileSystems = "IOS";
          }
        }
      });
      // 登录获取用户openid
      this.getOpenid(true);
      // #endif
      // 获取顶部导航条高度
      this.getNavBarHeight();
    },
    methods: {
      // 获取顶部导航条高度
      getNavBarHeight: function() {
        var [navH, pt, pb] = ['44', '0', '0'];
        //#ifdef MP-WEIXIN
        let menuObj = wx.getMenuButtonBoundingClientRect();
        navH = menuObj.height;
        pt = menuObj.top;
        pb = '5';
        //#endif
        this.globalData.navBar = {
          navH: navH,
          pt: pt,
          pb: pb,
          height: navH * 1 + pt * 1 + pb * 1 + 'px'
        }
      },
      // 检测是否存在新版本
      checkHasNewVersion: function() {
        if (uni.canIUse('getUpdateManager')) {
          const updateManager = uni.getUpdateManager();
          updateManager.onCheckForUpdate(function(res) {
            // 请求完新版本信息的回调
            if (res.hasUpdate) {
              updateManager.onUpdateReady(function() {
                uni.showModal({
                  title: '更新提示',
                  content: '新版本已经准备好，是否重启应用？',
                  success: function(res) {
                    // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                    if (res.confirm) {
                      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                      updateManager.applyUpdate();
                    }
                  }
                });
              });
              updateManager.onUpdateFailed(function() {
                // 新的版本下载失败
                uni.showModal({
                  title: '已经有新版本了哟~',
                  content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
                });
              });
            }
          });
        }
      },
      // 获取openid
      getOpenid: function(needTryAgain) {
        // needTryAgain 是否需要重复尝试获取openId
        uni.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            this.uniAjax({
              url: GetOpenIdByCode,
              type: 'POST',
              data: {
                code: res.code
              }
            }).then(data => {
              let resData = data.data;
              if (resData.code == 200) {
                let {
                  openid,
                  token
                } = resData.data;
                // this.globalData.userInfo = resData.data;
                // wx.setStorageSync('access_token', token);
                wx.setStorageSync('openid', openid);
              } else {
                needTryAgain && tryAgain();
              }
            });
          },
          fail: res => {
            needTryAgain && tryAgain();
          }
        });
        //重新尝试获取openid
        var tryAgain = () => {
          const {
            getOpenidTimes
          } = this.globalData;
          if (getOpenidTimes > 10) return;
          this.globalData.getOpenidTimes++;
          let maxTimes = getOpenidTimes > 5 ? 5 : getOpenidTimes;
          let tempTime = setTimeout(() => {
            this.getOpenid();
            clearTimeout(tempTime);
          }, 3000 * maxTimes);
        }
      },
      //路由跳转---验证用户有没有登陆(是否绑定手机号)
      toLink: function(url, stop) {
        //stop -- true 阻止用户在登录页登录后向下一页跳转，返回上一页 || false 默认不阻止
        if (this.isGuest()) {
          //未登录状态,将用户跳转至登录页
          this.globalData.configRouter.fromlink = url;
          this.globalData.configRouter.toLinkStatus = !stop;
          url = this.globalData.configRouter.loginUrl; //登陆页url
          uni.navigateTo({
            url: url
          });
        } else {
          url == '' ? url = '/pages/home/index' : ''; //如果为空跳回首页

          if (url.indexOf('/pages/member/my/index') >= 0 || url.indexOf('/pages/home/index') >= 0 || url.indexOf(
              '/pages/cart/index') >= 0) {
            //tab页
            uni.switchTab({
              url: url
            });
          } else {
            uni.navigateTo({
              url: url
            });
          }
        }
      },
      //是否为游客
      isGuest: function() {
        let access_token = uni.getStorageSync('access_token') || '';

        if (!access_token) {
          return true;
        }

        return false;
      },
      //api请求函数--请使用下面 uniAjax 方法
      wxAjax: function(data, callbackFun) {
        /**data参数格式类型
         * data = {
         *   url:'',
         *   data:{},
         *   type:'GET',//默认为GET类型
         *   loading:{//不传loading 不弹出，传了默认 msg为''
         *     msg:'加载中',
         *     mask:true,//是否显示透明蒙层，防止触摸穿透，默认：true
         *   },
         *   needAccessToken:false,//是否需要登陆，默认false
         * }
         */
        let apiversion = data.apiversion ? data.apiversion + '/' : 'v2/';

        if (data.apiversion == '') { //用于不需要版本号的接口
          apiversion = '';
        }

        if (!data.data) data.data = {};
        let access_token = wx.getStorageSync('access_token') || '';
        if (data.needAccessToken) {
          if (!access_token) {
            let currentPages = getCurrentPages();
            this.globalData.configRouter.fromlink = '/' + currentPages[currentPages.length - 1].route; //当前页url

            return wx.navigateTo({
              url: this.globalData.configRouter.loginUrl //登陆页url

            });
          }
        }
        data.loading && wx.showLoading({
          title: data.loading.msg ? data.loading.msg : '',
          mask: data.loading.mask ? data.loading.mask : true
        });

        const {
          bd_id,
          activity_id,
          share_member_id
        } = this.globalData.buryingPoint; //埋点公共参数，用于bd人员统计业绩、活动场次、分享者

        let buryingPointParam = '&bd_id=' + bd_id + '&activity_id=' + activity_id + '&share_member_id=' +
          share_member_id; //获取请求头所需api签名信息

        return wx.request({
          url: this.globalData.configRouter.apiHost + data.url +
            '?platform=miniprogram&version=' + this.globalData.configRouter.version +
            '&device_token=' + (this.globalData.openid || 'miniprogram') + buryingPointParam + '&business_key=' +
            business_key,
          //url,
          dataType: 'json',
          data: data.data,
          method: data.type ? data.type : 'GET',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'authorization': access_token || ''
          },
          success: res => {
            if (res.data && res.data.time) {
              //更新服务器与本地时间的时间差,用于修复倒计时误差问题
              this.globalData.timeDifference = res.data.time - Date.parse(new Date()) / 1000;
            }

            data.loading && wx.hideLoading();

            if (res.data.code * 1 == -20002 || res.data.status * 1 == -20002) {
              //access_token过期需要重新登陆
              wx.setStorageSync('access_token', '');
              wx.setStorageSync('access_token_fail', true);
              let currentPages = getCurrentPages();
              if (currentPages.length > 0) this.globalData.configRouter.fromlink = '/' + currentPages[
                currentPages.length - 1].route; //当前页url

              return wx.navigateTo({
                url: this.globalData.configRouter.loginUrl //登陆页url
              });
            }

            callbackFun(res);
          },
          fail: res => {
            data.loading && wx.hideLoading();
            res.data = {
              status: "-1",
              results: [],
              msg: '网络不稳，请稍后再尝试',
              status_txt: '网络不稳，请稍后再尝试'
            };
            callbackFun(res);
          }
        });
      },
      //api请求函数
      uniAjax: function(data) {
        /**data参数格式类型
         * data = {
         *   url:'',
         *   data:{},
         *   type:'GET',//默认为GET类型
         *   loading:{//不传loading 不弹出，传了默认 msg为''
         *     msg:'加载中',
         *     mask:true,//是否显示透明蒙层，防止触摸穿透，默认：true
         *   },
         *   needAccessToken:false,//是否需要登陆，默认false
         * }
         */
        if (!data.data) data.data = {};
        let access_token = uni.getStorageSync('access_token') || '';
        const {
          fromlink,
          loginUrl,
          apiHost,
          version,
        } = this.globalData.configRouter;
        if (data.needAccessToken) {
          if (!access_token) {
            let currentPages = getCurrentPages();
            this.globalData.configRouter.fromlink = '/' + currentPages[currentPages.length - 1].route; //当前页url
            //去登陆页
            return uni.navigateTo({
              url: loginUrl
            });
          }
        }
        data.loading && uni.showLoading({
          title: data.loading.msg ? data.loading.msg : '',
          mask: data.loading.mask ? data.loading.mask : true
        });
        return new Promise((resolve, reject) => {
          uni.request({
            url: apiHost + data.url + '?platform=' + paltform + '&version=' + version,
            dataType: 'json',
            data: data.data,
            method: data.type ? data.type : 'GET',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'token': access_token || '',
              // 'openid': this.globalData.openid || ''
            },
            success: res => {
              // if (res.data && res.data.time) {
              //   //更新服务器与本地时间的时间差,用于修复倒计时误差问题
              //   this.globalData.timeDifference = res.data.time - Date.parse(new Date()) / 1000;
              // }

              data.loading && uni.hideLoading();

              if (res.data.code * 1 == -110 || res.data.status * 1 == 403) {
                //access_token过期需要重新登陆
                wx.setStorageSync('access_token', '');
                wx.setStorageSync('access_token_fail', true);
                let currentPages = getCurrentPages();
                if (currentPages.length > 0)
                  //当前页url
                  this.globalData.configRouter.fromlink = '/' + currentPages[currentPages.length - 1].route;
                return wx.navigateTo({
                  url: loginUrl //登陆页url
                });
              }
              resolve(res);
            },
            fail: res => {
              data.loading && uni.hideLoading();
              res.data = {
                code: "-1",
                data: [],
                message: '网络不稳，请稍后再尝试',
                msg: '网络不稳，请稍后再尝试',
                status_txt: '网络不稳，请稍后再尝试'
              };
              reject(res);
            }
          });
        })
      }
    },
    globalData: {
      version: versionStr,
      getOpenidTimes: 0, //getOpenid方法调用次数
      timeDifference: 0, //服务器与本地时间的时间差,用于修复倒计时误差问题
      openid: '', //微信openid
      mobileSystems: '', //用户手机系统 --- 获取不成功时默认 '',成功时 Android || IOS
      isIpx: false, //是否是iphoneX,底部需预留68rpx
      windowHeight: 0, //手机视窗高度
      wechatScene: '', //微信场景
      //顶部导航条
      navBar: {
        navH: '44',
        pt: '0',
        pb: '0',
        height: '44px', //顶部导航条高度
      },
      userInfo: {
        token: "",
        username: "",
        nickname: "",
        phone: "",
        status: 1,
        createTime: "",
        icon: null,
        gender: null,
        birthday: null,
        integration: null,
        growth: null,
        weixinOpenid: null,
        sessionKey: null,
        invitecode: null,
        blance: 0
      },
      globalAddr: {
        "city": "",
        "cityId": "",
        "defaultStatus": 0,
        "detailAddress": "",
        "id": "",
        "latitude": 0,
        "longitude": 0,
        "name": "",
        "phoneNumber": "",
        "postCode": "",
        "province": "",
        "provinceId": "",
        "region": "",
        "regionId": ""
      },
      selectCoupon: {}, //选中的优惠券
      cartQuantity: 0,
      configRouter: {
        fromlink: '', //登陆后需要跳转的链接
        toLinkStatus: false, //ture表示通多tolink方式跳转网页
        loginUrl: '/pages/login/index', //登陆页url,自己配置写死
        apiHost: configRouter.apiHost, //api请求host域名
        imgHost: configRouter.imgHost, //图片服务器请求host域名
        version: appVersion, //版本号，规则为三位数字类似v1.0.0,示例 100 对应 v1.0.0，101 对应 v1.0.1
        paltform: paltform,
        source: source
      }
    },
  }
</script>

<style lang="scss">
  @import "./app.scss";
</style>
