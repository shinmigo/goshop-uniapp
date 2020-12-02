<template>
	<view class="content">

		<NavBar backType="1" title=""></NavBar>

		<view v-for="(itemEvents,index) in detailsResponseVos" :key="index">

			<view v-if="itemEvents.describeType == 1" class="banner-text">
				<text>{{itemEvents.content}}</text>
			</view>

			<view v-if="itemEvents.describeType == 2" v-for="(itemImg,indexs) in itemEvents.imgUrl" :key="indexs">
				<BannerImg class="banner-img" :banner-url="imgHost+itemImg"></BannerImg>
			</view>

			<view v-if="itemEvents.describeType == 3 || itemEvents.describeType == 4" class="sku-list">
				<SkuItemNormal class="sku-item" v-for="(product,i) in itemEvents.productResponseList" :key="i" :product="product"
				 imgWidth="340" imgHeight="340"></SkuItemNormal>
			</view>

		</view>

	</view>
</template>
<script>
	import SkuItemNormal from "../components/sku-item-normal/index.vue";
	import {
	  GETAdInfo
	} from "@/utils/api";
	const app = getApp();
	export default {
		components: {
			SkuItemNormal,
		},
		data() {
			return {
				imgHost: app.globalData.configRouter.imgHost,
				detailsResponseVos: [{
					// 	content: '',
					// 	describeType: 0,
					// 	id: '',
					// 	imgUrl: [],
					// 	productResponseList: [],
					// }, {
					// 	content: '',
					// 	describeType: 0,
					// 	id: '',
					// 	imgUrl: [],
					// 	productResponseList: [],
					// }, {
					// 	content: '',
					// 	describeType: 0,
					// 	id: '',
					// 	imgUrl: [],
					// 	productResponseList: [],
				}],
				adId: ''
			}
		},
		onLoad() {
			// this.initProducts();
			this.adId = "1290664542399717378";
			//1290529442112344065
			//1290664542399717378
			app.uniAjax({
				url: GETAdInfo + this.adId,
				type: 'GET',
				loading: {
					msg: '加载中',
					mask: true
				}
			}).then(res => { //调用接口成功
				console.log(res.data);
				if (res.data.code == 200) {
					this.detailsResponseVos = res.data.data.detailsResponseVos; 
				}
			}).catch(res => { //调用接口失败
				console.log(res.data);
				uni.showToast({
					title: res.data.status_txt,
					icon: 'none',
					duration: 2000
				});
			});

		},
		methods: {
			// initProducts() {

			// 	var allProducts = [];

			// 	this.detailsResponseVos[0].describeType = 3;
			// 	for (var i = 0; i < 5; i++) {
			// 		allProducts.push({
			// 			"pic": "/mall/images/20200903/7abf16fcb4f94b48b687b1ad7ab6b96d_0fe7d9654afa4394abcf683f312d30df_min.jpg",
			// 			"name": "全部商品" + i,
			// 			"price": "10.00",
			// 			"originalPrice": "8.00",
			// 			"subTitle": "洋气时尚小众设计感"
			// 		})
			// 	}

			// 	this.detailsResponseVos[0].productResponseList = allProducts;

			// 	this.detailsResponseVos[2].describeType = 1;
			// 	this.detailsResponseVos[2].content =
			// 		"啦啦啦这是广告内容这是广告内容这是广告内容这是广告内容这是广告内容这是广告内容这是广告内容这是广告内容这是广告内容这是广告内容这是广告内容这是广告内容这是广告内容这是广告内容"

			// 	this.detailsResponseVos[1].describeType = 2;
			// 	this.detailsResponseVos[1].imgUrl[0] = "/static/logo.png";
			// 	this.detailsResponseVos[1].imgUrl[1] = "/static/logo.png";
			// 	this.detailsResponseVos[1].imgUrl[2] = "/static/logo.png";
			// }
		}
	}
</script>

<style lang="scss">
	@import "./index.scss";
</style>
