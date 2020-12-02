<template>
	<view class="content">
		<NavBar backType="1" title="我的提货券"></NavBar>
		<view class="navbar flex spaceBetween">
			<view v-for="(item, index) in navTabbarList" :key="index" class="nav-item texC spaceBetween" :class="{current:tabCurrentIndex === index}"
			 @click="tabClick(index)">
				{{item.text+'（'+item.voucherList.length+'）'}}
			</view>
		</view>
		<swiper :current="tabCurrentIndex" class="swiper-box" :style="{height: swithBoxHeight}" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navTabbarList" :key="tabIndex">
				<scroll-view class="list-scroll-content"  scroll-y="true">
					<!-- 空白页  -->
					<empty v-if="tabItem.loaded == true && tabItem.voucherList.length === 0" topPadding="-600"></empty>
					<!--列表-->
					<view v-for="(item, index) in tabItem.voucherList" :key="index" class="list-box">
						<view class="main-area">
							<image class="circle-icon left-circle" src="../../../static/coupon/img-coupon-cicle.png" mode="aspectFit"></image>
							<view class="main-left-area">
								<text :class="amount">￥{{ item.ticketVal }}</text>
								<text class="amount-desc">{{item.isFreeShipping == 1 ? '免配送费' : '需配送费' }}</text>
							</view>
							<view class="main-middle-area">
								<text class="item-name">{{ item.ticketName }}</text>
								<text class="item-id">券码：{{item.cardNo}}</text>
								<text class="item-time">{{item.effectiveStartDate}}-{{item.effectiveEndDate}}</text>
							</view>
							<image class="circle-icon right-circle" src="../../../static/coupon/img-coupon-cicle-1.png" mode="aspectFit"></image>
						</view>
						<button class="btn-use bg-image" v-if="item.pickStatus == 1" @click="btnAction(item)">去使用</button>
						<image class="icon-invaild" v-if="item.pickStatus == 2" src="../../../static/coupon/ic-coupon-used.png" mode="aspectFit"></image>
						<image class="icon-invaild" v-if="item.pickStatus == 3" src="../../../static/coupon/ic-coupon-overtime.png" mode="aspectFit"></image>
						
					</view>
					<view v-if="tabItem.state == 1 " class="bottom-emptyView"></view>
				</scroll-view>
				<view v-if="tabItem.state == 1" class="bottom-backView">
					<text class="des-text texC">已添加的券，不可解绑或转赠</text>
					<button class="add-btn bg-image" @click="bandGiftVoucherAction()">添加电子提货券</button>
				</view>
			</swiper-item>
		</swiper>
		<PopupWindow ref="popup" type="center" height="540" width="622" radius="6" closeIconSize="32" :showCloseIcon="true"
		 @hide="popupWindowHide">
			<view class="popupWindow">
				<view class="popupWindow-title">添加提货券</view>	
				<view class="code-inputBack">
					<input class="code-input" placeholder="请输入券编号" placeholder-style="color:#999999; font-size: 26rpx;" :value="verfityCode" @input="handleInput" data-type="verfityCode" />
				</view>
		
				<view class="password-inputBack">
					<input class="password-input" placeholder="请输入券密码" placeholder-style="color:#999999; font-size: 26rpx;" :value="redemptionCode" @input="handleInput" data-type="redemptionCode" />
				</view>
				<button class="certain" :class="{active:certainBackgroundImage}" @click="postBandGiftVoucher()">绑定至账户</button>
		
			</view>
		</PopupWindow>
	</view>
</template>

<script>
	import empty from "../../components/empty/index.vue";
import PopupWindow from '../../components/wyb-popup/wyb-popup.vue'
import { PostMyPickCards, PostBindPickCard } from '@/utils/api.js';

