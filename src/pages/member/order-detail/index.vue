<template>
	<view class="content">
		<NavBar backType="1" title="订单详情" shadow="1"></NavBar>
		<!--订单状态 -->
		<view v-if="orderStatus.status != OrderInfoStatus.UNKNOWN && orderStatus.status != OrderInfoStatus.DELETE" class="cover-container">
			<view class="funtion-header flex flexAlignC">
				<BannerImg class="ml24" width="68" height="68" :bannerUrl="orderStatus.icon"></BannerImg>
				<view class="ml24 mr26 mt32 mb32">
					<view :class="orderStatus.subTitle? 'f32 c_text_title texL fb':'f32 c_text_title fb texC'">{{ orderStatus.title }}</view>
					<view v-if="orderStatus.subTitle" class="mt10 f26 c_text_red">{{ orderStatus.subTitle }}</view>
				</view>
			</view>
		</view>
		<!-- 物流 及其地址信息 -->
		<view class="cover-container" v-if="orderLogisticInfo.titleNum || orderAddressInfo.title">
			<view class="funtion-header">
				<!--物流 -->
				<view class="flex posiR" v-if="orderLogisticInfo.titleNum" @click="toLogisticAction">
					<!--物流图标-->
					<BannerImg class="mt26 ml24" width="40" height="40" :bannerUrl="orderLogisticInfo.icon"></BannerImg>
					<view class="flex flexWrap ml20 mr24">
						<!--物流单号及其数字-->
						<view class="flex mt28">
							<view class="c_text_title f28">{{ orderLogisticInfo.title }}</view>
							<view class="c_text f28 ml24 flexGrow1 deliveryInfo">{{ orderLogisticInfo.titleNum }}</view>
						</view>
						<!--物流公司及其名称-->
						<view class="flex mb30 mt18">
							<view class="textContent f28">{{ orderLogisticInfo.subTitle }}</view>
							<view class="c_text f28 flexGrow1 ml24 deliveryInfo">{{ orderLogisticInfo.subContent }}</view>
						</view>
					</view>
					<view class="flex flexAlignC">
						<BannerImg class="mr24" width="32" height="32" :bannerUrl="img.arrowRightIcon"></BannerImg>
					</view>
				</view>
			</view>
			<!-- 分割线 -->
			<view class="order-seperate-line" v-if="orderLogisticInfo.titleNum"></view>
			<!--地址-->
			<view :class="orderLogisticInfo.titleNum? 'flex flexAlignSelfStart' : 'function-header flex flexAlignSelfStart'">
				<BannerImg class="ml24" :class="orderLogisticInfo.titleNum ? 'mt28' : 'mt32'" width="40" height="40" :bannerUrl="orderAddressInfo.icon"></BannerImg>
				<view class="textContent ml24 mr26 mb32" :class="orderLogisticInfo.titleNum ? 'mt28' : 'mt32'">
					<view class="title f28 c_text_title">{{ orderAddressInfo.title }}</view>
					<view class="mt18 text mt12 f26 c_text">{{ orderAddressInfo.subTitle }}</view>
				</view>
			</view>
		</view>
		<!-- 商品列表 商品金额、运费、优惠券、积分抵扣、实付-->
		<view class="cover-container product">
			<view class="list funtion-header">
				<view :class="index == orderSkus.length - 1 ? 'mb18' : 'mb56'" v-for="(item, index) in orderSkus" :key="item.id">
					<OrderSku :skuData="item" />
				</view>
			</view>
			<!--分割线-->
			<view class="order-seperate-line"></view>
			<!--商品金额-->
			<view class="mt32 ml24 mr24 mb24">
				<!--商品金额-->
				<view class="flex flexAlignC mb24">
					<view class="order-money-title flexGrow1">商品金额</view>
					<view class="order-money-content">{{ orderSumInfo.totalMoney }}</view>
				</view>
				<!--运费-->
				<view class="flex flexAlignC mb24">
					<view class="order-money-title flexGrow1">运费</view>
					<view class="order-money-content">{{ orderSumInfo.orderFreight }}</view>
				</view>
				<!--优惠券-->
				<view v-if="orderSumInfo.coupon" class="flex flexAlignC mb24">
					<view class="order-money-title flexGrow1">优惠券</view>
					<view class="order-money-content">{{ orderSumInfo.coupon }}</view>
				</view>
				<!--积分抵扣-->
				<view v-if="orderSumInfo.point" class=" flex flexAlignC mb24">
					<view class="order-money-title flexGrow1">积分抵扣</view>
					<view class="order-money-content">{{ orderSumInfo.point }}</view>
				</view>
				<!--实付-->
				<view class="flex flexAlignSelfEnd mb24 flexRowReverse">
					<view class="order-pay-money mb24 ">{{ orderSumInfo.paid }}</view>
					<view class="order-money-title mb24 ">实付：</view>
				</view>
			</view>
		</view>
		<view class="cover-container">
			<view class="funtion-header">
				<!--充值卡id-->
				<view v-if="orderDetailInfo.prepaidCardID" class="flex flexStart ml24 mb30">
					<view class="order-detail-title mt32">充值卡ID</view>
					<view class="order-detail-content mt32 ml28 orderDetailWidth">{{ orderDetailInfo.prepaidCardID }}</view>
				</view>
				<!--充值卡兑换码-->
				<view v-if="orderDetailInfo.prepaidExchangeCode" class="flex flexStart ml24 mb28">
					<view class="order-detail-title">充值卡兑换码</view>
					<view class="order-detail-content ml28 orderDetailWidth">{{ orderDetailInfo.prepaidExchangeCode }}</view>
				</view>
				<!--订单编号-->
				<view class="flex flexStart ml24" :class="isOrderSNTop ?'mb30' : 'mb28'">
					<view class="order-detail-title" :class="isOrderSNTop?'mt32':''">订单编号</view>
					<view class="order-detail-content ml28 orderDetailWidth" :class="isOrderSNTop?'mt32':''">{{ orderDetailInfo.orderNumber }}</view>
				</view>
				<!--付款时间-->
				<view v-if="orderDetailInfo.createTime" class="flex flexStart ml24 mb28">
					<view class="order-detail-title">{{orderDetailInfo.createTimeTitle}}</view>
					<view class="order-detail-content ml28 orderDetailWidth">{{ orderDetailInfo.createTime }}</view>
				</view>
				<!--付款方式-->
				<view class="flex flexStart ml24">
					<view class="order-detail-title mb28">付款方式</view>
					<view class="order-detail-content ml28 mb28 orderDetailWidth">{{ orderDetailInfo.paymentMethod }}</view>
				</view>
			</view>
		</view>
		<view class="flex flexJustifyC order-detail-des mt32 mb32">如遇问题或申请订单退款，请联系客服</view>
		<view class="submitH"></view>
		<view class="submit flex flexAlignC flexRowReverse">
			<view v-if="orderStatus.status == OrderInfoStatus.RECEVING" class="btn mr32 c_text_inverse f28" @click="confirmReceClick">确认收货</view>
			<view v-if="orderStatus.status == OrderInfoStatus.PAYING" class="btn mr32 c_text_inverse f28" @click="payOrderAction">继续支付</view>
			<view v-if="orderStatus.status == OrderInfoStatus.PAYING" class="connect-server-btn mr24 f28" @click="cancelOrderClick">取消订单</view>
			<view v-if="orderStatus.status === OrderInfoStatus.RECEVING || (orderStatus.status != OrderInfoStatus.PAYING)" class="connect-server-btn mr24 f28"
			 @click="connectServerAction">联系客服</view>
		</view>
	</view>
