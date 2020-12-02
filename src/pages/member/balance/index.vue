<template>
	<view class="page-balance-content">
		<NavBar backType="1" title="账户余额"></NavBar>
		<view class="balance">
			<text class="current-balance-title">当前可用余额</text>

			<view style="margin-top: 20rpx;">
				<text class="amount-unit">￥</text>
				<text class="amount-txt">{{balance}}</text>
			</view>

			<view class="button-content">
				<button class="balance-detail" @click="balanceDetail()">余额明细</button>
				<button class="redemption-code-recharge" @click="redemptionCodeRecharge()">兑换码充值</button>
			</view>
		</view>

		<view class="saleablecardlist-content">
			<view style="margin-left: 24rpx; margin-top: 32rpx; margin-right: 24rpx; margin-bottom: 20rpx;">
				<text class="buy-saleableCard">购买充值卡</text>
				<text class="saleableCard-tip">可自用 可转赠</text>
			</view>

			<view class="saleablecardlist">
				<view class="saleablecard" v-for="(item,index) in saleableAllCardList " :key='index' :class="{active:selectedSaleableCardIndx === index}"
				 @click="selectedSaleableCard(item,index)">{{item.faceValue}}</view>
			</view>

			<view class="saleablecard-use-info-content" @click="prepaidCardUseInfo()">
				<text class="saleablecard-use-info">购买及充值说明</text>
				<image class="arrow-icon" src="../../../static/common-icon/arrow-right.png"></image>
			</view>

			<button class="to-buy" @click="toBuy()">去购买</button>

		</view>

		<PopupWindow ref="popup" type="center" height="602" width="622" radius="6" closeIconSize="32" :showCloseIcon="true"
		 @hide="popupWindowHide">
			<view class="popupWindow">
				<view class="popupWindow-title">兑换码充值</view>

				<view class="popupWindow-account-verfity-content">
					<view class="popupWindow-account-verfity">当前账户是</view>
					<view class="popupWindow-phone-number">{{phoneNumberTxt}}</view>
					<view class="popupWindow-account-verfity">，请先验证</view>
				</view>

				<view class="input-verfity-code-content">
					<input class="input-verfity-code" placeholder="请输入验证码" placeholder-style="color:#999999; font-size: 26rpx;" type="number"
					 maxlength="6" :value="verfityCode" @input="handleInput" data-type="verfityCode" />
					<button class="btn-verfity-code" @click="getSmsCode()">{{buttonVerfityCodeText}}</button>
				</view>

				<view class="input-redemption-code-recharge-content">
					<input class="input-redemption-code-recharge" placeholder="请输入兑换码" placeholder-style="color:#999999; font-size: 26rpx;"
					 maxlength="12" :value="redemptionCode" @input="handleInput" data-type="redemptionCode" />
				</view>

				<button class="certain" :class="{active:certainBackgroundImage}" @click="postverificationRefillableCard()">确定</button>

			</view>
		</PopupWindow>
	</view>
</template>

