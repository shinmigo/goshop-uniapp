import util from '@/utils/util';

//前端展示用到的订单各种状态类型整理
const OrderInfoStatus = {
	SENDING: 1, //订单待发货
	RECEVING: 2, //订单待收货
	PAYING: 3, //订单待付款
	REFUNDING: 4, //订单退款中
	CLOSED: 5, //订单关闭
	REFUNDED: 6, //订单退款完成
	FINISHED: 7, //订单完成状态
	DELETE: 8,//订单已删除状态
	UNKNOWN: -1, //未知的状态
}

//前端用到的订单类型整理
const OrderInfoType = {
	NORMAL: 1, //普通订单类型
	CARD: 2, //电子卡订单类型
	VOUCHER: 3, //提货券订单类型
}

//前端UI展示的物流的各种状态整理
const OrderLogisticStatus = {
	CURRENT: 1, //当前物流处于的节点
	FIRSTITEM: 2, //当前第一个的状态，底部没有线条展示
	MARK: 3, //物流的标志性节点（添加图标进行标记）
	NORMAL: 4, //物流的普通节点(不带标题、图标标记的节点)
}

// 外部使用的各种状态
const getOrderStatus = (state) => {
	let orderSta = OrderInfoStatus.UNKNOWN;
	switch (state) {
		case 4:
			orderSta = OrderInfoStatus.RECEVING; //待收货
			break;
		case 3:
			orderSta = OrderInfoStatus.SENDING; //待发货
			break;
		case 1:
			orderSta = OrderInfoStatus.PAYING; //待付款
			break;
		case 5:
		case 6:
			orderSta = OrderInfoStatus.FINISHED; //订单完成
			break;
		// case 6:
		// case 13:
		// 	orderSta = OrderInfoStatus.REFUNDING; //退款中
		// 	break;
		case 7:
			orderSta = OrderInfoStatus.CLOSED; //订单关闭
			break;
		// case 14:
		// 	orderSta = OrderInfoStatus.REFUNDED; //退款完成
		// 	break;
		// case 17:
		//   orderSta = OrderInfoStatus.DELETE;//订单已删除状态
		// 	break;
	}
	return orderSta;
}

const getMyOrderType = (state) => {
	let type = OrderInfoType.NORMAL;
	if (state == 1) {
		type = OrderInfoType.NORMAL;
	} else if (state == 2) {
		type = OrderInfoType.VOUCHER;
	} else if (state == 3) {
		type = OrderInfoType.CARD;
	}
	return type;
}

const getOrderDetailInfoData = (resData) => {

	let orderType = getMyOrderType(0); //获取订单状态
	let orderObj = {
		orderStatus: {},
		orderSkus: [],
		orderLogisticInfo: {},
		orderAddressInfo: {},
		orderSumInfo: {},
		orderDetailInfo: {}
	};
	if (orderType == OrderInfoType.NORMAL) { //商品订单数据
		//订单状态数据
		let orderStatusInfoObj = getOrderDetailInfoStatus(resData.data[0].order_status, OrderInfoType.NORMAL, resData
			.data[0].payment_time,
			resData.data[0].confirm_time);
		Object.assign(orderObj.orderStatus, orderStatusInfoObj);
		// //物流信息数据 （暂时不处理）
		Object.assign(orderObj.orderLogisticInfo, getOrderDetailLogisticInfo(resData.data.deliverySn,
			resData.data
			.deliveryCompany));
		// 地址数据
		Object.assign(orderObj.orderAddressInfo, getOrderDetailAddressInfo(resData.data[0].order_address));
		//商品数据
		Object.assign(orderObj.orderSkus, getOrderDetailProductList(resData.data[0].order_items));
		//订单有关的金额优惠
		Object.assign(orderObj.orderSumInfo, getOrderDetailSumMoneyObj(resData.data[0].subtotal, resData.data[0]
			.shipping_amount,
			resData.data[0].discount_amount, resData.data.integrationAmount, resData.data[0].grand_total));
		// 订单描述
		Object.assign(orderObj.orderDetailInfo, getOrderDetailDescription(resData.data[0].status, {
			orderSn: resData.data[0].order_id,
			paymentTime: resData.data[0].paymentTime,
			createTime: resData.data[0].createTime,
			payType: resData.data[0].payment_status,//payType
			otherPayAmount: resData.data.otherPayAmount,
			balanceAmount: resData.data.balanceAmount,
		}));
	} else if (orderType == OrderInfoType.CARD) { //充值卡订单数据
		//订单状态数据
		let orderStatusInfoObj = getOrderDetailInfoStatus(resData.data.status, OrderInfoType.NORMAL, resData
			.data.unPaymentTimeout,
			resData.data.confirmTimeout);
		Object.assign(orderObj.orderStatus, orderStatusInfoObj);
		//商品数据
		Object.assign(orderObj.orderSkus, getOrderDetailProductList(resData.data.orderDetailItemList));
		//订单有关的金额优惠
		Object.assign(orderObj.orderSumInfo, getOrderDetailSumMoneyObj(resData.data.totalAmount, resData.data
			.freightAmount,
			resData.data.couponAmount, resData.data.integrationAmount, resData.data.payAmount));
		// 订单描述
		Object.assign(orderObj.orderDetailInfo, getOrderDetailDescription(resData.data.status, {
			orderSn: resData.data.orderSn,
			paymentTime: resData.data.paymentTime,
			createTime: resData.data.createTime,
			payType: resData.data.payType,
			otherPayAmount: resData.data.otherPayAmount,
			balanceAmount: resData.data.balanceAmount,
		}));
		//添加充值卡id & 充值卡兑换码数据（等接口定义）
		Object.assign(orderObj.orderDetailInfo,getPrepaidCardInfo(resData));
	}
	return orderObj
}