const util = require('@/utils/util.js');
const app = getApp();
export default {
	components: {
		PopupWindow,
		empty,
	},
	data() {
		return {
			swithBoxHeight: '',
			certainBackgroundImage: false,//弹框绑定事件
			verfityCode: '',//券编号输入框
			redemptionCode: '',//券密码输入框
			tabCurrentIndex: 0,
				navTabbarList: [{
						state: 1,
						text: '未使用',
						loadingType: 'more',
						current: 0,
						pageSize: 20,
						voucherList: [
						// 	{
						// 	cardNo:'P00HO22020',
						// 	effectiveStartDate:'1600245052',
						// 	effectiveEndDate:1600245052,
						// 	isFreeShipping:1,
						// 	pickStatus:1,
						// 	pickTicketId:'ewewewewe',
						// 	ticketName:'这里取后台提货券名称',
						// 	ticketVal:234,
						// },{
						// 	cardNo:'P00HO22020',
						// 	effectiveStartDate:'1600245052',
						// 	effectiveEndDate:1600245052,
						// 	isFreeShipping:1,
						// 	pickStatus:1,
						// 	pickTicketId:'ewewewewe',
						// 	ticketName:'这里取后台提货券名称',
						// 	ticketVal:234,
						// },{
						// 	cardNo:'P00HO22020',
						// 	effectiveStartDate:'1600245052',
						// 	effectiveEndDate:1600245052,
						// 	isFreeShipping:1,
						// 	pickStatus:1,
						// 	pickTicketId:'ewewewewe',
						// 	ticketName:'这里取后台提货券名称',
						// 	ticketVal:234,
						// },{
						// 	cardNo:'P00HO22020',
						// 	effectiveStartDate:'1600245052',
						// 	effectiveEndDate:1600245052,
						// 	isFreeShipping:1,
						// 	pickStatus:1,
						// 	pickTicketId:'ewewewewe',
						// 	ticketName:'这里取后台提货券名称',
						// 	ticketVal:234,
						// },{
						// 	cardNo:'P00HO22020',
						// 	effectiveStartDate:'1600245052',
						// 	effectiveEndDate:1600245052,
						// 	isFreeShipping:1,
						// 	pickStatus:1,
						// 	pickTicketId:'ewewewewe',
						// 	ticketName:'这里取后台提货券名称',
						// 	ticketVal:234,
						// },{
						// 	cardNo:'P00HO22020',
						// 	effectiveStartDate:'1600245052',
						// 	effectiveEndDate:1600245052,
						// 	isFreeShipping:1,
						// 	pickStatus:1,
						// 	pickTicketId:'ewewewewe',
						// 	ticketName:'这里取后台提货券名称',
						// 	ticketVal:234,
						// },
						]
					},
					{
						state: 2,
						text: '已使用',
						loadingType: 'more',
						current: 0,
						pageSize: 20,
						voucherList: [
						// 	{
						// 	cardNo:'P00HO22020',
						// 	effectiveStartDate:'1600245052',
						// 	effectiveEndDate:1600245052,
						// 	isFreeShipping:1,
						// 	pickStatus:2,
						// 	pickTicketId:'ewewewewe',
						// 	ticketName:'这里取后台提货券名称',
						// 	ticketVal:234,
						// },{
						// 	cardNo:'P00HO22020',
						// 	effectiveStartDate:'1600245052',
						// 	effectiveEndDate:1600245052,
						// 	isFreeShipping:1,
						// 	pickStatus:2,
						// 	pickTicketId:'ewewewewe',
						// 	ticketName:'这里取后台提货券名称',
						// 	ticketVal:234,
						// },{
						// 	cardNo:'P00HO22020',
						// 	effectiveStartDate:'1600245052',
						// 	effectiveEndDate:1600245052,
						// 	isFreeShipping:1,
						// 	pickStatus:2,
						// 	pickTicketId:'ewewewewe',
						// 	ticketName:'这里取后台提货券名称',
						// 	ticketVal:234,
						// },{
						// 	cardNo:'P00HO22020',
						// 	effectiveStartDate:'1600245052',
						// 	effectiveEndDate:1600245052,
						// 	isFreeShipping:1,
						// 	pickStatus:2,
						// 	pickTicketId:'ewewewewe',
						// 	ticketName:'这里取后台提货券名称',
						// 	ticketVal:234,
						// },{
						// 	cardNo:'P00HO22020',
						// 	effectiveStartDate:'1600245052',
						// 	effectiveEndDate:1600245052,
						// 	isFreeShipping:1,
						// 	pickStatus:2,
						// 	pickTicketId:'ewewewewe',
						// 	ticketName:'这里取后台提货券名称',
						// 	ticketVal:234,
						// },{
						// 	cardNo:'P00HO22020',
						// 	effectiveStartDate:'1600245052',
						// 	effectiveEndDate:1600245052,
						// 	isFreeShipping:1,
						// 	pickStatus:2,
						// 	pickTicketId:'ewewewewe',
						// 	ticketName:'这里取后台提货券名称',
						// 	ticketVal:234,
						// },
						]
					},
					{
						state: 3,
						text: '已过期',
						loadingType: 'more',
						current: 0,
						pageSize: 20,
						voucherList: []
					}
				],
			};
	},
	onLoad(e) {
		this.swithBoxHeight = 'calc(100% - 80rpx - ' + app.globalData.navBar.height + ')';
		this.tabCurrentIndex = +e.state || 0;
		this.loadData(e);
	},
	methods:{
		loadData(source) {
			let index = this.tabCurrentIndex;
			let navItem = this.navTabbarList[index];
			let state = navItem.state;
			navItem.loadingType = 'loading';
			let params = {
				url: PostMyPickCards,
				type: 'POST',
				pageNum: navItem.current,
				pageSize: navItem.pageSize,
				pickStatus:state,
				loading: {
					msg: '加载中',
					mask: true
				}
			};
			
			app.uniAjax(params).then(res => {
				console.log("zhn param 获取提货券列表=== ", params, res);
				if (res.data.code == 200) {
					if (res.data.data.records.length < 20) {
						this.$set(navItem, 'loaded', true);
						navItem.loadingType = 'noMore';
					} else{
						navItem.loadingType = 'more';
						navItem.current++;
						
					}
					res.data.data.records.forEach(item => {
						// 将数据处理到界面
						navItem.voucherList.push(item);
					});
				} else {
					//接口请求失败的报错提示
					if (res.data.msg) {
						uni.showToast({
							title: res.data.msg
						});
					}
				}
			});
		},
		// 顶部tab点击事件
		tabClick(index) {
			this.tabCurrentIndex = index;
		},
		// tab切换
		changeTab(e) {
			// debugger;
			this.tabCurrentIndex = e.target.current;
			let navItem = this.navTabbarList[this.tabCurrentIndex];
			if (navItem.voucherList.length <= 0) {
				this.loadData('tabChange');
			}
		},
		// 去使用事件
		btnAction(item) {
			uni.navigateTo({
				url: `/packageOtherOrders/pick-up-goods/order/index?id=${item.id}&pickTicketId=${item.pickTicketId}`
			});
		},
		// 绑卡事件
		bandGiftVoucherAction(){
			this.$refs.popup.show();
		},
		// 输入事件
		handleInput: function(event) {
			const {
				type
			} = event.currentTarget.dataset;
			const value = event.detail && event.detail.value || '';
		
			switch (type) {
				case 'redemptionCode':
		
					this.redemptionCode = value;
					this.certainBackgroundImage = this.verfityCode.length > 0 && value.length > 0;
					break;
				case 'verfityCode':
		
					this.verfityCode = value;
					this.certainBackgroundImage = this.redemptionCode.length  > 0 && value.length  > 0;
					break;
			}
		},
		// 绑卡弹框隐藏
		popupWindowHide() {
			this.verfityCode = '';
			this.redemptionCode = '';
			this.countDown = 0;
			this.certainBackgroundImage = false;
		},
		// 绑卡弹框绑定事件
		postBandGiftVoucher(){
			if (!this.certainBackgroundImage) {
				// debugger
					return;
				}
				let smsVerificationRecharge = {
					cardNo: this.verfityCode,
					pwd: this.redemptionCode,
				};
				app.uniAjax({
					url: PostBindPickCard,
					type: 'POST',
					data: smsVerificationRecharge,
					loading: {
						msg: '',
						mask: true
					}
				}).then(res => {
					// debugger
				console.log("zhn 绑定提货券=== ",smsVerificationRecharge, res);
					let resData = res.data;
					if (resData.code == 200) {
					  this.$refs.popup.hide();
					  this.loadData();
					} else {
					  uni.showToast({
					    title: resData.msg,
					    icon: 'none',
					    duration: 2000
					  });
					}
				}).catch(res => {
					// debugger
					console.log("zhn param 绑定提货券===error ",smsVerificationRecharge, res);
					// uni.showToast({
					// 	title: res.data.msg,
					// 	icon: 'none',
					// 	duration: 2000
					// });
				});
			},
	},
	
	
};
</script>

<style lang="scss">
@import './index.scss';
</style>
