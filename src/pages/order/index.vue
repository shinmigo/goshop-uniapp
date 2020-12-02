<template>
  <view class="content">
    <NavBar backType="1" title="确认订单" shadow="1"></NavBar>
    <!-- 地址模块 -->
    <view class="boxShadow address flex flexAlignC" @tap="handleClick('address')">
      <BannerImg width="68" height="68" :bannerUrl="img.addressIcon"></BannerImg>
      <view class="textContent ml24 mr26 flexGrow1">
        <block v-if="address.name">
          <view class="title f28 c_text_title">
            {{address.name}}<span class="ml16">{{address.mobile}}</span>
          </view>
          <view class="text mt12 f26 c_text">{{address.address}}</view>
        </block>
        <block v-else>
          <view class="title f28 c_text_title">添加收货地址</view>
        </block>
      </view>
      <BannerImg width="32" height="32" :bannerUrl="img.arrowRightIcon"></BannerImg>
    </view>
    <!-- 发货时间与订单商品列表 -->
    <view class="boxShadow product">
      <!-- <view class="header f28 flex flexAlignC spaceBetween">
        <view class="c_text_title">发货时间</view>
        <view class="c_text">{{deliveryDate}}</view>
      </view> -->
      <view class="list">
        <view :class="index == productVos.length -1 ? '' : 'mb56' " v-for="(item ,index) in productVos" :key="item.productSkuId">
          <OrderSku :skuData="item" />
        </view>
      </view>
    </view>
    <!-- 优惠券、积分、小计模块 -->
    <view class="boxShadow orderInfo" style="margin-bottom: 20rpx;">
      <!-- <view class="header f28">
        <view class="item f28 flex flexAlignC c_text_title" @tap="handleClick('coupon')">
          <view class="c_text_title fb">优惠券</view>
          <view class="c_text_grey f26 ml16 flexGrow1">{{orderReceiptVo.couponAmount ? '已选择推荐优惠，可更换' : '请选择可用的优惠券'}}</view>
          <view class="flex flexAlignC fb">
            {{orderReceiptVo.couponAmount ? '-¥' + orderReceiptVo.couponAmount : ''}}
            <BannerImg class="ml8" width="28" height="28" :bannerUrl="img.arrowRightIcon"></BannerImg>
          </view>
        </view>
        <view class="item f28 flex flexAlignC c_text_title mt28">
          <view class="c_text_title fb">积分抵扣</view>
          <view class="c_text_grey f26 ml16 flexGrow1">使用{{maxUseIntegration}}积分抵扣{{maxUseIntegration / integralRegulation}}元</view>
          <view :class="'switch_bar ' + (usePoint ? 'switch_bar_on': '')" @tap="handleClick('point')">
            <view class="switch"></view>
          </view>
        </view>
      </view> -->
      <view class="list c_text f28 pt16">
        <view class="item flex flexAlignC">
          <view class="flexGrow1">商品金额</view>
          <view class="c_text_title fb">¥{{orderReceiptVo.totalAmount}}</view>
        </view>
        <view class="item flex flexAlignC">
          <view>运费</view>
          <view class="flexGrow1 ml16 f26 c_text_grey">
            <!-- 已享有满¥100免配送费服务 -->
          </view>
          <view class="c_text_title fb">¥{{orderReceiptVo.freight}}</view>
        </view>
        <view class="item flex flexAlignC">
          <view class="flexGrow1">优惠券</view>
          <view class="c_text_title fb">-¥{{orderReceiptVo.couponAmount}}</view>
        </view>
        <!-- <view class="item flex flexAlignC">
          <view class="flexGrow1">积分抵扣</view>
          <view class="c_text_title fb">-¥{{orderReceiptVo.integral}}</view>
        </view> -->
        <view class="payment mt22 texR c_text">
          应付:<span class="c_price ml8 f32 fb">¥{{orderReceiptVo.realAmount}}</span>
        </view>
      </view>
    </view>
    <!-- 提交订单 -->
    <view class="submitH"></view>
    <view class="submit flex flexAlignC spaceBetween">
      <view class="c_text_title f28 ml32">
        应付:<span class="c_price ml8 f32 fb">¥{{orderReceiptVo.realAmount}}</span>
      </view>
      <view class="btn bg-image mr32 c_text_inverse f28" @tap="handleClick('payment')">提交订单</view>
    </view>
    <!-- 支付方式弹窗 -->
    <Payment ref="payment" @create-order="createOrder" />
  </view>