//获取卡片信息
const getPrepaidCardInfo =(res) =>{
	let prepaidCardID = 'CZKID20200903021',prepaidExchangeCode = 'JSIWP2028003';
	return {
		prepaidCardID,
		prepaidExchangeCode
	}
}

//获取订单物流所处的显示状态
const getOrderLogisticState = (state, currentState) => {
	let logisticStatus = OrderLogisticStatus.NORMAL,
		icon = '';
	switch (state) {
		case 1: //已下单
			{
				if (state == currentState) { //下单状态的icon
					icon = '../../../static/logo.png';
					logisticStatus = OrderLogisticStatus.CURRENT;
				} else { //不是高亮的下单状态的icon
					icon = '../../../static/logo.png';
					logisticStatus = OrderLogisticStatus.MARK;
				}
				break;
			}
		case 2: //已发货
			{
				if (state == currentState) { //已发货状态的icon
					icon = '../../../static/logo.png';
					logisticStatus = OrderLogisticStatus.CURRENT;
				} else { //不是高亮的已发货状态的icon
					icon = '../../../static/logo.png';
					logisticStatus = OrderLogisticStatus.MARK;
				}
				break;
			}
		case 3: //运输中
			{
				if (state == currentState) { //运输中状态的icon
					icon = '../../../static/logo.png';
					logisticStatus = OrderLogisticStatus.CURRENT;
				} else { //不是高亮的运输中状态的icon
					icon = '../../../static/logo.png';
					logisticStatus = OrderLogisticStatus.MARK;
				}
				break;
			}
		case 4: //已签收
			{
				if (state == currentState) { //已签收状态的icon
					icon = '../../../static/logo.png';
					logisticStatus = OrderLogisticStatus.CURRENT;
				} else { //不是高亮的已签收状态的icon
					icon = '../../../static/logo.png';
					logisticStatus = OrderLogisticStatus.MARK;
				}
				break;
			}
	}
	return {
		logisticStatus,
		icon
	};
}

