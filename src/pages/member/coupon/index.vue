<template>
  <view class="content">
    <NavBar left-icon="back" title="我的优惠券"></NavBar>
    <view class="menu-area">
      <view class="menu">
        <view class="menu-item" v-for="(item, index) in menuitems" @click="onClickMenuItem(item, index)" :key="index">
          <text :class="item.issel ? 'menu-title-sel' : 'menu-title-nor'">{{ item.title }}{{ item.count > 0 ? '(' + item.count + ')' : '' }}</text>
          <view :animation="menuAnimationData" class="menu-sel-line" />
        </view>
      </view>
    </view>
    <view class="cell" v-for="(item, index) in datas" :key="item.id">
      <view class="main-area">
        <!-- <view class="circle-icon"> -->
        <image class="circle-icon left-circle" src="../../../static/coupon/img-coupon-cicle.png" mode="aspectFit"></image>
        <!-- </view> -->
        <view class="main-left-area">
          <text :class="useStatus != 0 || pageType == 'order' && !item.isValid ? 'amount-dis' : 'amount'">￥{{ item.amount }}</text>
          <text class="amount-desc">满{{ item.minPoint }}元可用</text>
        </view>
        <!-- <view class="main-divder"></view> -->
        <view class="main-middle-area">
          <text :class="useStatus != 0 || pageType == 'order' && !item.isValid ? 'name-dis' : 'name'">{{ item.name }}</text>
          <text class="time">{{ item.sDateStr || '' }}-{{ item.eDateStr || '' }}</text>
          <view class="btn-info-area" @click="btnAction('info', item)">
            <button class="btn btn-info" type="custom">{{ item.useType != 0 ? '部分可用' : '全场可用' }}</button>
            <image :animation="item.id == curSelCellIterm.id ? arrowAnimationData : ''" class="arrow" src="../../../static/coupon/ic-arrow-gray-1.png"
              mode="aspectFit"></image>
          </view>
        </view>
        <view class="main-right-area">
          <button class="btn btn-use bg-image" v-if="useStatus == 0 && (item.isValid || pageType != 'order')" type="custom" @click="btnAction('use', item)">{{ pageType == 'order' ? '使用' : '去使用' }}</button>
          <image class="icon-invaild" v-if="useStatus == 1" src="../../../static/coupon/ic-coupon-used.png" mode="aspectFit"></image>
          <image class="icon-invaild" v-if="useStatus == 2" src="../../../static/coupon/ic-coupon-overtime.png" mode="aspectFit"></image>
        </view>
        <!-- <view class="circle-icon"> -->
        <image class="circle-icon right-circle" src="../../../static/coupon/img-coupon-cicle-1.png" mode="aspectFit"></image>
        <!-- </view> -->
      </view>
      <view v-if="item.isexpand == true" class="info-area">
        <text class="info">{{ item.note }}</text>
      </view>
    </view>
    <!-- <uniLoadMore :status="status"></uniLoadMore> -->
  </view>
</template>

