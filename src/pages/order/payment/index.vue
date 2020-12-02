<!-- 自定义顶部导航条组件 -->
<template>
  <view class="paymentBox">
    <view class="payment" :style="show ? 'bottom:0rpx;' : 'bottom:-1000rpx'" @touchmove.stop.prevent>
      <view class="header f30 fb c_text_title texC">
        选择支付方式
        <view class="close" @tap="close">
          <BannerImg width="64" ratio="1" :bannerUrl="img.closeIcon"></BannerImg>
        </view>
      </view>
      <view class="content">
        <view v-if="needBalance" class="item flex flexAlignC">
          <BannerImg width="58" ratio="1" :bannerUrl="img.moneyIcon"></BannerImg>
          <view class="ml18 flexGrow1">
            <view class="money f28 c_text">帐户余额: ¥{{balance}}</view>
            <view class="tips f24 c_text_red">全额余额抵扣</view>
          </view>
          <view :class="'switch_bar ' + (useMoneyStatus ? 'switch_bar_on': '')" @tap="useMoney">
            <view class="switch"></view>
          </view>
        </view>
        <view class="item flex flexAlignC line" v-if="payType == '1'">
          <BannerImg width="58" ratio="1" :bannerUrl="img.alipayIcon"></BannerImg>
          <view class="ml18 flexGrow1">
            <view class="f28 c_text">支付宝支付</view>
          </view>
        </view>
        <view class="item flex flexAlignC line" v-if="payType == '2'">
          <BannerImg width="58" ratio="1" :bannerUrl="img.wxpayIcon"></BannerImg>
          <view class="ml18 flexGrow1">
            <view class="f28 c_text">微信支付</view>
          </view>
        </view>
      </view>
      <view class="btn bg-image f32 c_text_inverse texC" @tap="createOrder">{{btnText}}</view>
    </view>
    <view v-if="show" class="bg" @tap.stop="close" @touchmove.stop.prevent></view>
  </view>
</template>

<script>
  //获取应用实例
  const util = require("@/utils/util.js");
  const app = getApp();
  const closeIcon = require("@/static/common-icon/close-popup.png");
  const moneyIcon = require("@/static/common-icon/money.png");
  const alipayIcon = require("@/static/common-icon/alipay.png");
  const wxpayIcon = require("@/static/common-icon/wxpay.png");

  export default {
    data() {
      return {
        img: {
          closeIcon: closeIcon,
          moneyIcon: moneyIcon,
          alipayIcon: alipayIcon,
          wxpayIcon: wxpayIcon
        },
        useMoneyStatus: false,
        show: false, //弹窗是否显示
        btnText: '确认支付', //1、确认支付 ￥60 2、确认支付 剩余 ￥60 3、确认支付
        orderReceiptVo: {},
        balance: 0,
        payType: '', //默认选择支付类型 1->支付宝；2->微信;
        currentPay: 2, //api所需支付方式类型:0->未支付；1->支付宝；2->微信; 3->余额；31->余额+支付宝；32->余额+微信'
      };
    },
    components: {},
    props: {
      needBalance: {
        type: Boolean,
        default: true
      }
    },
    mounted() {
      //#ifdef MP-WEIXIN
      this.payType = '2'
      //#endif
      //#ifndef MP-WEIXIN
      this.payType = '1'
      //#endif
    },
    methods: {
      initData: function() {
        let {
          orderReceiptVo,
          balance,
          payType
        } = this;
        let {
          realAmount
        } = orderReceiptVo;
        let btnText = ''
        //api所需支付方式类型:0->未支付；1->支付宝；2->微信; 3->余额；31->余额+支付宝；32->余额+微信；5->0元购'
        let currentPay = '';
        if (realAmount > 0) {
          if (this.useMoneyStatus) { //使用余额
            if (realAmount <= balance) {
              btnText = '确认支付';
              currentPay = '3'; //全部抵扣 -- 余额支付
            } else {
              currentPay = '3' + payType; //部分抵扣 -- 混合支付
              btnText = '确认支付,剩余￥' + (realAmount - balance);
            }
          } else {
            currentPay = payType; //不使用余额 -- 微信或者支付宝支付
            btnText = '确认支付￥' + realAmount;
          }
        } else { //0元购
          currentPay = 5
          btnText = '确认支付';
        }
        this.currentPay = currentPay * 1;
        this.btnText = btnText;
      },
      useMoney: function() {
        if (this.balance == 0) {
          return
        }
        this.useMoneyStatus = !this.useMoneyStatus;
        this.initData();
      },
      createOrder: function() {
        this.$emit('create-order', {
          payType: this.currentPay
        });
      },
      close: function() {
        this.modalAnimate(false);
      },
      modalAnimate: function(status, data) {
        if (data) {
          let {
            orderReceiptVo,
            balance
          } = data;

          if (status && orderReceiptVo.realAmount == 0) { //零元单
            this.createOrder();
            return;
          }

          this.orderReceiptVo = orderReceiptVo;
          this.balance = balance;
          this.initData();
        }
        this.show = status;
      }
    }
  };
</script>
<style lang="scss">
  @import "./index.scss";
</style>
