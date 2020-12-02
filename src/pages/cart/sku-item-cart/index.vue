<template>
	<!-- sku条目组件 -->
	<view class="cart-product-item" @tap="toProductDetail(product)">
		<image class="cart-product-check" @tap.stop="switchCheckChange" mode="aspectFit" :src="product.checked == true ? checkIcon : uncheckIcon"></image>
		<BannerImg :bannerUrl="imgHost + product.image" width="160" height="160"></BannerImg>
		<view class="flex flexColumn flexGrow1 ml20">
			<text class="f28 c_text_title">{{product.product_name || '&nbsp;'}}</text>
			<text class="f26 mt16 c_text_grey">{{product.spec_name || '&nbsp;'}}</text>
			<view class="flex mt10">
				<view class="f32 c_price"><span class="f24">¥</span>{{product.price}}
					<span v-if="product.price<product.promotion" class="f26 ml8 c_price_del del">¥{{product.promotion}}</span>
				</view>
				<view class="flexGrow1"></view>
				 <!-- {{product.num}} -->
				<Counter ref="counter" width="180" :count="product.num" @onCountMinus="onCartItemCountMinus" @onCountPlus="onCartItemCountPlus"></Counter>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	const checkIcon = require("@/static/cart/ic-checkbox-checked.png");
	const uncheckIcon = require("@/static/cart/ic-checkbox-normal.png");
	import Counter from "../../components/counter/index.vue";
	export default {
		data() {
			return {
				checkIcon: checkIcon,
				uncheckIcon: uncheckIcon,
				imgHost: app.globalData.configRouter.imgHost
			};
		},
		components: {
			Counter
		},
		props: {
			product: {
				//商品信息
				type: Object,
				default: ''
			}
		},
		mounted() {

		},
		methods: {
			toProductDetail() {
				app.toLink("/pages/product-detail/index?id=" + this.product.product_id)
			},
			switchCheckChange() {
				this.$emit("cartItemCheck", this.product)
			},
			onCartItemCountPlus(data) {
				this.$emit("onCartItemCountPlus", this.product)
			},
			onCartItemCountMinus(data) {
				var consts = data.count
				this.$emit("onCartItemCountMinus", this.product)
			}
		}
	};
</script>
<style lang="scss">
	@import "./index.scss";
</style>
