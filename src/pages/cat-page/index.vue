<template>

	<view>

		<NavBar backType="0" title="分类"></NavBar>

		<view class="search-bar-content">

			<view class="search-bar" @click="toSearch()">

				<image class="ic_search_dark" src="../../static/search/ic_search_dark.png"></image>
				<view class="line-vertical"></view>
				<input placeholder-style="color:#999999; font-size: 26rpx;" :placeholder="hotSearchDefault" />

			</view>

		</view>

		<view class="category-content">
			<scroll-view class="left-category-tab" :style="'height:' + leftCategoryHeight" scroll-y="true">
				<view v-for="(tabItem, index) in categoryTabList" :key="index" class="left-category-tab-item" :class="{active:showCategoryTabIndex === index}"
				 @click='switchCategoryTab(index,tabItem.id)'>{{tabItem.name}}
				</view>
			</scroll-view>

			<view class="right-content">

				<view v-for="(product,index) in categoryProductList" :key="index" class="sku-item" @click="toProductDetail(product)">

					<BannerImg width="160" height="160" :bannerUrl="imgHost + product.image" style="position: absolute;"></BannerImg>

					<view class="sku-item-right-content">

						<text class="sku-name">{{product.name}}</text>

						<text class="sku-desc">{{product.short_description || '&nbsp;'}}</text>

						<view class="sku-price-content">
							<text class="amount-unit">¥</text>
							<text class="sku-discountprice">{{product.price}}</text>
						<!-- 	<text class="sku-price del" v-if="product.price != product.originalPrice">{{'¥'+product.originalPrice}}</text> -->
						</view>

						<view class="line-horizontal"></view>
					</view>
				</view>

				<view class="footer-tip" style="color: #353535;" v-if="loadMore">
					加载更多~
				</view>

				<view class="footer-tip" v-else>
					没有更多了~
				</view>

			</view>

		</view>

	</view>
</template>
<script>
	const util = require("@/utils/util.js");
	const app = getApp();
	const PageSize = 20;
	import {
		GetCategoryIndex,
		GetProductIndex
	} from "@/utils/api";
	export default {

		data() {
			return {
				imgHost: '',
				hotSearchDefault: '搜索内容/文案/等',
				showCategoryTabIndex: 0,
				categoryTabList: [],
				categoryProductList: [],
				currentPage: 1,
				loadMore: false,
				leftCategoryHeight: '',
			}
		},

		onLoad() {
			this.leftCategoryHeight = 'calc(100vh - 108rpx - ' + app.globalData.navBar.height + ');';
			this.imgHost = app.globalData.configRouter.imgHost;
			this.getCategoryIndex();
		},

		onPullDownRefresh() {
			this.currentPage = 1;
			this.getProductIndex(this.categoryTabList[this.showCategoryTabIndex].id);
		},

		onReachBottom() {
			if (this.loadMore) {
				this.currentPage += 1;
				this.getProductIndex(this.categoryTabList[this.showCategoryTabIndex].id);
			}

		},

		methods: {

			getCategoryIndex() {

				app.uniAjax({
					url: GetCategoryIndex,
					type: 'GET',
					loading: {
						msg: '',
						mask: true
					}
				}).then(res => {
					uni.stopPullDownRefresh();
					const {data, message, code} = res.data;

					if (res.data.code === 1) {

						this.currentPage = 1;
						if (res.data.data != undefined && res.data.data.length > 0) {
							this.showCategoryTabIndex = 0;
							this.categoryTabList = [];
							this.categoryTabList = res.data.data;
							this.getProductIndex(this.categoryTabList[0].id);
						}

					} else {
						// uni.showToast({
						// 	title: res.data.message,
						// 	icon: 'none',
						// 	duration: 2000
						// });
					}

				}).catch(res => {
					uni.stopPullDownRefresh();
					// uni.showToast({
					// 	title: res.data.message,
					// 	icon: 'none',
					// 	duration: 2000
					// });
				});


			},

			getProductIndex(productFirstCategoryId) {

				let productFirstCategory = {
					category_id: productFirstCategoryId,
					page: this.currentPage,
					page_size: PageSize,

				};

				app.uniAjax({
					url: GetProductIndex,
					type: 'GET',
					data:productFirstCategory,

				}).then(res => {
					uni.stopPullDownRefresh();

					if (res.data.code === 1) {

						if (res.data.data != undefined) {

							let recordsLength = res.data.data.length;

							if (recordsLength > 0 && recordsLength >= PageSize) {
								this.loadMore = true;

							} else {
								this.loadMore = false;
							}

							if (this.currentPage === 1) {

								this.categoryProductList = res.data.data;
							} else {

								if (recordsLength > 0) {
									this.categoryProductList = this.categoryProductList.concat(res.data.data);
								}
							}

						}
					}

				}).catch(res => {
					uni.stopPullDownRefresh();
				});
			},

			switchCategoryTab(index, productFirstCategoryId) {
				this.showCategoryTabIndex = index;
				this.getProductIndex(productFirstCategoryId);
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 200
				});
			},

			toProductDetail(product) {
				uni.navigateTo({
					url: "/pages/product-detail/index?id=" + product.product_id
				})
			},

			toSearch() {
				uni.navigateTo({
					url: "/pages/search-list/index"
				})
			},

		}
	}
</script>

<style lang="scss">
	@import "./index.scss";
</style>
