<template>
  <view class="content">
    <NavBar backType="2" title="支付结果" shadow="1"></NavBar>
    <!-- 返回关闭按钮 -->
    <BannerImg class="icon" width="120" height="120" banner-url="/static/logo.png"></BannerImg>
    <view class="f32 c_text_title texC mt26">支付成功</view>
    <!-- <view class="f30 c_text texC mt22">您的包裹将会在<span class="c_text_red ml10 mr10">2020.09.20</span>前发出</view> -->
    <view class="btnBox flex flexJustifyC c_text_title f28 texC">
      <view class="mr48" @click="handleClick('home')">回到首页</view>
      <view @click="handleClick('orderDetail')">查看订单</view>
    </view>
  </view>
</template>
<script>
  const util = require("@/utils/util.js");
  const app = getApp();
  import {
    GetOrderDetailInfo
  } from "@/utils/api";
  const inputClearIcon = require("@/static/common-icon/input-clear.png");
  export default {
    data() {
      return {
        img: {
          inputClearIcon: inputClearIcon
        },
        tel: '',
        yzm: '',
        sendYzm: {
          yzmText: "发送验证码",
          countDown: 0,
          yzmTextColor: false
        },
        loginBtnStatus: false
      }
    },
    onLoad(options) {
      // app.uniAjax({url: GetOrderDetailInfo}).then(res =>{//调用接口成功
      //   const {code, message, data} = res.data;
      //   if(code == 1 && data[0]){
      //     if(data[0].order_status == 1){

      //     }
      //   }else{
      //     uni.showToast({
      //       title: message,
      //       icon: 'none',
      //       duration: 2000
      //     });
      //   }
      // }).catch(res =>{//调用接口失败
      //   uni.showToast({
      //     title: res.data.message,
      //     icon: 'none',
      //     duration: 2000
      //   });
      // });
    },
    methods: {
      handleClick: function(type) {
        switch (type) {
          case 'home':
            {
              uni.switchTab({
                url: '/pages/home/index'
              });
              break;
            }
          case 'orderDetail':
            {
              uni.redirectTo({
                url: '/pages/member/order-list/index'
              });
              break;
            }
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "./index.scss";
</style>
