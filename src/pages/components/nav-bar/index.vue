<!-- 自定义顶部导航条组件 -->
<template>
  <view class="navBarBox f36 c_text_title fb" :style="'height:'+ navBarHeight">
    <view class="navBar" :style="'height:'+ navH + 'px;padding-top:' + pt + 'px;padding-bottom:' + pb + 'px;' + (shadow == 0 ? '' : 'box-shadow: 0 0 10rpx 0 rgba(153,153,153,0.1);')">
      <view class="posiR flex flexAlignC flexJustifyC">
        <view class="left flex flexAlignC">
          <view v-if="pagesLength > 1 && backType != '0'" class="backIcon" @click="handleBack">
            <BannerImg width="40" ratio="1" :bannerUrl="backType == '1'? backIcon : closeIcon"></BannerImg>
          </view>
        </view>
        {{title}}
      </view>
    </view>
    <view class="bg" :style="'background:' + bgColor + ';' + 'height:'+ navBarHeight "></view>
  </view>
</template>

<script>
  //获取应用实例
  const util = require("@/utils/util.js");
  //兼容因navbar组件挂在全局中，h5执行顺序与小程序不一致，导致无法获取到getApp实例
  var app = getApp();
  const backIcon = require("@/static/common-icon/back.png");
  const closeIcon = require("@/static/common-icon/close.png");
  export default {
    data() {
      return {
        navH: '44',
        pt: '0',
        pb: '0',
        navBarHeight: '',
        backIcon: backIcon,
        closeIcon: closeIcon,
        pagesLength: 1
      };
    },
    components: {},
    props: {
      title: {
        //导航title
        type: String,
        default: ''
      },
      backType: {
        //返回类型
        type: String,
        default: '1' //0 - 无需返回， 1 - 箭头返回， 2 - x返回
      },
      bgColor: {
        //导航背景色
        type: String,
        default: '#ffffff' //1 - 箭头返回， 2 - x返回
      },
      shadow: {
        //导航阴影
        type: String,
        default: '0' //0 - 没有阴影， 1 - 阴影 box-shadow: 0 0 10rpx 0 rgba(153,153,153,0.1);
      }
    },
    mounted() {
      //兼容因navbar组件挂在全局中，h5执行顺序与小程序不一致，导致无法获取到getApp实例，需在生命周期中重新获取
      app = getApp();
      this.initData();
    },
    methods: {
      initData: function() {
        let {
          title,
        } = this.$props;
        const {
          navH,
          pt,
          pb,
          height
        } = app.globalData.navBar;
        this.navH = navH;
        this.pt = pt;
        this.pb = pb;
        this.navBarHeight = height;
        this.pagesLength = getCurrentPages().length;
      },
      handleBack: function() {
        // 兼容点击底部tab栏中进入购物篮 导致页面从购物篮 <--> 登录页之间陷入死循环问题
        if (!app.globalData.configRouter.toLinkStatus && app.globalData.configRouter.fromlink.includes('/pages/cart/index') && this.$props.backType == '2' && app.isGuest()) {
          uni.switchTab({
            url: '/pages/home/index'
          });
        } else {
          app.globalData.configRouter.toLinkStatus = false;
          uni.navigateBack({
            delta: -1
          })
        }
      }
    }
  };
</script>
<style lang="scss">
  @import "./index.scss";
</style>
