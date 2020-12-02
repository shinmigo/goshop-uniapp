<template>
  <view class="content">
    <view>
      <image class="bg" src="../../../static/myinfo/member_top_bg.png" mode="aspectFill"></image>
      <view class="user-section">
        <view class="user-info-box" @click="toEditUserInfoAction">
          <view class="portrait">
            <BannerImg :bannerUrl="userInfo.user_pictrue" bgImgType="2" width="100" height="100" borderRadius="100"></BannerImg>
          </view>
          <view class="user-info-box">
            <text class="username f36 texL">{{userInfo.user_name}}</text>
          </view>
        </view>
        <view class="user-account-section">
          <view class="user-account-item" @click="toCouponAction">
            <text class="user-account-num f40 texC">{{userInfo.user_coupon}}</text>
            <text class="user-account-item f24 texC">优惠券</text>
          </view>
          <view class="rectangle"></view>
          <view class="user-account-item" @click="toPointAction">
            <text class="user-account-num f40 texC">{{userInfo.user_point}}</text>
            <text class="user-account-item f24 texC">积分</text>
          </view>
          <view class="rectangle"></view>
          <view class="user-account-item" @click="toBalanceAction">
            <text class="user-account-num f40 texC">{{userInfo.user_balance}}</text>
            <text class="user-account-item f24 texC">余额</text>
          </view>
          <view class="rectangle"></view>
          <view class="user-account-item" @click="toVoucherAction">
            <text class="user-account-num f40 texC">{{userInfo.user_voucher}}</text>
            <text class="user-account-item f24 texC">提货券</text>
          </view>
        </view>
      </view>
    </view>
    <view class="cover-container">
      <view class="header flex flexAlignC spaceBetween flexAlignSelfStart" @click="toOrderList(0)">
        <view class="my-order-title flexGrow1">我的订单</view>
        <view class="check-more-title">查看全部</view>
        <BannerImg class="mr24" width="24" height="24" :bannerUrl="arrowRightIcon"></BannerImg>
      </view>
      <view class="order-seperate-line"></view>
      <view class="order-section">
        <view class="order-item" hover-class="common-hover" @click="toPayOrderAction(1)">
          <view class="flex flexColumn posiR">
            <view v-if="userInfo.wait_pay_num" class="order-bedge-value order-bedge-top" :style="{width: userInfo.wait_pay_num_width + 'rpx;'}">{{userInfo.wait_pay_num}}</view>
            <image class="yticon" src="../../../static/myinfo/member_paying_icon.png"></image>
          </view>
          <text class="icon-shouhoutuikuan texC f24">待付款</text>
        </view>
        <view class="order-item" hover-class="common-hover" @click="toSendingOrderAction(2)">
          <view class="flex flexColumn posiR">
            <view v-if="userInfo.wait_send_num" class="order-bedge-value order-bedge-top" :style="{width: userInfo.wait_send_num_width + 'rpx;'}">{{userInfo.wait_send_num}}</view>
            <image class="yticon" src="../../../static/myinfo/member_sending_icon.png"></image>
          </view>
          <text class="icon-shouhoutuikuan texC f24">待发货</text>
        </view>
        <view class="order-item" hover-class="common-hover" @click="toWaitingOrderAction(3)">
          <view class="flex flexColumn posiR">
            <view v-if="userInfo.wait_receive_num" class="order-bedge-value order-bedge-top" :style="{width: userInfo.wait_receive_num_width + 'rpx;'}">{{userInfo.wait_receive_num}}</view>
            <image class="yticon" src="../../../static/myinfo/member_waiting_icon.png"></image>
          </view>
          <text class="icon-shouhoutuikuan texC f24">待收货</text>
        </view>
        <view class="order-item" hover-class="common-hover" @click="torefundOrderAction">
          <view class="flex flexColumn posiR">
            <view v-if="userInfo.refund_num" class="order-bedge-value order-bedge-top" :style="{width: userInfo.refund_num_width + 'rpx;'}">{{userInfo.refund_num}}</view>
            <image class="yticon" src="../../../static/myinfo/member_refund_icon.png"></image>
          </view>
          <text class="icon-shouhoutuikuan texC f24">退款/售后</text>
        </view>
      </view>
    </view>
    <view class="cover-container">
      <view class="founction-section">
        <view class="function-header flex flexAlignC spaceBetween flexAlignSelfStart" @click="toManagerAddressAction">
          <view class="function-item-name flexGrow1">收货地址</view>
          <view class="function-item-des">去管理</view>
          <BannerImg class="mr24" width="24" height="24" :bannerUrl="arrowRightIcon"></BannerImg>
        </view>
        <view class="function-header flex flexAlignC spaceBetween flexAlignSelfStart" @click="toMyRefillCardAction">
          <view class="function-item-name flexGrow1">我的充值卡</view>
          <view class="function-item-des">{{userInfo.user_refillcard}}</view>
          <BannerImg class="mr24" width="24" height="24" :bannerUrl="arrowRightIcon"></BannerImg>
        </view>
        <view class="function-header flex flexAlignC spaceBetween flexAlignSelfStart" @click="toConnectUsAction">
          <view class="function-item-name flexGrow1">联系我们</view>
          <view class="function-item-des">周一至周五 10:00-20:00</view>
          <BannerImg class="mr24" width="24" height="24" :bannerUrl="arrowRightIcon"></BannerImg>
        </view>
        <view class="function-header flex flexAlignC spaceBetween flexAlignSelfStart" @click="toSetAction">
          <view class="function-item-name flexGrow1">设置</view>
          <BannerImg class="mr24" width="24" height="24" :bannerUrl="arrowRightIcon"></BannerImg>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  const arrowRightIcon = require("@/static/common-icon/arrow-right.png");
  import {
    GetCurrentMemberInfo,
		GetUserOderStatusCount
  } from '@/utils/api';
  const util = require("@/utils/util.js");
  const app = getApp();
  export default {
    data() {
      return {
        userInfo: {
          user_pictrue: '',
          user_name: '',
          user_coupon: '',
          user_point: '',
          user_balance: '',
          user_voucher: '',
          user_refillcard: '',
          wait_pay_num: '',
          wait_send_num: '',
          wait_receive_num: '',
          refund_num: '',
          wait_pay_num_width: 0,
          wait_send_num_width: 0,
          wait_receive_num_width: 0,
          refund_num_width: 0,
        },
        arrowRightIcon: arrowRightIcon,
      }
    },
    onShow() {
      if (app.isGuest()) {
        this.userInfo.user_name = '点击登录';
        this.userInfo.user_coupon = '-';
        this.userInfo.user_point = '-';
        this.userInfo.user_balance = '-';
        this.userInfo.user_voucher = '-';
        this.userInfo.wait_pay_num = '';
        this.userInfo.wait_send_num = '';
        this.userInfo.wait_receive_num = '';
        this.userInfo.refund_num = '';
        this.userInfo.user_pictrue = '';
        this.userInfo.user_refillcard = '';
        return;
      }
      app.uniAjax({
        url: GetCurrentMemberInfo,
        type: 'Get',
        loading: {
          msg: '加载中',
          mask: true
        }
      }).then(res => {
        if (util.isSuccessCode(res.data.code)) {
          console.log("uni-app 获取个人信息=== res.data.code === ", res, res.data.code);
          app.globalData.userInfo = Object.assign(app.globalData.userInfo, res.data.data[0]);
          this.userInfo.user_name = (app.globalData.userInfo.nickname || app.globalData.userInfo.name) || app.globalData.userInfo.mobile;
          this.userInfo.user_pictrue = util.thumbUrl(app.globalData.userInfo.avatar);
					this.userInfo.user_balance = app.globalData.userInfo.balance || '0';
					this.userInfo.user_point = app.globalData.userInfo.point || '0';
					
					//暂时没有优惠券、提货券、充值卡、售后，添加默认值
          this.userInfo.user_coupon = '0';
          this.userInfo.user_voucher = '0'
          this.userInfo.user_refillcard = ''
					this.userInfo.refund_num = '';
					this.userInfo.refund_num_width = '';
        }
      });
			app.uniAjax({
				url: GetUserOderStatusCount,
				type: 'Get',
			}).then(res => {
				if (util.isSuccessCode(res.data.code)) {
					//订单数量
					res.data.data.forEach(item => {
						let bounds = this.getOrderBedgeValue(item.count)
						if (item.order_status == 1) {
							this.userInfo.wait_pay_num = bounds.countBedgeValue;
							this.userInfo.wait_pay_num_width = bounds.bedgeWidth;
						} else if (item.order_status == 3) {
							this.userInfo.wait_send_num = bounds.countBedgeValue;
							this.userInfo.wait_send_num_width = bounds.bedgeWidth;
						} else if (item.order_status == 4) {
							this.userInfo.wait_receive_num_width = bounds.countBedgeValue;
							this.userInfo.wait_receive_num_width = bounds.bedgeWidth;
						}
					});
				}
			});
    },
    onLoad() {},
    methods: {
      //用户信息
      toEditUserInfoAction() {
        app.toLink('/pages/member/edit-user/index', true);
      },
      //优惠券
      toCouponAction() {
				uni.showToast({
					title:'功能暂未开放'
				})
        // app.toLink('/pages/member/coupon/index');
      },
      // 积分
      toPointAction() {
        app.toLink('/pages/member/point/index');
      },
      // 余额
      toBalanceAction() {
        app.toLink('/pages/member/balance/index');
      },
      //订单列表
      toOrderList(state) {
        app.toLink('/pages/member/order-list/index?state=0');
      },
      //待付款
      toPayOrderAction(state) {
        app.toLink('/pages/member/order-list/index?state=1');
      },
      //待收货
      toWaitingOrderAction(state) {
        app.toLink('/pages/member/order-list/index?state=3');
      },
      //待发货订单
      toSendingOrderAction(state) {
        app.toLink('/pages/member/order-list/index?state=2');
      },
      //售后订单
      torefundOrderAction() {
				uni.showToast({
					title:'功能暂未开放'
				})
        // app.toLink('/pages/member/refund-list/index');
      },
      //管理收货地址
      toManagerAddressAction() {
        app.toLink('/pages/member/address/index');
      },
      //联系我们
      toConnectUsAction() {
		    uni.showToast({
					title:'功能暂未开放'
				})
      },
      //设置
      toSetAction() {
        app.toLink('/pages/member/setting/index');
      },
      //我的充值卡 
      toMyRefillCardAction() {
				uni.showToast({
					title:'功能暂未开放'
				})
        // app.toLink('/pages/member/rechargeable-card/index');
      },
      //我的提货券
      toVoucherAction() {
				uni.showToast({
					title:'功能暂未开放'
				})
        // app.toLink('/pages/member/gift-voucher/index');
      },
      //获取相关未读的数量
      getOrderBedgeValue(count) {
        let countBedgeValue = '';
        let bedgeWidth = 32;
        if (count > 0) {
          if (count > 99) {
            countBedgeValue = '99+';
            bedgeWidth = 50;
          } else {
            countBedgeValue = count;
            if (count > 9) {
              bedgeWidth = 45;
            }
          }
        }
        return {
          countBedgeValue,
          bedgeWidth
        };
      },
    }
  }
</script>

<style lang="scss">
  @import "./index.scss";
</style>
