<template>
	<view>
		<NavBar :title="title"></NavBar>
		<view v-if="productVos.length>0" class="sku-list">
			<view class="sku-item" v-for="(product,index) in productVos" :key="product.productSkuId">
				<OrderSku :skuData="product"></OrderSku>
			</view>
		</view>
		<view class="bottom-content">
			<view class="address" @tap="onAddrClick">
				<BannerImg class="addr-icon" width="68" height="68" :bannerUrl="img.addressIcon"></BannerImg>
				<view class="text-content">
					<view class="f28 c_text_title">
						{{address.name}}<span class="ml16">{{address.phoneNumber}}</span>
					</view>
					<view class="mt20 f26 c_text">{{address.province + address.city + address.region + address.detailAddress}}</view>
				</view>
				<BannerImg class="arrow-icon" width="32" height="32" :bannerUrl="img.arrowRightIcon"></BannerImg>
			</view>
			<view class="btn-commit" @tap="commit">免费提货</view>
		</view>
		<view class="dialog" v-if="confirmDialog">
			<view @tap.stop="switchConfirmDialogShow(false)" @touchmove.stop.prevent class="bg-grey"></view>
			<view class="dialog-content">
				<image class="dialog-close" :src="img.closeIcon" @tap="switchConfirmDialogShow"></image>
				<view class="flex dialog-text-content">
					<view class="flexGrow1 f28 c_text">商品金额</view>
					<view class="f28 c_text_title">¥{{totalMoney}}</view>
				</view>
				<view class="flex dialog-text-content mt32">
					<view class="flexGrow1 f28 c_text">运费</view>
					<view class="f28 c_text_title">¥{{shipping}}</view>
				</view>
				<view class="flex dialog-text-content mt32">
					<view class="flexGrow1 f28 c_text">提货券抵用</view>
					<view class="f28 c_text_title">-¥{{totalMoney+shipping}}</view>
				</view>
				<view class="flex dialog-text-content mt44">
					<view class="flexGrow1 f28 c_text">应付金额</view>
					<view class="f40 c_price"><span class="f28">¥</span>0</view>
				</view>
				<view class="flexAlignSelfC f26 c_text_grey mt64">包裹将于<span class="fm" style="color: #46c600;">{{sendDate}}</span>发出</view>
				<view class="confirm-commit" @tap="commitOrder">确认提货</view>
			</view>
		</view>
	</view>
</template>
<script>
	import OrderSku from "@/pages/components/order-sku/index";
	const app = getApp();
	const util = require("@/utils/util.js");
	const addressIcon = require("@/static/common-icon/address.png");
	const arrowRightIcon = require("@/static/common-icon/arrow-right.png");
	const closeIcon = require("@/static/common-icon/ic-close.png");
	import {
		GetPickCardGoods,
		GenerateOrder
	} from "@/utils/api";
	export default {
		components: {
			OrderSku
		},
		data() {
			return {
				title: '礼品清单',
				pickTicketId: '',
				id: '',
				img: {
					addressIcon: addressIcon,
					arrowRightIcon: arrowRightIcon,
					closeIcon: closeIcon
				},
				address: {
					id: "",
					name: "",
					phoneNumber: "",
					province: "",
					city: "",
					cityId: "",
					region: "",
					regionId: "",
					detailAddress: "",
				},
				productVos: [],
				sendDate: "", //发货时间
				shipping: 0, //运费
				totalMoney: 0, //商品总金额
				confirmDialog: false
			}
		},
		onLoad(option) {
			this.pickTicketId = option.pickTicketId;
			this.id = option.id
			this.getPickCardGoods();
		},
		onShow() {
			this.address = app.globalData.globalAddr
		},
		methods: {
			getPickCardGoods() {
				app.uniAjax({
					url: GetPickCardGoods + '/' + this.pickTicketId,
					type: 'GET'
				}).then(res => {
					let response = res.data;
					if (response.code == 200) {
						let skuList = []
						for (var i = 0; i < response.data.list.length; i++) {
							let item = response.data.list[i]
							skuList.push({
								productPic: item.pic,
								productName: item.goodsName,
								productSkuId: item.goodsId,
								quantity: item.ticketGoodsNum,
								price: item.price,
								originalPrice: item.originalPrice,
								sp1: item.spec
							})
						}
						this.productVos = skuList
						this.address = response.data.umsMemberReceiveAddressVo
						app.globalData.globalAddr = this.address
						this.sendDate = response.data.sendDate
						this.shipping = response.data.shipping
						this.totalMoney = response.data.totalMoney
					} else {
						uni.showToast({
							title: response.msg,
							icon: 'none'
						})
					}
				}).catch(res => {

				})
			},
			createOrder() {
				app.uniAjax({
					url: GenerateOrder,
					type: 'POST',
					data: {
						addressId: this.address.id,
						pickTicketDetailId: this.id,
						orderBuyType: "SHOPPINGVOUCHER"
					}
				}).then(res => {
					let response = res.data;
					if (response.code == 200) {

					} else {
						uni.showToast({
							title: response.msg,
							icon: 'none'
						})
					}
				}).catch(res => {

				})
			},
			onAddrClick() {
				app.toLink('/pages/member/address/index?type=order');
			},
			switchConfirmDialogShow() {
				this.confirmDialog = !this.confirmDialog
			},
			commit() {
				this.switchConfirmDialogShow()
			},
			commitOrder() {
				this.createOrder()
			}
		}
	}
</script>

<style lang="scss">
	@import "./index.scss";
</style>
