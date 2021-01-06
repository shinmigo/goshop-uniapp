<template>
	<view class="wrapper">
		<NavBar :title="productName"></NavBar>
		<view class="content">
			<swiper class="detail-head" :circular="true" :indicator-dots="bannerHead.length > 1" :autoplay="true" :interval="2000"
			 :duration="300">
				<swiper-item class="head-item" v-for="(banner,index) in bannerHead" :key="index" @tap="onBannerClick(banner)">
					<BannerImg class="head-image" :bannerUrl="imgHost+banner" :width="'750'" :height="'750'"></BannerImg>
				</swiper-item>
			</swiper>
			<view class="product-infor-box">
				<view class="f52 c_price"><span class="f36 c_price">¥</span>{{productDiscountPrice}}<span class="f32 c_price_del ml12 del">¥{{productPrice}}</span></view>
				<text class="product-name">{{productName}}</text>
				<text class="product-desc">{{productDesc}}</text>
			</view>
			<view style="background-color: #F7F7F7;width: 100%;height: 20rpx;"></view>
			<view class="spec-box" @tap="switchSpecChoose(!specChooseShow)">
				<text class="spec-title">已选</text>
				<text class="spec-selection">{{selectedSku.specValueStr+'×'+quantity}}</text>
				<image class="spec-select-icon" :src="img.arrowIcon"></image>
			</view>
			<view class="flex flexColumn">
				<view v-for="(content,indexOuter) in productIntros" :key="indexOuter">
					<view class="product-intro-text" v-if="content.type=='1'">{{content.text}}</view>
					<!-- <block v-else-if="content.type=='2'" v-for="(url,index) in content.text" :key="index"> -->
					<BannerImg v-else-if="content.type=='2'" :imgId="content.text" width="750" mode="widthFix"></BannerImg>
					<!-- </block> -->
				</view>
			</view>
		</view>
		<!-- 弹窗灰色背景 -->
		<view v-if="specChooseShow" @tap.stop="switchSpecChoose(false)" @touchmove.stop.prevent class="spec-bg"></view>
		<!-- 规格选择弹窗 -->
		<view class="spec-content" :style="specChooseShow?'bottom:136rpx':'bottom:-1000rpx'" @touchmove.stop.prevent>
			<image class="spec-close" :src="img.closeIcon" @tap="switchSpecChoose(false)"></image>
			<view class="spec-sku-infor">
				<BannerImg width="160" height="160" :bannerUrl="imgHost+selectedSku.image"></BannerImg>
				<view class="flex flexColumn flexCenter ml20">
					<view class="f40 c_price"><span class="f28 c_price">¥</span>{{selectedSku.price}}<span v-if="selectedSku.price<selectedSku.oldPrice"
						 class="f26 c_price_del ml10 del">¥{{selectedSku.oldPrice}}</span></view>
					<text class="f26 mt30 c_text_title">已选:{{selectedSku.specValueStr}}</text>
				</view>
			</view>
			<view class="ml40 mr40" v-for="(specification,specIndex) in specifications" :key="specIndex">
				<view class="mt48 f28 c_text_title">{{specification.name}}</view>
				<view class="mt24 flex wd100 flexWrap">
					<view :class="selectedSpec[specification.spec_id].spec_value_id==value.spec_value_id ? 'spec-tag-checked':'spec-tag-normal'"
					 v-for="(value,index) in specification.values" :key="index" @tap="onSpecChoose(specification.spec_id,value)">{{value.content}}</view>
				</view>
			</view>
			<view class="ml40 mr40 mt48 mb24 f28 c_text_title">数量</view>
			<Counter ref="counter" class="ml40 mr40 mb80" :width="'220'" :height="'60'" :count="quantity" @onCountMinus="countMinus"
			 @onCountPlus="countPlus"></Counter>
		</view>
		<!-- 底部bar -->
		<view class="bottom-bar">
			<view @tap="toCart" style="margin-left: 32rpx">
				<BannerImg class="cart-icon" :bannerUrl="img.cartIcon" width="58" height="58"></BannerImg>
				<view v-if="cartQuantity>0" class="badge-dot">{{(cartQuantity>99?'99+':cartQuantity)}}</view>
			</view>
			<view class="flex">
				<view class="btn-addcart" @tap="addCart">加入购物车</view>
				<view class="btn-buy" @tap="buyNow">立即购买</view>
			</view>
		</view>
	</view>
</template>