//订单列表状态文字及其颜色
const orderStateExp = (state, isOrderList) => {
	let stateTip = '',
		stateTipColor = '#51bd09';
	let orderStatus = getOrderStatus(state); //getOrderStatus(state);
	switch (orderStatus) {
		case OrderInfoStatus.PAYING:
			stateTip = '待付款';
			break;
		case OrderInfoStatus.SENDING:
			stateTip = '待发货';
			break;
		case OrderInfoStatus.RECEVING:
			stateTip = '待收货';
			break; //（已发货、待收货）
		case OrderInfoStatus.FINISHED:
			stateTip = '订单完成';
			break;
		case OrderInfoStatus.REFUNDED:
			stateTip = isOrderList ? '订单关闭' : '退款成功';
			stateTipColor = isOrderList ? '#cccccc' : '#51bd09';
			break; //订单列表中退款完成显示’已完成‘，退款列表中显示‘退款成功’ -郝坤江、王琳、柴林、陈冠峰
		case OrderInfoStatus.REFUNDING:
			// 将维权中、维权已完成、申请退款定义为退款中 - 郝坤江、王琳、柴林、陈冠峰
			stateTip = '退款中';
			stateTipColor = '#fb4e4e';
			break;
		case OrderInfoStatus.CLOSED:
			//无效订单、已关闭暂定为‘订单关闭’，但是陈冠峰说暂时不会出现
			stateTip = '订单关闭';
			stateTipColor = '#cccccc'
			break;
	}
	return {
		stateTip,
		stateTipColor
	};
}

//订单详情中的订单状态展示
const getOrderDetailInfoStatus = (state, orderType, unPaymentTimeout, confirmTimeout) => {
	let icon = '',
		title = '',
		subTitle = '',
		timeTxt = '',
		status = OrderInfoStatus.UNKNOWN;
	// orderFormateDateStr
	let orderStatus = getOrderStatus(state);
	// orderStatus = OrderInfoStatus.CLOSED;//测试各种状态的
	status = orderStatus;
	if (orderStatus == OrderInfoStatus.PAYING) {
		//待付款
		timeTxt = getDuration(unPaymentTimeout);
		icon = '../../../static/myinfo/order-detail-paying.png';
		title = '待付款';
		if (unPaymentTimeout || unPaymentTimeout > 0) {
			subTitle = '还剩' + timeTxt + '，订单将自动关闭'; //倒计时
		} else {
			subTitle = '订单将自动关闭';
		}
	} else if (orderStatus == OrderInfoStatus.SENDING) {
		//待发货
		icon = '../../../static/myinfo/order-detail-sending.png';
		title = '待发货';
		subTitle = '这里是本地写死的文案'; //

	} else if (orderStatus == OrderInfoStatus.RECEVING) {
		//待收货
		timeTxt = getDuration(confirmTimeout);
		icon = '../../../static/myinfo/order-detail-receving.png';
		title = '待确认收货';
		if (confirmTimeout || confirmTimeout > 0) {
			subTitle = timeTxt + '后将自动确认';
		} else {
			subTitle = '将自动确认收货';
		}
	} else if (orderStatus == OrderInfoStatus.FINISHED) {
		//订单完成
		icon = getFinishedOrderStatusTxt(orderStatus).icon;
		title = getFinishedOrderStatusTxt(orderStatus).title;
		subTitle = getFinishedOrderStatusTxt(orderStatus).subTitle;

	} else if (orderStatus == OrderInfoStatus.CLOSED ||
		orderStatus == OrderInfoStatus.REFUNDED) {
		//订单关闭
		icon = getCancelOrderStatusTxt(orderStatus).icon;
		title = getCancelOrderStatusTxt(orderStatus).title;
		subTitle = getCancelOrderStatusTxt(orderStatus).subTitle;
	}
	return {
		icon,
		title,
		subTitle,
		status
	}
}

const getFinishedOrderStatusTxt = (state) => {
	let [icon, title, subTitle, status] = ['../../../static/myinfo/order-detail-finished.png', '订单完成', '感谢您的购买', state];
	return {
		icon,
		title,
		subTitle,
		status
	}
}

const getCancelOrderStatusTxt = (state) => {
	//订单关闭
	let icon = '../../../static/myinfo/order-detail-closed.png';
	let title = '订单关闭';
	let subTitle = '';
	let status = state;
	return {
		icon,
		title,
		subTitle,
		status
	}
}

//订单详情中物流信息
const getOrderDetailLogisticInfo = (logsticNum, logisticCom) => {
	let titleNum = '',
		subContent = '';
	if (logsticNum && logisticCom) {
		titleNum = logsticNum;
		subContent = logisticCom;
		return {
			titleNum,
			subContent
		};
	}
	return {
		titleNum,
		subContent
	};
}

