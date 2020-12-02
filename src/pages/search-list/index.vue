<template>
	<view class="parentDiv">

		<view class="searchbody">
			<NavBar backType="1" title="搜索页"></NavBar>

			<view class="search-view">
				<view class="search-bar flexGrow1">
					<img class="ic_search_dark" src="/static/search/ic_search_dark.png"></img>
					<input type="text" confirm-type="search" :placeholder="keyWords" v-model="id_input" @input="inputFunction()" @confirm="doSearch()" />
					<img class="img_clear" src="/static/search/ic_clear_input.png" v-show="clear_show_or_hide" @click="clearInput()">
				</view>
				<text class="text-canale" @click="backLastPage()">取消</text>
			</view>

		</view>

		<view class="product_list_and_more">
			<view class="sku-list" v-show="sku_show_or_hide">
				<SkuItemNormal class="sku-item" v-for="(product,index) in products" :key="index" :product="product" imgWidth="340"
			 imgHeight="340"></SkuItemNormal>
			</view>
			<uniLoadMore class="load-more" :status="status" icon-type="iconType" :content-text="contentText" v-show="load_show_or_hide" />
		</view>

	</view>
</template>
<script>
	const app = getApp();
	const PageSize = 20;
	import {
		GetProducts
	} from "@/utils/api";
	import SkuItemNormal from "../components/sku-item-normal/index.vue";
	import uniLoadMore from "../components/uni-load-more/uni-load-more.vue"
	export default {
		components: {
			SkuItemNormal,
			uniLoadMore
		},
		data() {
			return {
				keyWords: "搜索内容/文案/等",
				inputName: "",
				id_input: "",
				products: [],
				sku_show_or_hide: true,
				clear_show_or_hide: false,
				load_show_or_hide: false,
				currentPage: 1,
				loadMore: false,
				status: 'loadmore',
				iconType: 'circle',
				contentText: {
					contentdown: '加载更多',
					contentrefresh: '加载中',
					contentnomore: '已经到底了'
				}
			}
		},
		onLoad() {
			// this.initProducts()
			// this.postGoodsList();
		},
		onReachBottom() {

			if (this.loadMore) {
				this.currentPage = this.currentPage + 1;
				this.status = 'loading';
				this.postGoodsList();
			}

		},
		methods: {
			clearInput() {
				this.clear_show_or_hide = false;
				this.id_input = "";
			},
			inputFunction() {
				if (this.id_input.length > 0) {
					this.clear_show_or_hide = true;
				} else {
					this.clear_show_or_hide = false;
				}
			},
			backLastPage() {
				uni.navigateBack();
				// this.inputName = this.id_input;
				// this.currentPage = 1;
				// this.postGoodsList();
			},
			postGoodsList: function() {

				let searchProduct = {
					name: this.inputName,
					page: this.currentPage,
					page_size: PageSize,

				};
				// this.loadStatus = 'loading'
				app.uniAjax({
					url: GetProducts,
					type: 'GET',
					data: searchProduct,
					loading: {
						msg: '加载中',
						mask: true
					}
				}).then(res => { //调用接口成功
					if (res.data.code == 1) {
						this.load_show_or_hide = true;
						if (res.data.data[0] != undefined) {

							var recordsLength = res.data.data.length;
							if (recordsLength > 0 && recordsLength >= PageSize) {
								this.status = 'more';
								this.loadMore = true;
							} else {
								this.status = 'noMore';
								this.loadMore = false;
								this.contentText.contentnomore = "已经到底了"
								if (recordsLength === 0 && this.currentPage === 1) {
									this.contentText.contentnomore = "没搜到商品，换个关键词试试"
								}
							}
						}

						if (this.currentPage === 1) {

							this.products = res.data.data

						} else {

							if (recordsLength > 0) {
								this.products = this.products.concat(res.data.data)

							}
						}

					}
				}).catch(res => { //调用接口失败
					this.load_show_or_hide = true;
					this.contentText.contentnomore = "没搜到商品，换个关键词试试"
					uni.showToast({
						title: res.data.status_txt,
						icon: 'none',
						duration: 2000
					});
				});

			},
			doSearch(){
					var search_val = this.id_input;
					if (search_val == '' || search_val == null) {
						uni.showToast({
							title: '搜索内容不能为空',
							icon: 'none',
							duration: 2000
						});
					} else {
						this.inputName = this.id_input;
						this.currentPage = 1;
						this.postGoodsList();
					}
			}

		}
	}
</script>

<style lang="scss">
	@import "./index.css";
</style>
