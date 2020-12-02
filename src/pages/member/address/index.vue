<template>
  <view class="content">
    <NavBar backType="1" title="收货地址"></NavBar>
    <empty v-if="records.length <= 0" width="300" imgHeight="300" topPadding="-300"></empty>
    <view v-else class="addr-list" v-for="(item, index) in records" @click="editAction((pageType == 'order' ? 'select' : 'edit'), item)">
      <view class="back-content">
        <view class="back-view">
          <view class="addr-detail">
						<view v-if="item.is_default" class="addr-def mr20">默认</view>
            <span class="detail-str c_text_title, f28, texL">{{item.address}}</span>
          </view>
          <text class="name-str, c_text, f28, texL">{{ item.name }} {{ item.mobile }}</text>
        </view>
        <image class="edit-image" src="../../../static/address/ic_address_edit.png" @click.stop="editAction('edit', item)"></image>
      </view>
      <view class="line-v"></view>
    </view>
    <view class="bottom-v"><button class="addAddress-btn, bg-image" @click="editAction('add')">添加新地址</button></view>
  </view>
</template>

<script>
  import empty from "../../components/empty/index.vue";
  const util = require('@/utils/util.js');
  const app = getApp();
  import {
    GetAddressList
  } from '@/utils/api';
  export default {
    components: {
      empty
    },
    data() {
      return {
        records: [],
        pageType: '', //order从确认订单页进入
      };
    },
    onLoad(options) {
      this.pageType = options.type;
    },
    onShow() {
      // debugger;
      app.uniAjax({
        url: GetAddressList,
        loading: {
          msg: '',
          mask: true
        },
      }).then(res => { //调用接口成功
        let resData = res.data;
				console.log("zhn 地址=== ",resData);
        if (resData.code == 1) {
          this.records = resData.data;
          util.setGlobalAddr(resData.data);
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
    methods: {
      editAction(type, item) {
        if (type == 'select') {
          app.globalData.globalAddr = item; //全局选中地址
          return uni.navigateBack({
            delta: -1
          })
        }

        uni.navigateTo({
          url: `/pages/member/address-edit/index?type=${type}&item=${JSON.stringify(item)}`
        });
      }
    }
  };
</script>

<style>
  @import './index.scss';
</style>
