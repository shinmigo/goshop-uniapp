<template>
	<!-- 商品数量编辑框 -->
	<view class="count-box" :style="'width:'+ width+'rpx;height:'+height+'rpx;'">
		<view class="count-action-minus" @tap.stop="onMinusTap">
			<image :style="'width:'+(height-4)+'rpx;height:'+(height-4)+'rpx;'" :src="count > 1 ? img.minusIcon : img.minusIconDisable"></image>
		</view>
		<text class="count-number">{{count}}</text>
		<view class="count-action-plus" @tap.stop="onPlusTap">
			<image :style="'width:'+(height-4)+'rpx;height:'+(height-4)+'rpx;'" :src="img.plusIcon"></image>
		</view>
	</view>
</template>

<script>
	const plusIcon = require("@/static/cart/ic-plus.png");
	const minusIcon = require("@/static/cart/ic-minus.png");
	const minusIconDisable = require("@/static/cart/ic-minus-disable.png");
	export default {
		data() {
			return {
				img: {
					plusIcon: plusIcon,
					minusIcon: minusIcon,
					minusIconDisable: minusIconDisable
				}
			};
		},
		components: {},
		props: {
			width: {
				type: String,
				default: '180'
			},
			height: {
				type: String,
				default: '48'
			},
			count: {
				//数量
				type: Number,
				default: 1
			}
		},
		methods: {
			onMinusTap() {
				this.$emit("onCountMinus", {
					count: this.$props.count
				})
			},
			onPlusTap() {
				this.$emit("onCountPlus", {
					count: this.$props.count
				})
			}
		}
	};
</script>
<style lang="scss">
	@import "./index.scss";
</style>