</template>o
<script>
  import OrderSku from "@/pages/components/order-sku/index";
  import Payment from "./payment/index.vue";
  import {
    OrderCartBuy,
    OrderCalculatePrice,
    GenerateOrder,
    GetAddressList
  } from "@/utils/api";
  const util = require("@/utils/util.js");
  const app = getApp();
  const arrowRightIcon = require("@/static/common-icon/arrow-right.png");
  const addressIcon = require("@/static/common-icon/address.png");

  export default {
    components: {
      OrderSku,
      Payment
    },
    data() {
      return {
        title: 'Hello',
        img: {
          arrowRightIcon: arrowRightIcon,
          addressIcon: addressIcon
        },
        usePoint: false, //积分开关
        deliveryDate: '',
        address: {
          id: "",
          name: "",
          phoneNumber: "",
          province: "",
          city: "",
          cityId: "",
          region: "",
          regionId: "",
          detailAddress: "",
        },
        orderReceiptVo: {
          realAmount: '', //实际支付金额
          totalAmount: '',
          couponAmount: '',
          promotionAmount: '',
          freight: '',
          integral: ''
        },
        integration: '', //用户拥有的积分数量
        integralRegulation: '', //积分价值转换比
        maxUseIntegration: '', //当前最大可用积分数量
        productVos: [{
          "originalPrice": 0,
          "price": 0,
          "productName": "",
          "productPic": "",
          "productSkuId": "",
          "quantity": 0,
          "sp1": "",
          "sp2": ""
        }],
        // 创建订单数据
        orderPricePostData: {
          couponId: '',
          isUseIntegration: false,
          products: []
        },
        initDataStatus: false, //是否初始化过数据
        options: {}
      }
    },
    onLoad(options) {
      // options['type'] = 'now';
      this.options = options;
      //全局中不存在收货地址时，调接口获取
      if (!app.globalData.globalAddr.name) {
        this.getAddressInfo();
      }

    },
    onShow() {
      const {
        initDataStatus,
        options
      } = this;
      this.address = app.globalData.globalAddr;
      if (!initDataStatus) {
        // 页面初始化
        this.initData(options);
      } else {
        this.orderPricePostData.couponId = app.globalData.selectCoupon.couponId;
        this.orderPricePostData.couponHistoryId = app.globalData.selectCoupon.id;
        this.getOrderPrice();
      }
    },
    onUnload() {
      //清空全局优惠券信息
      app.globalData.selectCoupon = {};
    },
    methods: {
      initData: function(options) {
        let {
          type,
          products
        } = options;

        const postData = {};

        if (type == 'now') {
          postData["skuList"] = [{
            "skuId": skuId, //"1289101186052218882", //skuId,//
            "total": quantity //"1" //quantity//
          }]
        } else {
          // 普通购物车购买方式
          postData["products"] = this.orderPricePostData.products = products
        }
        app.uniAjax({
          url: OrderCartBuy,
          type: 'POST',
          data: postData,
          loading: {
            msg: '',
            mask: true
          }
        }).then(res => { //调用接口成功
          this.initDataStatus = true;
          let resData = res.data;
          if (resData.code == 1 && resData.data[0]) {
            const {
              pay_amount,
              order_amount,
              order_promotion,
              coupon_promotion,
              promotion_list,
              coupon_list,
              order_weight,
              cost_freight,
              products
            } = resData.data[0];
            // if (productVos.length == 0) {
            //   uni.showToast({
            //     title: '请重新整理购物车额',
            //     icon: 'none',
            //     duration: 2000
            //   });
            //   let tempTime = setTimeout(() => {
            //     uni.navigateBack({
            //       delta: -1
            //     });
            //     clearTimeout(tempTime);
            //   }, 2000)
            //   return
            // }
            this.orderReceiptVo = {
              realAmount: pay_amount, //实际支付金额
              totalAmount: order_amount,
              couponAmount: coupon_promotion,
              promotionAmount: order_promotion,
              freight: cost_freight,
              integral: ''
            };
            this.productVos = products;
            this.deliveryDate = deliveryDate.split(' ')[0];
            this.address = util.setGlobalAddr(addressVos);
            this.balance = balance;
            this.integration = Math.min(integration, maxUsedIntegrationPerOrder);
            this.integralRegulation = integralRegulation;
            this.countUseIntegration();

            // let skuList = [];
            // for (let val of productVos) {
            //   skuList.push({
            //     "skuId": val.productSkuId,
            //     "total": val.quantity
            //   })
            // }
            // Object.assign(this.orderPricePostData, {
            //   skuList: skuList,
            //   isUseIntegration: false
            // });
          } else {
            uni.showToast({
              title: resData.message,
              icon: 'none',
              duration: 2000
            });
          }
        }).catch(res => { //调用接口失败

        });
      },
      getAddressInfo: function() {
        app.uniAjax({
          url: GetAddressList,
          type: 'GET',
          loading: {
            msg: '',
            mask: true
          }
        }).then(res => { //调用接口成功
          let resData = res.data;
          let addressList = resData.data;
          if (resData.code == 1 && addressList[0]) {
            app.globalData.globalAddr = addressList[0];
            for (let i = 0; i < addressList.length; i++) {
              if (addressList[i].is_default) { //默认地址
                app.globalData.globalAddr = addressList[i];
                break;
              }
            }
            this.address = app.globalData.globalAddr;
          }
        }).catch(res => { //调用接口失败

        });
      },
      handleClick: function(type) {
        switch (type) {
          case 'point':
            {
              this.usePoint = !this.usePoint;
              this.orderPricePostData['isUseIntegration'] = this.usePoint;
              this.getOrderPrice();
              break;
            }
          case 'payment':
            {
              this.$refs.payment.modalAnimate(true, {
                orderReceiptVo: this.orderReceiptVo,
                balance: this.balance
              });
              break;
            }
          case 'address':
            {
              app.toLink('/pages/member/address/index?type=order');
              break;
            }
          case 'coupon':
            {
              app.toLink('/pages/member/coupon/index?type=order&skuList=' + JSON.stringify(this.orderPricePostData.skuList));
              break;
            }
        }
      },
      getOrderPrice: function() {
        app.uniAjax({
          url: OrderCalculatePrice,
          type: 'POST',
          data: this.orderPricePostData,
          loading: {
            msg: '',
            mask: true
          }
        }).then(res => { //调用接口成功
          let resData = res.data;
          if (resData.code == 200) {
            this.orderReceiptVo = resData.data;
            this.countUseIntegration();
          } else {
            uni.showToast({
              title: resData.msg,
              icon: 'none',
              duration: 2000
            });
          }
        }).catch(res => { //调用接口失败

        });
      },
      // 计算可用积分数量
      countUseIntegration: function() {
        const {
          orderReceiptVo,
          integration,
          integralRegulation,
          usePoint
        } = this;

        if (usePoint) {
          //使用积分后，最大积分使用数量以接口计算为准
          this.maxUseIntegration = orderReceiptVo.integral * integralRegulation;
        } else {
          // 未使用积分，最大积分使用数量本地计算
          //最大可用积分 --- 应付金额 * 积分价值比
          let maxUseIntegration = orderReceiptVo.realAmount * integralRegulation;
          // 应付金额超过用户账户积分价值
          if (maxUseIntegration >= integration) {
            this.maxUseIntegration = integration;
          } else {
            this.maxUseIntegration = maxUseIntegration;
          }
        }
      },
      // 创建订单
      createOrder: function(dataObj) {
        const {
          orderPricePostData,
          address
        } = this;
        let postData = {};
        if (!address.address_id) {
          return uni.showToast({
            title: '请添加收货地址',
            icon: 'none',
            duration: 2000
          });
        }
        Object.assign(postData, {
          address_id: address.address_id,
          products: orderPricePostData.products
          // orderBuyType: orderBuyType,
          // orderType: 1,
          // source: app.globalData.configRouter.source,
          // payType: dataObj.payType,
          // orderPayMoney: orderReceiptVo.realAmount
        })
        app.uniAjax({
          url: GenerateOrder,
          type: 'POST',
          data: postData,
          loading: {
            msg: '',
            mask: true
          }
        }).then(res => { //调用接口成功
          let resData = res.data;
          if (resData.code == 1) {
            app.globalData.selectCoupon = {}; //清空全局优惠券信息
            uni.showToast({
              title: '生成订单成功',
              icon: 'none',
              duration: 2000
            });
            util.getPay({
              orderId: resData.data[0].id,
              paymentSuccess: res => {
                uni.redirectTo({
                  url: '/pages/payment-results?orderId=' + resData.data[0].id
                })
              },
              paymentError: res => {
                let tempTime = setTimeout(() => {
                  clearTimeout(tempTime);
                  uni.redirectTo({
                    url: '/pages/member/order-list/index'
                  });
                }, 2000)
              }
            })
          } else {
            uni.showToast({
              title: resData.message,
              icon: 'none',
              duration: 2000
            });
          }
        }).catch(res => { //调用接口失败

        });
      }
    }
  }
</script>

<style lang="scss">
  @import "./index.scss";
</style>
