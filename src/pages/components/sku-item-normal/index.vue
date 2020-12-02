<template>
	<!-- sku条目组件 -->
	<view class="sku-card" @tap="toProductDetail(product)">
		<BannerImg :width="imgWidth" :height="imgHeight" class="sku-image" :bannerUrl="imgHost+product.image"></BannerImg>
		<text class="sku-name">{{product.name}}</text>
		<br />
		<text class="sku-desc">{{product.subTitle}}</text>
		<br />
		<view class="f32 c_price ml20 mr20 mt30 mb30"><span class="f24 c_price">¥</span>{{product.price}}<span v-if="product.originalPrice" class="f26 c_price_del del ml8">¥{{product.originalPrice}}</span></view>
	</view>
</template>

<script>
	const util = require("@/utils/util.js");
	const app = getApp();
	export default {
		data() {
			return {
				imgHost: app.globalData.configRouter.imgHost
			};
		},
		components: {},
		props: {
			product: {
				//商品信息
				type: Object,
				default: {}
			},
			imgWidth: {
				type: String,
				default: ''
			},
			imgHeight: {
				type: String,
				default: ''
			}
		},
		methods: {
			toProductDetail(product) {
				uni.navigateTo({
					url: "/pages/product-detail/index?id=" + product.product_id
				})
			}
		}
	};
</script>
<style lang="scss">
	@import "./index.scss";
</style>
