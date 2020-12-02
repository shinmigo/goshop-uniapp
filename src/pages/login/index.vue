<template>
  <view class="content">
    <NavBar backType="2"></NavBar>
    <!-- 返回关闭按钮 -->
    <BannerImg class="logo" width="304" height="102" :banner-url="img.logoIcon"></BannerImg>
    <view class="inputBox flex flexAlignC spaceBetween">
      <input placeholder="输入手机号码" placeholder-class="placeholder f28" type="number" maxlength="11" :value="tel" @input="handleInput"
        data-type="tel" />
      <view v-if="tel" class="close" @tap="handleClick" data-type="clearTel">
        <BannerImg width="28" ratio="1" :banner-url="img.inputClearIcon"></BannerImg>
      </view>
      <view :class="'yzm f24 ' + (sendYzm.yzmTextColor ? 'c_text_green' : 'c_text_grey')" @tap="getTelYzm">{{sendYzm.yzmText}}</view>
    </view>
    <view class="inputBox flex spaceBetween">
      <input placeholder="输入验证码" placeholder-class="placeholder" type="number" maxlength="4" :value="yzm" @input="handleInput"
        data-type="yzm" />
      <view v-if="yzm" class="close mr20" @tap="handleClick" data-type="clearYzm">
        <BannerImg width="28" ratio="1" :banner-url="img.inputClearIcon"></BannerImg>
      </view>
    </view>
    <view class="c_text f24 ml48">登录即代表你同意<span class="c_text_grey underline" @tap="handleClick" data-type="userResisterProtocol">《服务协议》</span>和<span
        class="c_text_grey underline" @tap="handleClick" data-type="privacyProtectionPolicy">《隐私政策》</span></view>
    <view :class="(loginBtnStatus ? 'bg-image' : 'bg-image-disable') +' btn texC c_text_inverse f32'" @tap="loginByYzm">登录</view>
    <!-- #ifdef MP-WEIXIN || APP-NVUE || APP-PLUS-NVUE -->
    <view class="lineBox flex flexAlignC c_text_grey f28">
      <view class="line mr16 flexGrow1"></view>其他登录方式<view class="line ml16 flexGrow1"></view>
    </view>
    <!-- #endif -->
    <view class="otherLogin flex flexJustifyC c_text f24 texC">
      <!-- #ifdef MP-WEIXIN -->
      <view class="loginItem">
        <view class="loginTypeIcon">
          <BannerImg width="96" ratio="1" :bannerUrl="img.wxIcon"></BannerImg>
        </view>
        <button class="wxButton" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"></button>
        <view class="mt18">微信</view>
      </view>
      <!-- #endif -->
      <!-- #ifdef APP-NVUE || APP-PLUS-NVUE -->
      <view v-if="mobileSystems == 'IOS'" class="loginItem">
        <view class="loginTypeIcon">
          <BannerImg width="96" ratio="1" :bannerUrl="img.appleIcon"></BannerImg>
        </view>
        <view class="mt18">Apple</view>
      </view>
      <!-- #endif -->
    </view>
  </view>