<script>
	const util = require("@/utils/util.js");
	const app = getApp();
	import PopupWindow from '../../components/wyb-popup/wyb-popup.vue'
	import {
		GetSmsCode,
		GetsaleableAllCardList,
		PostVerificationRefillableCard,
		GetCurrentMemberInfo
	} from "@/utils/api"; //获取api

	export default {

		components: {
			PopupWindow,
		},

		data() {
			return {
				balance: 0,
				buttonVerfityCodeText: '获取验证码',
				certainBackgroundImage: false,
				countDown: 0,
				verfityCode: '',
				redemptionCode: '',
				selectedSaleableCardIndx: 0,
				saleableAllCardList: [],
				phoneNumberTxt: '',
				phoneNumber: '',
				countDownInterval: null,
				rechargeCard: null,
			}
		},

		onLoad(option) {
			this.getSaleableAllCardList();

		},

		onShow() {
			this.phoneNumber = app.globalData.userInfo.phone;
			let reg = /(\d{3})\d{4}(\d{4})/;
			this.phoneNumberTxt = this.phoneNumber.replace(reg, "$1****$2");
			this.balance = app.globalData.userInfo.blance;
		},

		methods: {

			toBuy() {
				
				if (this.rechargeCard == null) {
					return;
				}
				
				let tempRechargeCard = encodeURIComponent(JSON.stringify(this.rechargeCard));
				uni.navigateTo({
					url: '/packageOtherOrders/recharge-card/order/index?rechargeCard='+tempRechargeCard,
				})

			},

			getMemberInfo() {
				app.uniAjax({
					url: GetCurrentMemberInfo,
					type: 'GET',
				}).then(res => {
					if (res.data.code === 200) {
						app.globalData.userInfo = Object.assign(app.globalData.userInfo, res.data.data);
						this.balance = app.globalData.userInfo.blance;
					}
				});
			},

			popupWindowHide() {
				this.verfityCode = '';
				this.redemptionCode = '';
				this.countDown = 0;
				this.buttonVerfityCodeText = '获取验证码';
				this.certainBackgroundImage = false;
				this.clearInterval();
			},

			clearInterval() {
				if (this.countDownInterval != null) {
					clearInterval(this.countDownInterval);
					this.countDownInterval = null;
				}
			},

			getSaleableAllCardList() {

				app.uniAjax({
					url: GetsaleableAllCardList,
					type: 'GET',
					loading: {
						msg: '',
						mask: true
					}
				}).then(res => {

					if (res.data.code === 200) {

						if (res.data.data != undefined && res.data.data.length > 0) {
							this.selectedSaleableCardIndx = 0;
							this.saleableAllCardList = res.data.data;
							this.rechargeCard = this.saleableAllCardList[0];
						}

					} else {
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
							duration: 2000
						});
					}

				}).catch(res => {

					uni.showToast({
						title: res.data.msg,
						icon: 'none',
						duration: 2000
					});
				});

			},

			getSmsCode() {
				var self = this;
				if (self.countDown != 0) return; //倒计时中不能重复请求

				app.uniAjax({
					url: GetSmsCode + '/' + self.phoneNumber,
					type: 'POST',
					loading: {
						msg: '',
						mask: true
					}
				}).then(res => {

					uni.showToast({
						title: res.data.msg,
						icon: 'none',
						duration: 2000
					});

					if (res.data.code == 200) {

						let tempCountDown = 120; //默认倒计时120s
						self.countDownInterval = setInterval(function() {

							if (tempCountDown == 0) {
								self.buttonVerfityCodeText = '重新获取';
								self.countDown = tempCountDown;
								clearInterval(self.countDownInterval);
								self.countDownInterval = null;
							} else {
								self.buttonVerfityCodeText = "已发送(" + tempCountDown + "s)";
								self.countDown = tempCountDown;
							}
							tempCountDown--;
						}, 1000);
					}
				}).catch(res => {

					uni.showToast({
						title: res.data.msg,
						icon: 'none',
						duration: 2000
					});

				});

			},

			handleInput: function(event) {
				const {
					type
				} = event.currentTarget.dataset;
				const value = event.detail && event.detail.value || '';

				switch (type) {
					case 'redemptionCode':

						this.redemptionCode = value;
						this.certainBackgroundImage = this.verfityCode.length == 6 && value.length == 12;
						break;
					case 'verfityCode':

						this.verfityCode = value;
						this.certainBackgroundImage = this.redemptionCode.length == 12 && value.length == 6;
						break;
				}
			},

			balanceDetail() {
				uni.navigateTo({
					url: '../balance-detail/index?balanceNum=' + this.balance,
				});

			},

			prepaidCardUseInfo() {
				uni.navigateTo({
					url: '../rule/index?type=prepaidCardUseInfo',
				});
			},

			redemptionCodeRecharge() {
				this.$refs.popup.show();
			},

			selectedSaleableCard(saleableCard, index) {
				this.selectedSaleableCardIndx = index;
				this.rechargeCard = saleableCard;
			},

			postverificationRefillableCard() {

				if (!this.certainBackgroundImage) {
					return;
				}

				let smsVerificationRecharge = {
					verificationCode: this.verfityCode,
					cardSecretKey: this.redemptionCode,
				};

				app.uniAjax({
					url: PostVerificationRefillableCard,
					type: 'POST',
					data: smsVerificationRecharge,
					loading: {
						msg: '',
						mask: true
					}
				}).then(res => {

					uni.showToast({
						title: res.data.msg,
						icon: 'none',
						duration: 2000
					});

					if (res.data.code === 200) {
						this.$refs.popup.hide();
						this.getMemberInfo();
					}

				}).catch(res => {

					uni.showToast({
						title: res.data.msg,
						icon: 'none',
						duration: 2000
					});
				});

			},
		},

		onHide() {
			this.clearInterval();
		},

	}
</script>

<style lang="scss">
	@import "./index.scss";
</style>
