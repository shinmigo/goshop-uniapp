<template>
  <view class=".page-setting-content">
    <NavBar backType="1" title="设置"></NavBar>

    <view class="setting-item-content">
      <view v-for="(item,index) in list" :key='index' @click="settingItemClick(index)" class="setting-item" :class="{active: index != 4}">
        <text class="setting-item-left-text">{{item}}</text>
        <text class="setting-item-right-text" v-if="index ===3 ">{{catchSize}}</text>
        <text class="setting-item-right-text" v-else-if="index ===4 ">{{version}}</text>
        <image class="setting-item-arrow-icon" src="../../../static/common-icon/arrow-right.png" v-if="index != 4"></image>
      </view>
    </view>

    <view class="setting-item-content login-out" @click="loginOut()"> 退出登录
    </view>

  </view>

</template>

<script>
  const util = require("@/utils/util.js");
  const app = getApp();
  export default {

    data() {
      return {
        catchSize: '0MB',
        version: 'V 1.0.0',
        list: [
          '个人信息',
          '用户协议',
          '隐私政策',
          '清除缓存',
          '版本信息'
        ]
      }
    },

    onLoad() {
      this.getStorageInfo();
      this.version = 'V ' + app.globalData.version;
    },

    methods: {

      getStorageInfo() {
        var obj = this;
        uni.getStorageInfo({
          success(res) {
            obj.catchSize = Math.floor(res.currentSize / 1024 * 100) / 100 + 'MB';
          }
        });

      },

      settingItemClick(index) {

        switch (index) {
          case 0:

            uni.navigateTo({
              url: '/pages/member/edit-user/index'
            });
            break
          case 1:

            uni.navigateTo({
              url: '/pages/member/rule/index?type=userResisterProtocol',
            });
            break
          case 2:

            uni.navigateTo({
              url: '/pages/member/rule/index?type=privacyProtectionPolicy',
            });
            break
          case 3:
            uni.clearStorage();
            this.catchSize = '0MB';
            break
        }

      },

      loginOut() {
        util.exit({
          success: () => {
            uni.switchTab({
              url: '/pages/home/index'
            });
          }
        });
      }
    },
  }
</script>

<style lang="scss">
  @import "./index.scss";
</style>
