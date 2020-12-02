<template>
	<view class="empty-content">
		<image class="empty-content-image" :style="'width:'+ width + 'rpx; height:' + imgHeight + 'rpx; margin-top:' + topPadding + 'rpx;'" :src="setSrc" :mode="model"></image>
		<view class="defaultTitleColor">{{title}}</view>
	</view>
</template>

<script>
	export default {
		props: {
			src: {
				type: String,
				default: 'empty'
			},
			width: {
				//图片宽度
				type: String,
				default:''//如果不传，则走默认的
			},
			imgHeight: {
				//图片高度
				type: String,
				default:''//不传走默认的
			},
			topPadding: {
				//图片距离顶部的距离
				type: String,
				default:''//不传走默认的
			},
			model: {
				//图片缩放
				type: String,
				default:''
			}
		},
		data() {
			return {
				typeSrc: {
					empty:'../../../static/myinfo/order-img-empty.png',
				},
				title:'页面空空的~',
			};
		},
		computed: {
			setSrc() {
				return this.typeSrc[this.src];
			},
		}
	}
</script>

<style lang="scss">
	@import "./index.scss";
</style>
