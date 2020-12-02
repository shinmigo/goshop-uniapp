<!-- 自定义顶部导航条组件 -->
<template>
	<view class="orderSku flex">
		<BannerImg width="160" ratio="1" :img-id="skuData.image"></BannerImg>
		<view class="textContent ml20">
			<view class="title c_text_title f28">{{skuData.product_name || ''}}</view>
			<view class="unit c_text_grey f26">{{skuData.spec_name || ''}}</view>
			<view class="price mt24 c_price f32 fb" style="letter-spacing: -4rpx;">
				<span class="f24">￥</span>{{skuData.price || ''}} <span v-if="skuData.originalPrice && skuData.price && skuData.originalPrice != skuData.price"
				 class="c_price_del fn ml8 f26 del">￥{{skuData.originalPrice}}</span>
			</view>
		</view>
		<view class="nums flexGrow1 texR f28">{{skuData.num == "" ? '': 'x'+skuData.num}}</view>
	</view>
</template>

<script>
	//获取应用实例
	const util = require("@/utils/util.js");
	const app = getApp();

	export default {
		data() {
			return {

			};
		},
		components: {},
		props: {
			skuData: {
				//导航title
				type: Object,
				default: {
					"originalPrice": "",
					"price": "",
					"product_name": "",
					"image": "",
					"product_id": "",
					"num": "",
					"spec_name": "6",
          "product_spec_id": '',
          "stock": ''
				}
			},
			clickStatus: {
				type: String,
				default: '1' //1 - 进商品详情页， 2 - 不跳转 
			}
		},
		mounted() {
			this.initData();
		},
		methods: {
			initData: function() {
				let {} = this.$props;
			},
			handleGoToPage: function() {
				let {
					clickStatus
				} = this.$props;
				if (clickStatus == '1') {
					uni.navigateTo({
						url: ''
					})
				}
			}
		}
	};
</script>
<style lang="scss">
	@import "./index.scss";
</style>