</template>
<script>
  const util = require("@/utils/util.js");
  const app = getApp();
  import {
    GetSmsCode,
    LoginByCode,
    LoginByWeixin
  } from "@/utils/api";
  const inputClearIcon = require("@/static/common-icon/input-clear.png");
  const wxIcon = require("@/static/common-icon/wx-login.png");
  const appleIcon = require("@/static/common-icon/apple-login.png");
  const logoIcon = require("@/static/login-logo.png");
  export default {
    data() {
      return {
        img: {
          inputClearIcon: inputClearIcon,
          wxIcon: wxIcon,
          appleIcon: appleIcon,
          logoIcon: logoIcon
        },
        tel: '',
        yzm: '',
        sendYzm: {
          yzmText: "发送验证码",
          countDown: 0,
          yzmTextColor: false
        },
        loginBtnStatus: false,
        mobileSystems: app.globalData.mobileSystems
      }
    },
    onLoad() {

    },
    methods: {
      handleInput: function(e) {
        const {
          type
        } = e.currentTarget.dataset;
        const value = e.detail && e.detail.value || '';
        switch (type) {
          case 'tel':
            {
              this.tel = value;
              this.loginBtnStatus = this.yzm.length == 4 && value.length == 11;
              this.sendYzm.yzmTextColor = this.sendYzm.countDown == 0 && value.length == 11;
              break;
            }
          case 'yzm':
            {
              this.yzm = value;
              this.loginBtnStatus = this.tel.length == 11 && value.length == 4;
              break;
            }
        }
      },
      handleClick: function(e) {
        const {
          type
        } = e.currentTarget.dataset;
        switch (type) {
          case 'clearTel':
            {
              this.tel = '';
              this.loginBtnStatus = false;
              this.sendYzm.yzmTextColor = this.sendYzm.countDown == 0 && this.tel.length == 11;
              break;
            }
          case 'clearYzm':
            {
              this.yzm = '';
              this.loginBtnStatus = false;
              break;
            }
          case 'userResisterProtocol':
          case 'privacyProtectionPolicy':
            {
              uni.navigateTo({
                url: '/pages/member/rule/index?type=' + type
              })
              break;
            }
        }
      },
      //获取手机验证码
      getTelYzm: function(event) {
        var self = this;
        if (self.sendYzm.countDown != 0) return; //倒计时中不能重复请求

        if (self.tel.length != 11) return wx.showToast({
          title: '请输入手机号',
          icon: 'none',
          duration: 2000
        });
        if (!/^1[3456789]{1}[0-9]{9}$/.test(self.tel)) return wx.showToast({
          title: '手机号格式错误',
          icon: 'none',
          duration: 2000
        });
        // var postData = {
        //   type: 'm_login',
        //   mobile: this.tel
        // };

        // if (self.imgCode && event && event.target.dataset.yzm != "imgYzm") {
        //   postData['code'] = self.imgCode, postData['captchakey'] = self.captchakey;
        // }

        app.uniAjax({
          url: GetSmsCode,
          type: 'POST',
          data: {
            mobile: self.tel
          },
          loading: {
            msg: '',
            mask: true
          }
        }).then(res => { //调用接口成功
          // if (res.data.code == '20') {
          //   //短信发送太频繁需要校验验证码
          //   let data = res.data.results[0];
          //   self.setData({
          //     imgYzmSwitch: true,
          //     //图形验证码开关
          //     imgUrl: util.imgYzmUrl(data.url),
          //     //图形验证码图片url
          //     imgCode: '',
          //     imgYzmStatus: false,
          //     captchakey: data.captchaKey //图形验证码captchakey

          //   });
          //   return;
          // }
          if (res.data.code == 1) {
            res.data.message = '验证码已发送';
            let countDown = 120; //默认倒计时120s
            let countDownInt = setInterval(function() {
              if (countDown == 0) {
                self.sendYzm = {
                  yzmText: "发送验证码",
                  countDown: countDown,
                  yzmTextColor: self.tel.length == 11 ? true : false
                };
                clearInterval(countDownInt);
              } else {
                self.sendYzm = {
                  yzmText: "已发送(" + countDown + "s)",
                  countDown: countDown,
                  yzmTextColor: true
                };
              }
              countDown--;
            }, 1000);
          }
          uni.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
        }).catch(res => { //调用接口失败

        });
      },
      //通过验证码登录
      loginByYzm: function() {
        const {
          tel,
          yzm,
          loginBtnStatus
        } = this;
        if (!loginBtnStatus) {
          return
        }
        app.uniAjax({
          url: LoginByCode,
          type: 'POST',
          data: {
            code: yzm,
            mobile: tel
          },
          loading: {
            msg: '',
            mask: true
          }
        }).then(res => { //调用接口成功
          const {
            data,
            message,
            code
          } = res.data;
          uni.showToast({
            title: message,
            icon: 'none',
            duration: 2000
          });
          if (code == 1 && data[0]) {
            this.bindData(data[0]);
          }
        }).catch(res => { //调用接口失败
          uni.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
        });
      },
      getPhoneNumber: function(e) { //微信授权获取用户手机号，进行快捷登录
        let self = this;
        if (e.detail.encryptedData) {
          wx.checkSession({
            success() {
              // session_key 未过期，并且在本生命周期一直有效
              self.wxlineLogin({
                openid: app.globalData.openid,
                iv: e.detail.iv,
                encryptedData: e.detail.encryptedData
              })
            },
            fail() {
              // session_key 已经失效，需要重新执行登录流程
              app.getOpenid();
              uni.showToast({
                title: '授权登录失败，请重试',
                icon: 'none',
                duration: 1500,
                mask: false,
              });
            }
          })
        }
      },
      wxlineLogin: function(postData) {
        app.uniAjax({
          url: LoginByWeixin,
          type: 'POST',
          data: postData,
          loading: {
            msg: '',
            mask: true
          }
        }).then(res => { //调用接口成功
          const {
            data,
            code,
            message
          } = res.data;
          uni.showToast({
            title: message,
            icon: 'none',
            duration: 2000
          });
          if (code == 1) {
            this.bindData(data[0]);
          }
        }).catch(res => { //调用接口失败
          uni.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
        });
      },
      //登录后的一些数据绑定
      bindData: function(data) {
        uni.setStorageSync('access_token', data.token);
        app.globalData.userInfo = data.info;
        this.backToPage();
      },
      // 登录后返回页面
      backToPage: function() {
        if (app.globalData.configRouter.toLinkStatus) {
          //用tolink方式跳转的时候---使用返回页面方式
          app.globalData.configRouter.toLinkStatus = false; //重置toLinkStatus
          if ('/pages/member/my/index'.indexOf(app.globalData.configRouter.fromlink) >= 0) {
            //去往我的页面时候
            uni.switchTab({
              url: app.globalData.configRouter.fromlink
            });
          } else {
            if (app.globalData.configRouter.fromlink) {
              uni.redirectTo({
                url: app.globalData.configRouter.fromlink
              });
            } else {
              uni.switchTab({
                url: '/pages/home/index'
              });
            }
          }
        } else {
          //非用tolink方式跳转的时候---使用返回页面方式
          if (getCurrentPages().length > 1) {
            uni.navigateBack({
              delta: 1
            });
          } else {
            uni.switchTab({
              url: '/pages/home/index'
            });
          }
        }
      },
    }
  }
</script>

<style lang="scss">
  @import "./index.scss";
</style>