//订单详情中地址信息展示
const getOrderDetailAddressInfo = (address) => {
	//从address里去处地址数据（为了后续处理没有地址的逻辑展现）
	let title = '',
		subTitle = '',
		icon = '';
	if (!address) {
		return {
			title,
			subTitle,
			icon
		}
	}
	title = address.receiver + '  ' + address.telephone; //'郝先生 13476232232',
	subTitle = address.province + address.city + address.region + address.street; //上海市长宁区中山国际广场B楼2楼（天山西路789号中山国际广场B楼）
	icon = '/static/myinfo/ic_location_orderdetail.png';
	return {
		title,
		subTitle,
		icon
	}
}

//订单详情中的商品数据 （理论上表示商品的属性，前端是要用一样的字段）
const getOrderDetailProductList = (productList) => {
	let orderSkus = productList;
	orderSkus.forEach(item => {
		item.product_name = item.name;
		item.spec_name = item.sku;
		item.num = item.qty_ordered;
	});
	// if (productList.length != 0) {
	// 	productList.forEach(item => {
	// 		item.productSkuId = item.id;
	// 		item.quantity = item.productQuantity > 0 ? item.productQuantity : 1;
	// 		item.price = item.productPrice > 0 ? item.productPrice : 0;
	// 		item.originalPrice = item.productPrice > 0 ? item.productPrice : 0;
	// 		item.productPic = util.thumbUrl(item.productPic);
	// 		orderSkus.push(item);
	// 	});
	// }
	// goodObj.productPic = util.thumbUrl(goodObj.productPic);
	return orderSkus
}

//订单中的金额数据
const getOrderDetailSumMoneyObj = (totalMon, foreightMon, couponMon, pointMon, paidMon) => {
	let totalMoney = '¥0',
		orderFreight = '¥0',
		coupon = '',
		point = '',
		paid = '',
		temUnit = '¥';
	if (totalMon) {
		totalMoney = temUnit + totalMon;
	}
	if (foreightMon) {
		orderFreight = temUnit + foreightMon;
	}
	if (couponMon) {
		coupon = '-' + temUnit + couponMon;
	}
	if (pointMon) {
		point = '-' + temUnit + pointMon;
	}
	if (paidMon) {
		paid = temUnit + paidMon;
	}
	return {
		totalMoney,
		orderFreight,
		coupon,
		point,
		paid
	}
}

//订单详情中订单的描述信息
const getOrderDetailDescription = (status, resParams) => {
	let orderNumber = resParams.orderSn,
		createTimeTitle = '付款时间',
		createTime = resParams.paymentTime,
		paymentMethod = '';
	let orderStatus = getOrderStatus(status);
	if (orderStatus == OrderInfoStatus.PAYING) { //待付款
		createTimeTitle = '下单时间';
		createTime = resParams.createTime;
	}
	//支付方式处理
	paymentMethod = getPayStatusTxt(resParams.payType, resParams.otherPayAmount, resParams.balanceAmount);
	return {
		orderNumber,
		createTimeTitle,
		createTime,
		paymentMethod
	}
}

const getPayStatusTxt = (payType, otherPayAmount, balanceAmount) => {
	let payStatusTxt = '未付款';
	if (payType == 2) {
		payStatusTxt = '已付款';
	}else if (payType == 3) {
		payStatusTxt = '部分付款';
	}
		// moneyUnit = '¥';
	// if (payType == 1 || payType == 2 || payType == 3) { //支付宝支付 微信支付 余额支付
	// 	if (payType == 1) {
	// 		payStatusTxt = '支付宝支付';
	// 	} else if (payType == 2) {
	// 		payStatusTxt = '微信支付';
	// 	} else if (payType == 3) {
	// 		payStatusTxt = '余额支付';
	// 	}
	// 	if (otherPayAmount) {
	// 		payStatusTxt = payStatusTxt + moneyUnit + otherPayAmount;
	// 	}
	// } else if (payType == 31 || payType == 32) { //余额支付宝 微信支付
	// 	payStatusTxt = '组合支付(';
	// 	if (balanceAmount) {
	// 		payStatusTxt = '余额支付' + moneyUnit + balanceAmount + '+'
	// 	}
	// 	if (payType == 31) {
	// 		payStatusTxt = payStatusTxt + '支付宝支付';
	// 	} else if (payType == 32) {
	// 		payStatusTxt = payStatusTxt + '微信支付';
	// 	}
	// 	if (otherPayAmount) {
	// 		payStatusTxt = payStatusTxt + moneyUnit + otherPayAmount + ')';
	// 	}
	// }
	return payStatusTxt;
}

