<template>
  <view class="homePage">
    <NavBar :title="'首页'"></NavBar>
    <view class="search-bar">
      <view class="search-content" @tap="toSearchPage">
        <image class="search-icon" :src="img.searchIcon"></image>
        <view class="search-text">{{searchHolder}}</view>
      </view>
    </view>
    <view class="search-bar-holder"></view>
    <swiper class="banner-swiper" :circular="true" :indicator-dots="banner.length > 1" :autoplay="true" :interval="2000"
      :duration="300" indicator-color="rgba(255,255,255, 0.6)" indicator-active-color="rgb(255,255,255)">
      <swiper-item class="banner-item" v-for="(item,index) in banner" :key="index" @click="onBannerClick(item)">
        <BannerImg width="710" height="340" class="banner-image" :bannerUrl="item.image_url" mode="scaleToFill"></BannerImg>
      </swiper-item>
    </swiper>
    <view class="banner-iamge-container flex">
      <view v-if="adBannerSpan[0]" class="small-banner ml20" @click="onAdClick(adBannerSpan[0])">
        <BannerImg width="344" height="170" :bannerUrl="adBannerSpan[0].image_url"></BannerImg>
      </view>
      <view v-if="adBannerSpan[1]" class="small-banner ml22" @click="onAdClick(adBannerSpan[1])">
        <BannerImg width="344" height="170" :bannerUrl="adBannerSpan[1].image_url"></BannerImg>
      </view>
    </view>
    <view class="tab-container">
      <view class="ml32 pt32 pb18 flex flexColumn flexAlignC" v-for="(tab,index) in tabs" :key="index" @click="onTabSelect(tab)">
        <text :class="selectedTabId==tab.id ? 'tab-item-selected':'tab-item-normal'">
          {{tab.name}}
        </text>
        <image class="tab-item-selected-line" :src="img.selectedTab" mode="aspectFit" :style="selectedTabId==tab.id ? 'visibility: visible;':'visibility: hidden;'"></image>
      </view>
    </view>
    <view class="sku-list">
      <SkuItemNormal class="sku-item" v-for="(product,index) in showProducts" :key="index" :product="product" imgWidth="340"
        imgHeight="340"></SkuItemNormal>
      <view class="load-more" v-if="loadMoreShow">{{loadMoreText}}</view>
    </view>
  </view>
</template>

<script>
  const util = require("@/utils/util.js");
  const app = getApp();
  const searchIcon = require("@/static/search/ic_search_dark.png");
  const selectedTab = require("@/static/home/tab-selected.png");
  import {
    GetProductTags,
    GetProducts,
    GetBanner
  } from "@/utils/api";
  import SkuItemNormal from "../components/sku-item-normal/index.vue";
  export default {
    components: {
      SkuItemNormal
    },
    data() {
      return {
        imgHost: app.globalData.configRouter.imgHost,
        img: {
          searchIcon: searchIcon,
          selectedTab: selectedTab
        },
        banner: [],
        adBannerSpan: [],
        searchHolder: "试试搜索你感兴趣的商品",
        tabs: [],
        selectedTabId: '',
        showProducts: [],
        tagProducts: {},
        loadMoreShow: false,
        loadMoreText: "加载更多..."
      }
    },
    onLoad() {
      this.getBannergInfo();
      this.getHomeInfors();
    },
    onReachBottom() {
      this.loadMoreShow = true
      let selectTagContent = this.tagProducts[this.selectedTabId]
      if (selectTagContent.noMoreData) {
        this.loadMoreText = "没有更多数据了"
      } else {
        this.loadMoreText = "加载中..."
        this.getProductByTag(this.selectedTabId, selectTagContent.pageNum + 1, selectTagContent.pageSize)
      }
    },
    onPullDownRefresh() {
      this.tagProducts = {}
      this.getHomeInfors();
    },
    methods: {
      //tab点击切换
      onTabSelect(tab) {
        this.selectedTabId = tab.id;
        if (this.tagProducts[this.selectedTabId] == undefined) {
          this.getProductByTag(this.selectedTabId, 1, 20);
        } else {
          this.showProducts = this.tagProducts[this.selectedTabId].products
        }
      },
      //获取banner信息
      getBannergInfo() {
        app.uniAjax({
          url: GetBanner,
          type: 'GET'
        }).then(res => {
          uni.stopPullDownRefresh();
          const {
            code,
            data
          } = res.data
          if (code == 1 && data[0]) {
            const {
              banner,
              ad
            } = data[0];
            this.banner = banner[0].ele_info || [];
            this.adBannerSpan = ad[0].ele_info || [];
          }
        }).catch(res => {
          uni.stopPullDownRefresh();
        });
      },
      //获取首页信息
      getHomeInfors() {
        app.uniAjax({
          url: GetProductTags,
          type: 'GET'
        }).then(res => {
          uni.stopPullDownRefresh();
          if (res.data.code == 1) {
            this.tabs = res.data.data;
            if (this.selectedTabId == '') {
              this.selectedTabId = this.tabs[0].id
            }
            this.getProductByTag(this.selectedTabId, 1, 20);
          }
        }).catch(res => {
          uni.stopPullDownRefresh();
        });
      },
      //获取tag商品列表
      getProductByTag(tagId, pageNum, pageSize) {
        let self = this;
        app.uniAjax({
          url: GetProducts,
          type: 'GET',
          data: {
            tag_id: tagId,
            page: pageNum,
            page_size: pageSize
          }
        }).then(res => {
          if (res.data.code == 1) {
            let products = res.data.data
            let tagProduct = self.tagProducts[self.selectedTabId]
            if (tagProduct == undefined) {
              tagProduct = {
                pageNum: pageNum,
                pageSize: pageSize,
                noMoreData: false,
                products: []
              }
            }
            if (products == undefined || products == []) {
              tagProduct.noMoreData = true
            } else {
              if (products.length < pageSize) {
                tagProduct.noMoreData = true
              } else {
                tagProduct.noMoreData = false
              }
              if (self.loadMoreShow) {
                tagProduct.products = tagProduct.products.concat(products)
              } else {
                tagProduct.products = products
              }
              self.loadMoreShow = false
            }
            self.tagProducts[self.selectedTabId] = tagProduct
          }
          self.showProducts = self.tagProducts[self.selectedTabId].products;
        }).catch(res => {
          self.loadMoreShow = false
        })
      },
      //跳转搜索页
      toSearchPage() {
        uni.navigateTo({
          url: '/pages/search-list/index'
        })
      }
    },
  }
</script>

<style lang="scss">
  @import "./index.scss"
</style>
