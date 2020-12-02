<template>
	<view class="content">
		<NavBar backType="1" title="退款/售后" shadow="1"></NavBar>
		<scroll-view class="list-scroll-content" scroll-y="true" @scrolltolower="loadData">
			<!-- 空白页 -->
			<empty v-if="loaded == true && orderList.length === 0" width="272" imgHeight="272" topPadding="-600"></empty>
			<!--订单列表-->
			<view v-for="(itemOrderObj, index) in orderList" :key="index" class="cover-container" @click="checkOrderDetail(itemOrderObj)">
				<!--订单时间及其状态-->
				<view class="order-section header flex flexAlignC spaceBetween flexAlignSelfStart">
					<view class="order-section-time">{{itemOrderObj.time}}</view>
					<view class="order-section-status" :style="{color:itemOrderObj.stateTipColor}">{{itemOrderObj.stateTip}}</view>
				</view>
				<!--订单商品展示-->
				<scroll-view v-if="itemOrderObj.goodsList.length != 0" class="goods-box goods-box-width">
					<view class="goods-item" v-for="(goodsItem, goodsIndex) in itemOrderObj.goodsList" :class="goodsIndex == 0? 'ml24 mr8' : 'ml8 mr8'"
					 :key="goodsIndex">
						<view v-if="goodsItem.type == 1" class="flex posiA flexAlignC goods-more-size">
							<view class="goods-more">查看全部</view>
							<image class="goods-more-arrow" src="../../../static/common-icon/arrow-right.png"></image>
						</view>
						<BannerImg v-else="goodsItem.type != 1" class="goods-img" :bannerUrl="goodsItem.productPic || ''" width="120"
						 height="120" mode="aspectFill"></BannerImg>
					</view>
				</scroll-view>
				<!--订单件数及其实付金额-->
				<view class="header flex flexAlignC flexAlignSelfStart spaceBetween">
					<view v-if="itemOrderObj.goodsList.length != 0" class="order-section-des flexGrow1 texR">共{{itemOrderObj.goodsList.length}}件
						实付:</view>
					<view class="order-prefix-money">¥</view>
					<view class="order-section-money mr24">{{itemOrderObj.payMoney}}</view>
				</view>
			</view>
			<!--加载更多-->
			<uniLoadMore :status="loadingType"></uniLoadMore>
		</scroll-view>
	</view>
</template>
<script>
	import {
		GetOrderList
	} from '@/utils/api';

	import empty from "../../components/empty/index.vue";
	import uniLoadMore from "../../components/uni-load-more/uni-load-more.vue"
	const util = require("@/utils/util.js");
	const orderUtil = require("@/utils/orderUtil.js");
	const app = getApp();
	export default {
		components: {
			empty,
			uniLoadMore
		},
		data() {
			return {
				orderList: [],
				loadingType: 'more',
				current: 1,
				pageSize: 20,
				loaded: false,
				isLoadOrderList: false,
			}
		},
		onLoad(e) {
			this.loadData(e);
		},
		onShow() { //页面显示
			if (!this.isLoadOrderList) {
				this.loadData();
			}
			this.isLoadOrderList = false;
		},
		onHide() {
			this.current = 1;
			this.loadingType = 'more';
			this.orderList = [];
		},
		methods: {
			loadData(e) {
				if (this.loadingType === 'loading' || this.loadingType === 'noMore' || (this.loaded === true)) {
					return;
				}
				this.loadingType = 'loading';
				// 调用接口并添加接口返回的数据
				// orderList.forEach(item => {
				// item = Object.assign(item, orderUtil.orderStateExp(item.state));
				// navItem.orderList.push(item);
				// });
				let dataParams = {
					pageNum: this.current,
					pageSize: this.pageSize,
				}
				if (orderUtil.refundOrderParams(4)) {
					Object.assign(dataParams, orderUtil.refundOrderParams(4));
				}
				let params = {
					url: GetOrderList,
					type: 'POST',
					data: dataParams,
					loading: {
						msg: '加载中',
						mask: true
					}
				};
				let data = params;
				app.uniAjax(data).then(res => {
					console.log("uni-app param ", params);
					console.log(res.data.code);
					console.log("获取退款/售后订单==== ", res.data.data);
					if (res.data.code == 200) {
						if (res.data.data.records.length == 0 && this.orderList.length == 0) { //如果是第一页的数据为空则显示空界面
							this.loaded = true;
							this.loadingType = 'noMore';
						} else {
							this.current++;
							//判断是否还有数据，有改为‘more’，没有改为noMore
							if (res.data.data.records.length != 0) {
								res.data.data.records.forEach(item => {
									// 将数据处理到界面
									item = Object.assign(item, orderUtil.orderStateExp(item.status)); //状态及其颜色
									let time = item.createTime; //时间
									let payMoney = item.payAmount; //订单金额
									let orderId = item.id; //订单编号
									let goodsList = item.orderItemList.length <= 5 ? item.orderItemList : (item.orderItemList(0, 4).push({
										type: 1
									})); //商品列表数据 (大于5，添加查看更多模板)
									goodsList.forEach(goodObj => { //格式化商品图片url
										goodObj.productPic = util.thumbUrl(goodObj.productPic);
									});
									item = Object.assign(item, {
										time,
										payMoney,
										orderId,
										goodsList
									});
									this.orderList.push(item);
								});
								this.loadingType = res.data.data.records.length < 20 ? 'noMore' : 'more';
							} else {
								//如果等于0，则为最后一页数据
								this.loadingType = 'noMore';
							}
						}
					}
				});
			},
			checkOrderDetail(item) { //查看订单详情
				app.toLink('/pages/member/order-detail/index?order_id=' + item.orderId);
			}
		}
	}
</script>

<style lang="scss">
	@import "./index.scss";
</style>