//分钟转换成天、时、分显示
const getDuration = (minute) => {
	var duration = '';
	var days = Math.floor(minute / 1440);
	var hours = Math.floor((minute % 1440) / 60);
	var minutes = Math.floor((minute % 1440) % 60);
	if (days > 0) duration = days + '天';
	if (hours > 0) duration = duration + hours + '小时';
	if (minutes > 0) duration = duration + minutes + '分钟';
	return duration;
}

//时间戳转换成时间
const orderFormateDateStr = (createTime, fmt) => {
	if (createTime == null || createTime === '') {
		return 'N/A';
	}
	return createTime.date(fmt);
}

const orderStatusParams = (state) => { //请求对应订单数据
	let order_status = 0; //全部订单
	if (state == 1) {
		order_status = 1; //待付款
	} else if (state == 2) {
		order_status = 3; //待发货
	} else if (state == 3) { //待收货
		order_status = 4;
	}
	return {
		order_status
	};
}

const refundOrderParams = (state) => { //退款/售后订单类型接口传参形式
	let status = [6, 7, 13, 14];
	return {
		status
	};
}

//获取订单物流信息页面数据
const getOrderLogisticList = (logisticList) => {
	let listData = [];
	if (logisticList.length != 0) {
		let currentItem = logisticList[0]; //默认第一个数据是最新的物流信息，即当前物流状态
		for (let index in logisticList) {
			let item = logisticList[index];
			let logisticType = OrderLogisticStatus.MARK;
			let icon = '';
			if (item.status) {
				if (index == (logisticList.length - 1)) {
					logisticType = OrderLogisticStatus.FIRSTITEM; //底部没有线条分割
				} else {
					logisticType = getOrderLogisticState(item.status, currentItem.status).logisticStatus; //底部有线条分割
				}
				icon = getOrderLogisticState(item.status, currentItem.status).icon; //图标标记
			} else {
				if (index == (logisticList.length - 1)) {
					logisticType = OrderLogisticStatus.FIRSTITEM;
				} else {
					logisticType = OrderLogisticStatus.NORMAL; //圆点标记
				}
			}
			Object.assign(item, {
				logisticType,
				icon
			});
			console.log("logistic.icon =====", item.icon);
			listData.push(item);
		}
	}
	return listData;
}

module.exports = {
	orderStateExp: orderStateExp, //订单状态文字及其颜色
	orderFormateDateStr: orderFormateDateStr, //订单时间格式化
	orderStatusParams: orderStatusParams, //请求订单列表状态下的数据
	refundOrderParams: refundOrderParams, //售后退款订单类型的参数
	getOrderStatus: getOrderStatus, //获取前端订单各个状态下的类型
	getOrderDetailInfoStatus: getOrderDetailInfoStatus, //订单详情下面的各种状态显示
	getOrderDetailLogisticInfo: getOrderDetailLogisticInfo, //订单详情中物流信息展示
	getOrderDetailAddressInfo: getOrderDetailAddressInfo, //订单详情中地址信息展示
	getOrderDetailProductList: getOrderDetailProductList, //订单详情中商品信息展示
	getOrderDetailSumMoneyObj: getOrderDetailSumMoneyObj, //订单详情中金额
	getOrderDetailDescription: getOrderDetailDescription, //订单描述信息
	getCancelOrderStatusTxt: getCancelOrderStatusTxt, //取消订单的状态数据
	getFinishedOrderStatusTxt: getFinishedOrderStatusTxt, //订单完成状态更新
	OrderInfoStatus: OrderInfoStatus, //订单的各种状态
	OrderInfoType: OrderInfoType, //订单的类型
	OrderLogisticStatus: OrderLogisticStatus, //订单物流的各种UI显示状态
	getOrderLogisticState: getOrderLogisticState, //订单的物流显示状态的逻辑
	getOrderLogisticList: getOrderLogisticList, //订单物流详情展示
	getMyOrderType: getMyOrderType, //获取订单状态
	getPrepaidCardInfo:getPrepaidCardInfo,//获取卡片信息
	getOrderDetailInfoData: getOrderDetailInfoData, //获取订单详情整理过后的数据
};
