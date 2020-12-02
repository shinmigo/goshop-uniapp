<template>
	<view class="page-recharge-content">
		<NavBar backType="1" title="确认订单"></NavBar>

		<view class="recharge-card-item">

			<OrderSku :skuData="rechargeCard" />

			<view class="buy-sku-quantity">
				<text class="buy-sku-quantity-txt">购买数量</text>
				<view class="flexGrow1"></view>
				<Counter ref="counter" width="180" :count="quantity" @onCountMinus="onCartItemCountMinus" @onCountPlus="onCartItemCountPlus"></Counter>
			</view>

			<view class="line-horizontal"></view>

			<view class="order-actual-amount">
				<text class="actual-amount">¥{{totalAmount}}</text>
				<text class="actual-amount-txt">应付：</text>
			</view>

		</view>

		<view class="sumbit-order-bottom">
			<view style="margin-left: 32rpx;">
				<text class="actual-amount-txt" style="color: #353535;">应付：</text>
				<text class="amount-unit" style="font-weight: bold;">¥</text>
				<text class="sku-discountprice" style="font-size: 40rpx;">{{totalAmount}}</text>
			</view>

			<button class="sumbit-order" @click="sumbitOrder">提交订单</button>
		</view>
		<Payment ref="payment" @create-order="createOrder" :needBalance="false" />
	</view>

</template>
<script>
	const app = getApp();
	import Counter from '../../../pages/components/counter/index.vue';
	import OrderSku from "@/pages/components/order-sku/index";
	import Payment from "../../../pages/order/payment/index.vue";
	import {
		POSTBuyCard
	} from "@/utils/api";

	export default {
		components: {
			Counter,
			OrderSku,
			Payment,
		},
		data() {
			return {
				rechargeCard: {
					"originalPrice": 0,
					"price": 0,
					"productName": "",
					"productPic": "",
					"productSkuId": "",
					"quantity": "",
					"sp1": "",
					"sp2": ""
				},
				
				quantity:1,

				orderReceiptVo: {
					realAmount: '', //实际支付金额
					totalAmount: '',
					couponAmount: '',
					promotionAmount: '',
					freight: '',
					integral: ''
				},

				totalAmount: 0,
				balance: 0,
			}
		},
		onLoad(options) {

			if (options != undefined) {
				options = JSON.parse(decodeURIComponent(options.rechargeCard));
				this.rechargeCard.price = options.actualPrice;
				this.rechargeCard.productName = options.giftName;
				this.rechargeCard.productPic = options.imgUrl;
				this.rechargeCard.productSkuId = options.id;
				this.rechargeCard.quantity = "";
				this.rechargeCard.sp1 = "1张";
				this.totalAmount = this.rechargeCard.price;
			}

		},

		onShow() {
			this.balance = app.globalData.userInfo.blance;
		},

		methods: {

			onCartItemCountPlus() {
				this.quantity += 1;
				this.totalAmount = this.rechargeCard.price * this.quantity;
			},
			onCartItemCountMinus() {

				if (this.quantity > 1) {
					this.quantity -= 1;
					this.totalAmount = this.rechargeCard.price * this.quantity;
				}
			},

			sumbitOrder() {
				this.orderReceiptVo.realAmount = this.totalMoney;
				this.orderReceiptVo.totalAmount = this.totalAmount;
				this.$refs.payment.modalAnimate(true, {
					orderReceiptVo: this.orderReceiptVo,
					balance: this.balance
				});
			},

			createOrder() {

				let data = {
					applyChannel: '',
					cards: [{
						id: this.rechargeCard.productSkuId,
						quantity: this.quantity,
					}, ],
				};

				app.uniAjax({
					url: POSTBuyCard,
					type: 'POST',
					data: data,
					loading: {
						msg: '',
						mask: true
					}

				}).then(res => {

					if (res.data.code === 200) {

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

			}

		}
	}
</script>

<style lang="scss">
	@import "./index.scss";
</style>
