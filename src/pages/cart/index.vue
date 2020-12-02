<template>
	<view class="cart-wrapper">
		<NavBar :title="title"></NavBar>
		<view class="cart-content flex flexColumn pt20">
			<view v-for="(product, index) in cartResult[0].products" :key="index" class="ml20 mr20 mb20">
				<SkuItemCart :product="product" @cartItemCheck="onCartItemCheckClick" @onCartItemCountMinus="onCartItemMinus" @onCartItemCountPlus="onCartItemPlus"></SkuItemCart>
			</view>
		</view>
		<view class="cart-bottom-bar">
			<image
				class="ml40"
				style="width: 36rpx;height: 36rpx;"
				mode="aspectFit"
				:src="'/static/cart/' + (allChecked ? 'ic-checkbox-checked.png' : 'ic-checkbox-normal.png')"
				@tap="checkAll"
			></image>
			<text class="f28 ml16">全选</text>
			<view class="flex flexGrow1 flexColumn mr24">
				<view class="f32 c_price flexAlignSelfEnd">
					<span class="f22 c_text_title">合计(不含运费)</span>
					<span class="f24 c_price">¥</span>
					{{ cartResult[0].amount }}
				</view>
				<view v-if="cartResult.cartPreferentialResponse.totalPreferentialMoney > 0" class="f22 c_text_grey flexAlignSelfEnd mt16">
					已减¥{{ cartResult.cartPreferentialResponse.totalPreferentialMoney }}
				</view>
			</view>
			<text :class="checkNums > 0 ? 'btn-commit bg-image' : 'btn-commit bg_dark_disable'" @tap="toCommitOrder">去结算({{ checkNums }})</text>
		</view>
	</view>
</template>
<script>
const util = require('@/utils/util.js')
const app = getApp()
import { GetCartInfor, CartItemClick, CartItemQuantityUpdate, CartItemCheckAll, CartItemDelete } from '@/utils/api'
import SkuItemCart from './sku-item-cart/index.vue'
export default {
	components: {
		SkuItemCart
	},
	data() {
		return {
			title: '购物车',
			cartResult: {
				cartPreferentialResponse: {
					//总的优惠金额
					totalPreferentialMoney: 0
				},
				omsCartItemList: []
			},
			allChecked: false,
      checkNums: 0,//所有选中商品的数量 
			quantity: 1
		}
	},
	onShow() {
		this.getCartInfors()
	},
	onPullDownRefresh() {
		this.getCartInfors(true)
	},
	methods: {
		//获取购物篮信息
		getCartInfors(stopPullDownRefresh) {
			app.uniAjax({
				url: GetCartInfor,
				type: 'GET'
			})
				.then(res => {
					if (stopPullDownRefresh) {
						uni.stopPullDownRefresh()
					}
					let response = res.data
					if (response.code == 1) {
						this.upCartData(response.data)
					} else {
						uni.showToast({
							title: response.message,
							icon: 'none',
							duration: 2000
						})
					}
				})
				.catch(res => {
					if (stopPullDownRefresh) {
						uni.stopPullDownRefresh()
					}
				})
		},
		//购物篮商品数量更新
		updateCartItemQuantity(product, quantity) {
			app.uniAjax({
				url: CartItemQuantityUpdate,
				type: 'post',
				data: {
					product_id: product.product_id,
					product_spec_id: product.product_spec_id,
					nums: quantity,
					is_select: true,
					is_plus: true
				}
			})
				.then(res => {
					let response = res.data
					if (response.code == 1) {
						this.upCartData(response.data)
					} else {
						uni.showToast({
							title: response.message,
							icon: 'none',
							duration: 2000
						})
					}
				})
				.catch(res => {})
		},
		checkAll() {
			let { products } = this.cartResult[0]
			let cartChecked = []
			let isSelect = this.allChecked ? 0 : 1
			for (let val of products) {
				cartChecked.push({
					cart_id: val.cart_id,
					is_select: isSelect
				})
			}
			this.upSkuCheck(cartChecked)
		},
		//调选中api
		upSkuCheck(cartChecked) {
			app.uniAjax({
				url: CartItemCheckAll,
				type: 'POST',
				data: {
					cart_checked: JSON.stringify(cartChecked)
				}
			})
				.then(res => {
					let response = res.data
					if (response.code == 1) {
						this.upCartData(response.data)
					} else {
						uni.showToast({
							title: response.message,
							icon: 'none',
							duration: 2000
						})
					}
				})
				.catch(res => {})
		},
		//更新购物车数据
		upCartData(data) {
			this.cartResult = data
			this.upCheckStatus()
		},
		//获取数据后更新全选按钮状态
		upCheckStatus: function() {
			let allChecked = false
			let checkNums = 0 //选择的商品总数
      let checkeItems = 0//选择的商品个数
			for (var product of this.cartResult[0].products) {
				if (product.checked) {
					checkNums += product.num
          checkeItems++
				}
			}
			if (checkeItems == this.cartResult[0].products.length && this.cartResult[0].products.length > 0) {
				allChecked = true
			}
      this.checkNums = checkNums
			this.allChecked = allChecked
			return allChecked
		},
		//单选
		onCartItemCheckClick(data) {
			let { products } = this.cartResult[0]
			let cartChecked = []
			let isSelect = data.checked ? 0 : 1
			for (let val of products) {
				cartChecked.push({
					cart_id: val.cart_id,
					is_select: data.cart_id == val.cart_id ? isSelect : val.checked ? 1 : 0
				})
			}
			this.upSkuCheck(cartChecked)
		},
		//删除购物车数量更新
		delSku(data){
			app.uniAjax({
				url: CartItemDelete,
				type: 'post',
				data: {
					is_all: 0,
					cart_ids: JSON.stringify([data.cart_id])
				}
			})
				.then(res => {
					let response = res.data
					if (response.code == 1) {
						this.upCartData(response.data)
					} else {
						uni.showToast({
							title: response.message,
							icon: 'none',
							duration: 2000
						})
					}
				})
				.catch(res => {})
		},
		onCartItemPlus(data) {
			this.updateCartItemQuantity(data, 1)
		},
		onCartItemMinus(data) {
			if (data.num == 1) {
				this.delSku(data)
			} else {
				this.updateCartItemQuantity(data, -1)
			}
		},
		//去下单
		toCommitOrder() {
			if (this.checkNums > 0) {
        let orderSku = [];
        for (var product of this.cartResult[0].products) {
        	if (product.checked) {
        		orderSku.push({
              'cart_id': product.cart_id,
              'product_id': product.product_id,
              'product_spec_id': product.product_spec_id,
              'num': product.num
            })
        	}
        }
				app.toLink('/pages/order/index?products=' + JSON.stringify(orderSku))
			}
		}
	}
}
</script>

<style lang="scss">
@import './index.scss';
</style>