<script>
  import {
    getCouponList,
    FindCouponListBySkuParam
  } from '@/utils/api.js';
  import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue';
  const util = require('@/utils/util.js');
  const app = getApp();
  export default {
    data() {
      return {
        type: '',// order 下单页进入 || ''
        menuitems: [{
            title: '未使用',
            count: 0,
            issel: false
          },
          {
            title: '已使用',
            count: 0,
            issel: false
          },
          {
            title: '已过期',
            count: 0,
            issel: false
          }
        ],
        curSelMenuIterm: null,
        curSelCellIterm: null,
        animation: {},
        arrowAnimationData: {},
        menuAnimationData: {},
        pageType: '', //入口类型
        useStatus: '0', //列表类型 ，0->未使用；1->已使用；2->已过期
        datas: [],
        activeDatas: [],
        usedDatas: [],
        invaildDatas: [],
        actPageNum: 0,
        usedPageNum: 0,
        invPageNum: 0,
        skuList: [],
        status: 'more',
        loadMore: false,
        loadMoreText: '加载更多'
      };
    },
    onLoad(option) {
      //order :下单页；
      const {
        type,
        skuList
      } = option;
      console.log('type = ', type);
      this.pageType = type;
      if (type == 'order') {
        this.skuList = JSON.parse(skuList);
      }
      this.onClickMenuItem(this.menuitems[0], 0);
    },
    onShow() {
      var animation = uni.createAnimation({
        during: 800,
        timingFunction: 'ease'
      });
      this.animation = animation;
    },
    // onReachBottom() {
    // 	// if (this.loadMore) {
    // 		let curpageNum = this.updatePageNumByUseStatus(this.useStatus);
    // 		// this.status = 'loading';
    // 		this.getCouponListWithParams(curpageNum, this.useStatus);
    // 	// }
    // },
    components: {
      uniLoadMore
    },
    methods: {
      onClickMenuItem(item, index) {
        //切换列表
        if (item == this.curSelMenuIterm) return;

        if (this.curSelMenuIterm) {
          this.curSelMenuIterm.issel = false;
        }
        item.issel = !item.issel;
        this.curSelMenuIterm = item;
        this.useStatus = index;

        let curdatas = this.getDatasByUseStatus(this.useStatus);
        if (curdatas.length > 0) {
          this.datas = curdatas;
          return;
        }
        this.datas = [];
        // 确认订单页进入
        if (this.pageType == 'order' && index == 0) {
          this.getOrderCouponList(this.skuList);
        } else {
          this.getCouponListWithParams(0, this.useStatus);
        }
      },

      btnAction(type, item) {
        if (type === 'info') {
          item.isexpand = !item.isexpand;
          this.curSelCellIterm = item;
          console.log('click info =', item.isexpand);
          this.handleInfoAnimation(item.isexpand);
        } else if (type === 'use') {
          if(this.pageType == 'order'){
            app.globalData.selectCoupon = item;
            uni.navigateBack();
          }else{
            uni.switchTab({
              url: '/pages/home/index'
            });
          }
        }
      },

      handleInfoAnimation(flag) {
        if (flag) {
          this.animation.rotate(-180).step();
        } else {
          this.animation.rotate(0).step();
        }
        this.arrowAnimationData = this.animation.export();
      },

      // handleMenuLineAnimation(flag) {
      // 	if (flag) {
      // 		this.animation.opacity(1).step();
      // 	} else {
      // 		this.animation.rotate(0).step();
      // 	}
      // 	this.menuAnimationData = this.animation.export();
      // },

      getPageNumByUseStatus(usestatus) {
        var tmp = 0;
        if (usestatus == 0) {
          tmp = this.actPageNum;
        } else if (usestatus == 1) {
          tmp = this.usedPageNum;
        } else {
          tmp = this.invPageNum;
        }
        console.log('getPageNumByUseStatus = ', usestatus, tmp);
        return tmp;
      },

      updatePageNumByUseStatus(usestatus) {
        if (usestatus == 0) {
          this.actPageNum = this.actPageNum + 1;
          tmp = this.activeDatas;
        } else if (usestatus == 1) {
          this.usedPageNum = this.usedPageNum + 1;
          tmp = this.usedDatas;
        } else {
          this.invPageNum = this.invPageNum + 1;
          tmp = this.invaildDatas;
        }
      },

      getDatasByUseStatus(usestatus) {
        var tmp = [];
        if (usestatus == 0) {
          tmp = this.activeDatas;
        } else if (usestatus == 1) {
          tmp = this.usedDatas;
        } else {
          tmp = this.invaildDatas;
        }
        console.log('getDatasByUseStatus = ', usestatus, tmp);
        return tmp;
      },

      setDatasToListByUseStatus(usestatus, records) {
        var tmp = [];
        if (records.length > 0) {
          for (let index in records) {
            let item = records[index];
            var sdate = item.startTime / 1000.0 + '';
            var edate = item.endTime / 1000.0 + '';
            console.log('格式化时间 = ', ' + ', sdate, ' + ', edate);
            item = Object.assign(item, {
              sDateStr: sdate.date('yyyy-MM-dd'),
              eDateStr: edate.date('yyyy-MM-dd'),
              isexpand: false
            });
          }
        }

        //分页  later
        if (usestatus == 0) {
          this.activeDatas = records;
          tmp = this.activeDatas;
        } else if (usestatus == 1) {
          this.usedDatas = records;
          tmp = this.usedDatas;
        } else {
          this.invaildDatas = records;
          tmp = this.invaildDatas;
        }
        this.curSelMenuIterm.count = tmp.length;
        console.log('setDatasToListByUseStatus = ', records, tmp);
        return tmp;
      },
      // 通过商品查询可用的优惠券
      getOrderCouponList(skuList) {
        app.uniAjax({
            url: FindCouponListBySkuParam,
            data: skuList,
            type: 'POST',
            loading: {
              msg: '',
              mask: true
            }
          })
          .then(res => {
            let {
              code,
              data,
              msg
            } = res.data;
            if (code == 200) {
              let validArr = [];
              let unValidArr = [];
              for (let val of data) {
                if (val.isValid) {
                  validArr.push(val);
                } else {
                  unValidArr.push(val);
                }
              }
              this.datas = this.setDatasToListByUseStatus(0, [...validArr, ...unValidArr]);
            } else {
              uni.showToast({
                title: msg,
                icon: 'none',
                duration: 2000
              });
            }
          })
          .catch(error => {});
      },
      getCouponListWithParams(pageNum, useStatus) {
        app.uniAjax({
            url: getCouponList,
            data: {
              pageNum: pageNum,
              pageSize: 200,
              useStatus: useStatus //:0->未使用；1->已使用；2->已过期
            },
            type: 'GET',
            loading: {
              msg: '',
              mask: true
            }
          })
          .then(result => {
            let {
              code,
              data,
              msg
            } = result.data;
            console.log('couponlist (page/ useStatus/res):', pageNum, useStatus, result);
            if (code == 200) {
              this.datas = this.setDatasToListByUseStatus(useStatus, data.records);
            } else {
              uni.showToast({
                title: msg,
                icon: 'none',
                duration: 2000
              });
            }
          })
          .catch(error => {
            console.log('couponlist error (page/ useStatus/error):', pageNum, useStatus, error);
          });
      }
    }
  };
</script>

<style lang="scss">
  @import './index.scss';
</style>