<script>
	const util = require("@/utils/util.js");
	const app = getApp();
	const closeIcon = require("@/static/common-icon/close-popup.png");
	const cartIcon = require("@/static/footer-bar/cart.png");
	const arrowIcon = require("@/static/common-icon/arrow-right.png");
	import {
		GetProductDetail,
		GetCartCount,

		AddCart,

	} from "@/utils/api";
	import Counter from "../components/counter/index.vue";
	export default {
		components: {
			Counter
		},
		data() {
			return {
				imgHost: app.globalData.configRouter.imgHost,
				img: {
					closeIcon: closeIcon,
					cartIcon: cartIcon,
					arrowIcon: arrowIcon
				},
				id: '',
				bannerHead: [], //头图
				productName: '', //商品名
				productDesc: '', //商品描述
				productDiscountPrice: '', //商品优惠价
				productPrice: '', //商品原价
				productIntros: [], //商品介绍
				skuSpecList: [], //规格对应sku列表
				specifications: [{ //规格
					spec_id: '',
					name: '',
					values: []
				}],
				//规格弹窗显示状态
				specChooseShow: false,
				//选中的sku
				selectedSku: {},
				//选中的规格
				selectedSpec: {},
				cartQuantity: 0,
				quantity: 1,
			}
		},
		onLoad(option) {
			this.id = option.id
			this.cartQuantity = app.globalData.cartQuantity
			this.getProductDetail()
		},
		onShow() {
			!app.isGuest() && this.getCartCount()
		},
		methods: {
			//获取商品详情数据
			getProductDetail() {
				app.uniAjax({
					url: GetProductDetail,
					type: 'GET',
					data: {
						product_id: this.id
					}
				}).then(res => {
					let response = res.data;
					if (response.code == 1) {
						this.setPageProps(response.data[0])
						this.initSelectSpec()
					} else {
						uni.showToast({
							title: response.message,
							icon: 'none'
						})
					}
				}).catch(res => {

				})
			},
			//获取购物车数量
			getCartCount() {
				app.uniAjax({
					url: GetCartCount,
					type: 'GET'
				}).then(res => {
					let response = res.data
					if (response.code == 1) {
						this.cartQuantity = response.data[0]
						app.globalData.cartQuantity = this.cartQuantity
					} else {
						uni.showToast({
							title: response.message,
							icon: 'none',
							duration: 2000
						});
					}
				}).catch(res => {

				})
			},
			//轮播图片点击
			onBannerClick(banner) {
				console.log("头图点击")
			},
			//跳转购物车
			toCart() {
				app.toLink("/pages/cart/index")
			},
			//加入购物车
			addCart() {
				app.uniAjax({
					url: AddCart,
					type: 'POST',
					data: {
						product_id: this.id,
						product_spec_id: this.selectedSku.product_spec_id,
						nums: this.quantity,
						is_select: true,
						is_plus: true
					}
				}).then(res => {
					let response = res.data
					uni.showToast({
						title: response.message,
						icon: 'none',
						duration: 2000
					});
					if (response.code == 1) {
						this.cartQuantity = response.data[0].count
						app.globalData.cartQuantity = this.cartQuantity
					}
				}).catch(res => {

				})
			},
			//立即购买
			buyNow() {
        return uni.showToast({
          title: '敬请期待',
          icon: 'none'
        });
        
				app.toLink("/pages/order/index?type=now&productId=" + this.id + "&productSpecId=" + this.selectedSku.product_spec_id +
					"&quantity=" + this.quantity)
			},
			//规格弹窗切换
			switchSpecChoose(status) {
				this.specChooseShow = status
			},
			//规格选中
			onSpecChoose(specId, value) {
				let select = {
					'spec_value_id': value.spec_value_id,
					'content': value.content
				}
				this.selectedSpec[specId] = select
				this.getSelectSku()
			},
			//初始选中规格
			initSelectSpec() {
				//初始化默认选中第一个
				let selectSp = {}
				for (var i = 0; i < this.specifications.length; i++) {
					let specification = this.specifications[i]
					selectSp[specification.spec_id] = specification.values[0]
				}
				this.selectedSpec = selectSp
				this.getSelectSku()
			},
			//根据选中规格更新选中sku
			getSelectSku() {
				let selectSpecValues = Object.values(this.selectedSpec);
				let specIds = []
				let specValues = []
				for (var i = 0; i < selectSpecValues.length; i++) {
					specIds.push(selectSpecValues[i].spec_value_id * 1)
				}
				//通过规格数组的便利赋值选中值(保证显示选中顺序一致)
				for (var i = 0; i < this.specifications.length; i++) {
					let spec = this.specifications[i]
					specValues.push(this.selectedSpec[spec.spec_id].content)
				}
				let specValueIdStr = specIds.sort(function(a,b){return a-b;}).join()
				let specValueStr = specValues.join()
				for (var i = 0; i < this.skuSpecList.length; i++) {
					let specSku = this.skuSpecList[i]
					if (specValueIdStr == specSku.spec_value_id_str) {
						this.selectedSku = specSku
						this.selectedSku.specValueStr = specValueStr
					}
				}
			},
			//服务器数据赋值处理
			setPageProps(productDetail) {
				this.id = productDetail.product_id
				this.bannerHead = productDetail.images || []
				this.productName = productDetail.name
				this.productDesc = productDetail.short_description
				this.productDiscountPrice = productDetail.price
				this.productPrice = productDetail.price
				this.productIntros = JSON.parse(productDetail.description)
				this.skuSpecList = productDetail.spec
				let specDescs = JSON.parse(productDetail.spec_description)
				if (specDescs) {
					let specs = []
					for (var i = 0; i < specDescs.length; i++) {
						let specDesc = specDescs[i]
						let specValues = Object.values(specDesc.children)
						specs.push({
							spec_id: specDesc.spec_id,
							name: specDesc.name,
							values: specValues
						})
					}
					this.specifications = specs
				}
			},
			countMinus(data) {
				if (data.count > 1) {
					this.quantity = --data.count
				}
			},
			countPlus(data) {
				this.quantity = ++data.count
			}
		}
	}
</script>

<style lang="scss">
	@import "./index.scss"
</style>
