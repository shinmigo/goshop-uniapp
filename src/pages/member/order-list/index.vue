<template>
	<view class="content">
		<NavBar backType="1" title="我的订单"></NavBar>
		<view class="navbar flex spaceBetween">
			<view v-for="(item, index) in navTabbarList" :key="index" class="nav-item" :class="{current:tabCurrentIndex === index}"
			 @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>
		<!-- :style="{height:swithBoxHeight}" -->
		<swiper :current="tabCurrentIndex" class="swiper-box" :style="{height: swithBoxHeight}" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navTabbarList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y="true" scroll-x="false" show-scrollbar="false" @scrolltolower="loadData">
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded == true && tabItem.orderList.length === 0" width="272" imgHeight="272" topPadding="-600"></empty>
					<!--订单列表-->
					<view v-for="(itemOrderObj, index) in tabItem.orderList" :key="index" class="cover-container" @click="checkOrderDetail(itemOrderObj)">
						<view class="order-section header flex flexAlignC spaceBetween flexAlignSelfStart">
							<view class="order-section-time">{{itemOrderObj.time}}</view>
							<view class="order-section-status" :style="{color:itemOrderObj.stateTipColor}">{{itemOrderObj.stateTip}}</view>
						</view>
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
						<view class="header flex flexAlignC flexAlignSelfStart spaceBetween">
							<view v-if="itemOrderObj.goodsList.length != 0" class="order-section-des flexGrow1 texR">共{{itemOrderObj.goodsList.length}}件
								实付:</view>
							<view class="order-prefix-money">¥</view>
							<view class="order-section-money mr24">{{itemOrderObj.payMoney}}</view>
						</view>
					</view>
					<uniLoadMore :status="tabItem.loadingType"></uniLoadMore>
				</scroll-view>
			</swiper-item>
		</swiper>
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
				swithBoxHeight: '',
				tabCurrentIndex: 0,
				isLoadOrderList: false,
				navTabbarList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						current: 1,
						pageSize: 20,
						orderList: []
					},
					{
						state: 1,
						text: '待付款',
						loadingType: 'more',
						current: 1,
						pageSize: 20,
						orderList: []
					},
					{
						state: 2,
						text: '待发货',
						loadingType: 'more',
						current: 1,
						pageSize: 20,
						orderList: []
					},
					{
						state: 3,
						text: '待收货',
						loadingType: 'more',
						current: 1,
						pageSize: 20,
						orderList: []
					}
				],
			};
		},
		onLoad(e) {
			this.isLoadOrderList = true;
			this.tabCurrentIndex = +e.state || 0;
			this.swithBoxHeight = 'calc(100% - 80rpx - ' + app.globalData.navBar.height + ')';
			this.loadData(e);
		},
		onShow() {
			if (!this.isLoadOrderList) {
				this.loadData();
			}
			this.isLoadOrderList = false;
		},
		onHide() {
			//恢复到初始状态
			for (let index in this.navTabbarList) {
				let navItem = this.navTabbarList[index];
				navItem.current = 1;
				navItem.loadingType = 'more';
				navItem.orderList = [];
			}
		},
		methods: {
			loadData(source) {
				let index = this.tabCurrentIndex;
				let navItem = this.navTabbarList[index];
				let state = navItem.state;
				if (source === 'tabChange' && navItem.loaded === true) {
					return;
				}
				if (navItem.loadingType === 'loading' || navItem.loadingType === 'noMore') {
					return;
				}
				navItem.loadingType = 'loading';
				// 调用接口并添加接口返回的数据
				let dataParams = {
					page: navItem.current,
					page_size: navItem.pageSize,
				}
				if (orderUtil.orderStatusParams(state)) {
					Object.assign(dataParams, orderUtil.orderStatusParams(state));
				}
				let params = {
					url: GetOrderList,
					type: 'Get',
					data: dataParams,
					loading: {
						msg: '加载中',
						mask: true
					}
				};
				Object.assign(params, dataParams)
				app.uniAjax(params).then(res => {
					console.log("uni-app param 获取订单列表=== ", params,res.data, res.data.run_time, res.data.code);
					if (res.data.code == 1) {
						if ((res.data.data[0].total == 0 || res.data.data[0].orders.count == 0) && navItem.orderList.count == 0) { //如果是第一页的数据为空则显示空界面
							this.$set(navItem, 'loaded', true);
							navItem.loadingType = 'noMore';
						} else {
							navItem.current++;
							//判断是否还有数据，有改为‘more’，没有改为noMore
							if ((res.data.data[0].orders && res.data.data[0].orders.count != 0) || res.data.data[0].total == 0) {
								res.data.data[0].orders.forEach(item => {
									// 将数据处理到界面
									item = Object.assign(item, orderUtil.orderStateExp(item.order_status)); //状态及其颜色
									item.stateTip = item.order_status_name;
									item.time = item.created_at; //时间
									item.payMoney = item.grand_total; //订单金额
									item.orderId = item.order_id; //订单id
									item.goodsList = item.order_items.length <= 5 ? item.order_items : (item.order_items(0,
										4).push({
										type: 1
									})); //商品列表数据 (大于5，添加查看更多模板)
									item.goodsList.forEach(goodObj => { //格式化商品图片url
										goodObj.productPic = util.thumbUrl(goodObj.image);
									});
									navItem.orderList.push(item);
								});
								navItem.loadingType = res.data.data[0].orders.length < 20 ? 'noMore' : 'more';
							} else {
								//如果等于0，则为最后一页数据
								navItem.loadingType = 'noMore';
							}
						}
					} else {
						//接口请求失败的报错提示
						if (navItem.orderList.count == 0) { //如果是第一页的数据为空则显示空界面
							this.$set(navItem, 'loaded', true);
							navItem.loadingType = 'noMore';
						}
						if (res.data.msg) {
							uni.showToast({
								title: res.data.msg
							});
						}
					}
				});
			},
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			checkOrderDetail(item) { //查看订单详情
				app.toLink('/pages/member/order-detail/index?order_id=' + item.orderId);
			},
		}
	}
</script>

<style lang="scss">
	@import "./index.scss";
</style>