</template>
<script>
	import {
		GetOrderDetailInfo,
		CancelDeliveryOrder,
		ConfirmDeliveryOrder
	} from '@/utils/api';
	import OrderSku from '@/pages/components/order-sku/index';

	const arrowRightIcon = require('@/static/common-icon/arrow-right.png');
	const util = require("@/utils/util.js");
	const orderUtil = require("@/utils/orderUtil.js");
	const app = getApp();
	const {
		OrderInfoStatus,
		OrderInfoType
	} = orderUtil;
	export default {
		components: {
			OrderSku
		},
		data() {
			return {
				order_id: '',
				img: {
					arrowRightIcon: arrowRightIcon
				},
				orderStatus: {
					title: '',
					subTitle: '',
					icon: '',
					status: OrderInfoStatus.UNKNOWN
				},
				OrderInfoStatus: OrderInfoStatus,
				OrderInfoType: OrderInfoType,
				orderLogisticInfo: {
					title: '物流单号',
					titleNum: '',
					subTitle: '物流公司',
					subContent: '',
					icon: '/static/myinfo/ic_delivery_orderdetail.png'
				},
				orderAddressInfo: {
					title: '',
					subTitle: '',
					icon: ''
				},
				orderSkus: [{
					"sp1": "",
					"sp2": "",
					"sp3": "",
					"originalPrice": 0,
					"price": 0,
					"productName": "",
					"productPic": "",
					"productSkuId": "",
					productQuantity: 0,
					"quantity": 0,
					realAmount: 0,
				}],
				orderSumInfo: {
					totalMoney: '¥0',
					orderFreight: '¥0',
					coupon: '',
					point: '',
					paid: '¥0'
				},
				orderDetailInfo: {
					orderNumber: '',
					createTimeTitle: '',
					createTime: '',
					paymentMethod: '',
					prepaidCardID:'',//充值卡id
					prepaidExchangeCode:'',//充值卡兑换码
				},
				isOrderSNTop: false,
			};
		},
		onLoad(source) {
			this.order_id = source.order_id;
			this.loadDataSource(source.order_id);
		},
		methods: {
			/*订单详情数据*/
			loadDataSource(orderId) {
				let params = {
					url: GetOrderDetailInfo,
					data: {
						order_id: this.order_id
					},
					type: 'GET',
					loading: {
						msg: '加载中',
						mask: true
					}
				};
				app.uniAjax(params).then(res => {
					let access_token = uni.getStorageSync('access_token') || '';
					console.log("api订单数据== ",access_token, params, res);
					if (res.data.code == 1) {
						let resData = res.data;
						let orderObj = orderUtil.getOrderDetailInfoData(resData);
						console.log("转换后的订单数据== ",orderObj);
						//订单状态
						Object.assign(this.orderStatus,orderObj.orderStatus);
						//物流信息数据
						Object.assign(this.orderLogisticInfo, orderObj.orderLogisticInfo);
						//地址数据
						Object.assign(this.orderAddressInfo, orderObj.orderAddressInfo);
						// //商品数据
						this.orderSkus = orderObj.orderSkus;
						//订单有关的金额优惠(totalMon, foreightMon, couponMon, pointMon, paidMon) => 
						Object.assign(this.orderSumInfo, orderObj.orderSumInfo);
						//订单描述/*orderSn,paymentTime,createTime,payType,otherPayAmount,balanceAmount*/
						Object.assign(this.orderDetailInfo, orderObj.orderDetailInfo);
						//暂时使用字段判断订单编号是否是顶部第一个
						this.isOrderSNTop = this.orderDetailInfo.prepaidCardID.length > 0?false:true;
					}
				});
			},
			/*查看物流信息*/
			toLogisticAction() {
				console.log("查看物流信息");
				app.toLink('/pages/member/logistic/index');
			},
			/*确认收货*/
			confirmReceClick() {
				console.log("确认收货");
				let params = {
					url: ConfirmDeliveryOrder + '/' + this.order_id,
					type: 'GET',
					loading: {
						msg: '订单确认收货...',
						mask: true
					}
				};
				app.uniAjax(params).then(res => {
					if (res.data.code == 200) {
						console.log("订单确认收货数据返回 ==== ", params, res);
						//改变为完成状态
						Object.assign(this.orderStatus, orderUtil.getFinishedOrderStatusTxt(OrderInfoStatus.FINISHED));
					}
				});
			},
			/*联系客服*/
			connectServerAction() {
				uni.showToast({
					title: "联系客服 事件"
				});
			},
			/*取消订单*/
			cancelOrderClick() {
				console.log("取消订单=== ", CancelDeliveryOrder);
				let params = {
					url: CancelDeliveryOrder + '/' + this.order_id,
					type: 'GET',
					loading: {
						msg: '取消订单...',
						mask: true
					}
				};
				app.uniAjax(params).then(res => {
					if (res.data.code == 200) {
						console.log("取消订单数据返回 ==== ", params, res);
						//改变为关闭状态
						Object.assign(this.orderStatus, orderUtil.getCancelOrderStatusTxt(OrderInfoStatus.CLOSED));
					}
				});
			},
			/*待付款事件*/
			payOrderAction() {
        util.getPay({
          orderId: this.order_id,
          paymentSuccess: res => {
            this.loadDataSource(this.order_id);
          },
          paymentError: res => {
          }
        })
			}
		}
	};
</script>

<style lang="scss">
	@import './index.scss';
</style>
