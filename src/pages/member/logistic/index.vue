<template>
	<view class="content">
		<NavBar backType="1" title="物流信息"></NavBar>
		<scroll-view>
			<view v-if="logisticInfo.title || logisticInfo.subTitle" class="top-cover-container">
				<view v-if="logisticInfo.title" class="logisticInfo posiR">
					<view class="logisticNumMaxWidth flexGrow0">物流进度：{{logisticInfo.title}}</view>
					<image class="logisticNumIcon ml18" src="../../../static/logo.png" @click="copyLogisticNumAction"></image>
				</view>
				<view v-if="logisticInfo.subTitle" class="logisticInfo mt20">配送公司：{{logisticInfo.subTitle}}</view>
			</view>
			<view class="bottom-cover-container">
				<view v-for="(item,index) in logisticList" class="flex flexColumn posiR">
					<view class="flex flexRow posiR" v-if="item.title">
						<image class="logisticMarkIcon" :src="item.icon"></image>
						<view class="logisticTitle ml20 mt8">{{item.title}}</view>
					</view>
					<view class="flex flexRow posiR">
						<view v-if="item.logisticType != OrderLogisticStatus.FIRSTITEM" class="logisticLeftLine ml22 mb8" :class="item.logisticType == OrderLogisticStatus.NORMAL? 'mt22' : 'mt8'"></view>
						<view v-if="item.logisticType == OrderLogisticStatus.NORMAL" class="ml18 logisticNormal"></view>
						<view class="flex flexColumn posiR" :class="item.logisticType == OrderLogisticStatus.FIRSTITEM?'ml66':'ml44'">
							<view class="logisticSubTitle" :class="item.logisticType == OrderLogisticStatus.NORMAL?'logisticSubTitle-margintop' : 'mt8'">{{item.subTitle}}</view>
							<view class="logisticTime mt12" :class="(index == (logisticList.length - 1))?'':'mb32'">{{item.createTime}}</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="mt10 mb30"></view>
	</view>
</template>

<script>
	const orderUtil = require("@/utils/orderUtil.js");
	const app = getApp();
	const {
		OrderLogisticStatus
	} = orderUtil;
	export default {
		data() {
			return {
				//物流信息
				logisticInfo: {
					title: '829231235694',
					subTitle: '圆通快递',
				},
				OrderLogisticStatus: OrderLogisticStatus,
				logisticList: [{
						status: 4,
						title: '已签收',
						subTitle: '这里是文本由接口返回内容，具体字数限制没有，换行处理',
						createTime: '2020.09.08  13:20:32',
					},
					{
						status: 3,
						title: '运输中',
						subTitle: '这里是文本由接口返回内容，具体字数限制没有，换行处理',
						createTime: '2020.09.08  13:20:32',
					},
					{
						subTitle: '这里是文本由接口返回内容，具体字数限制没有，换行处理',
						createTime: '2020.09.08  13:20:32',
					},
					{
						subTitle: '这里是文本由接口返回内容，具体字数限制没有，换行处理',
						createTime: '2020.09.08  13:20:32',
					},
					{
						subTitle: '这里是文本由接口返回内容，具体字数限制没有，换行处理',
						createTime: '2020.09.08  13:20:32',
					},
					{
						status: 2,
						title: '已发货',
						subTitle: '这里是文本由接口返回内容，具体字数限制没有，换行处理',
						createTime: '2020.09.08  13:20:32',
					},
					{
						status: 1,
						title: '已下单', //已下单
						subTitle: '这里是文本由接口返回内容，具体字数限制没有，换行处理',
						createTime: '2020.09.08  13:20:32',
					}
				]
			};
		},
		onLoad() {
			let resParams = this.logisticList[0];
			this.logisticList = orderUtil.getOrderLogisticList(this.logisticList);
			console.log("物流当前处于的状态 ===", resParams, this.logisticList);
		},
		onUnload() {
			console.log("监听页面卸载");
		},
		methods: {
			//拷贝物流单号
			copyLogisticNumAction() {
				// #ifdef H5
				uni.showToast({
					title: '复制失败，请手动记录'
				});
				// #endif
				// #ifndef H5
				uni.setClipboardData({
					data: this.logisticInfo.title,
					success: function(data) {
						uni.showToast({
							title: '复制成功'
						});
					},
					fail: function(err) {
						uni.showToast({
							title: '复制失败，请手动记录'
						});
					}
				});
				// #endif
			}
		},
	}
</script>

<style lang="scss">
	@import "./index.scss"
</style>
