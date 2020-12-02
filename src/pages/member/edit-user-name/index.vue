<template>

	<view class="content">

		<!-- <view class="title-content">
			<img class="img-back" src="/static/search/icon_back_dark.png" @click="backLastPage()">
			<text class="title">设置昵称</text>
		</view> -->
		
		<NavBar backType="1" title="设置昵称"></NavBar>

		<view class="input_name">
			<input type="text" confirm-type="search" :placeholder="keyWords" v-model="id_input" @input="inputFunction()" />
		</view>

		<view class="bottom-btn">
			<button :class="[isSubmitBtnEnable ? 'save-btn, bg-image' : 'button']" @click="saveUserName()">保存</button>
		</view>


	</view>

</template>

<script>
	export default {
		data() {
			return {
				keyWords: "请输入昵称",
				isSubmitBtnEnable: false
			}
		},
		onLoad() {
			var that = this;
			uni.getStorage({
				key: "user_name",
				success(e) {
					if(e.data != ""){
						that.id_input = e.data
					}
				}
			})
		},
		methods: {
			inputFunction() {
				if (this.id_input.length > 0) {
					this.isSubmitBtnEnable = true;
				} else {
					this.isSubmitBtnEnable = false;
				}
			},
			saveUserName() {
				if (this.isSubmitBtnEnable) {
					uni.setStorage({
						key: "user_name",
						data: this.id_input
					})
				};
				uni.showToast({
					title: "已保存",
					icon: 'none',
					duration: 2000
				});
			},
			backLastPage() {
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">
	@import "./index.scss";
</style>
