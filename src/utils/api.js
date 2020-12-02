/* 
 *接口名称 -- 请求方式 -- 接口文档地址
 * 接口定义 示例：export const FindCouponListBySku = '/java/portal/api/v2/sms/findCouponListBySku';
 **/
//查询选中商品的可用优惠券--GET--http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2%E6%96%B0%E7%89%88%E6%9C%AC/%E8%90%A5%E9%94%80%E7%AE%A1%E7%90%86/findCouponListBySkuUsingGET
export const ProductTag = 'product/tag';
// 短信验证码登录--POST--http://10.32.5.88:8199/static/wiki/_book/data/common.html#mobile-login
export const LoginByCode = 'common/mobile-login'
// 获取短信验证码--POST--http://10.32.5.88:8199/static/wiki/_book/data/common.html#mobile-code
export const GetSmsCode = 'common/send-code'
// //收货地址列表--GET--http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2%E6%96%B0%E7%89%88%E6%9C%AC/%E4%BC%9A%E5%91%98%E6%94%B6%E8%B4%A7%E5%9C%B0%E5%9D%80%E7%AE%A1%E7%90%86/listUsingGET_1
// export const GetAddressList = '/java/portal/api/v2/address/list';
//获取会员积分列表--GET--http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2%E6%96%B0%E7%89%88%E6%9C%AC/%E4%BC%9A%E5%91%98%E6%9C%8D%E5%8A%A1/integrationListUsingPOST
export const PostIntegrationList = '/java/portal/api/v2/member/integrationList';
//获取会员余额列表--GET--http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2%E6%96%B0%E7%89%88%E6%9C%AC/%E4%BC%9A%E5%91%98%E6%9C%8D%E5%8A%A1/balanceListUsingPOST
export const PostBalanceList = '/java/portal/api/v2/member/balanceList';
//获取首页信息--GET--http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2%E6%96%B0%E7%89%88%E6%9C%AC/%E9%A6%96%E9%A1%B5%E6%9C%8D%E5%8A%A1/indexInfoUsingGET
export const GetHomeIndexInfo = '/java/portal/api/v2/home/indexInfo';
//获取商品列表--GET-- http://10.32.5.88:8199/static/wiki/_book/data/product.html#index
export const GetProductIndex = 'product/index';
//查询商品详情信息--POST-http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2%E6%96%B0%E7%89%88%E6%9C%AC/%E5%95%86%E5%93%81%E6%9C%8D%E5%8A%A1/queryProductDetailUsingPOST
export const GetGoodsDetail = '/java/portal/api/v2/pms/product/detail';
//购物车商品选中点击--POST--http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2%E6%96%B0%E7%89%88%E6%9C%AC/%E8%B4%AD%E7%89%A9%E8%BD%A6%E7%AE%A1%E7%90%86/clickUsingPOST
export const CartItemClick = 'cart/checked';
//购物车商品数量修改--POST--http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2%E6%96%B0%E7%89%88%E6%9C%AC/%E8%B4%AD%E7%89%A9%E8%BD%A6%E7%AE%A1%E7%90%86/updateQuantityUsingPOST
export const CartItemQuantityUpdate = 'cart/add';
//购物车商品删除--DELETE--http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2%E6%96%B0%E7%89%88%E6%9C%AC/%E8%B4%AD%E7%89%A9%E8%BD%A6%E7%AE%A1%E7%90%86/deleteUsingDELETE
// export const CartItemDelete = '/java/portal/api/v2/cart/delete';
//获取省市区列表，已归类--GET--http://10.32.5.88:8199/static/wiki/_book/data/common.html#get-area-list
export const GetAreaList = 'common/get-area-list';
//根据收货地址id获取收货地址详情--POST--http://10.32.5.88:8199/static/wiki/_book/data/address.html#detail
export const AddressDetail = 'address/detail'; //
//添加收货地址--POST--http://10.32.5.88:8199/static/wiki/_book/data/address.html#add/会员收货地址管理/updateUsingPOST
export const AddAddress = 'address/add'; //
//修改收货地址--POST--http://10.32.5.88:8199/static/wiki/_book/data/address.html#edit/会员收货地址管理/updateUsingPOST
export const EditAddress = 'address/edit'; //
//删除地址--POST-- http://10.32.5.88:8199/static/wiki/_book/data/address.html#delete/会员收货地址管理/deleteUsingGET
export const DeleteAddr = 'address/delete' //
// 根据js_code获取微信openId--POST--http://10.32.5.88:8199/static/wiki/_book/data/common.html#get-wx-openid
export const GetOpenIdByCode = 'common/get-wx-openid';
//查询订单列表 -Get- http://10.32.5.88:8199/static/wiki/_book/data/order.html
export const GetOrderList = 'order/index';
//获取会员详情 -- Get -- http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2新版本/会员服务/currentMemberUsingGET
export const GetCurrentMemberInfo = 'member/info';
// 统计订单状态
export const GetUserOderStatusCount = 'order/get-user-order-status-count';
//确认订单收货  -- Get -- http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2新版本/订单服务/confirmDeliveryUsingGET
export const ConfirmDeliveryOrder = '/java/portal/api/v2/oms/confirmDelivery';
//取消订单 -- Get -- http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2新版本/订单服务/closeOrderUsingGET
export const CancelDeliveryOrder = '/java/portal/api/v2/oms/closeOrder';
//订单详情 -- Get -- http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2新版本/订单服务/detailUsingGET
export const GetOrderDetailInfo = 'order/info';
// 查询商品分类-- GET -- http://10.32.5.88:8199/static/wiki/_book/data/product.html#category
export const GetCategoryIndex = 'category/index';
// export const apiAddressSaveOrUpdate = API_PREFIX + 'v2/address/list';//添加或修改收货地址
// 订单确认页面接口-- POST -- http://10.32.5.88:8199/static/wiki/_book/data/cart.html?q=#buy
export const OrderCartBuy = 'cart/buy';
// 订单价格计算-- POST -- http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2%E6%96%B0%E7%89%88%E6%9C%AC/%E8%AE%A2%E5%8D%95%E6%9C%8D%E5%8A%A1/calculatePriceUsingPOST
export const OrderCalculatePrice = '/java/portal/api/v2/oms/calculatePrice';
// 创建订单-- POST -- http://10.32.5.88:8199/static/wiki/_book/data/order.html#create-order
export const GenerateOrder = 'order/create-order';
//获取用户优惠券列表带分页--http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2新版本/营销管理/memberCouponPageUsingGET
export const getCouponList = '/java/portal/api/v2/sms/memberCouponPage';
// 我的充值卡列表-- POST -- http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2%E6%96%B0%E7%89%88%E6%9C%AC/%E5%85%85%E5%80%BC%E5%8D%A1%E7%AE%A1%E7%90%86%E6%8E%A7%E5%88%B6%E7%B1%BB/getMyGiftCardListUsingPOST
export const GetMyGiftCardList = '/java/portal/api/sms/getMyGiftCardList';
//查询选中商品的可用优惠券-- POST -- http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2%E6%96%B0%E7%89%88%E6%9C%AC/%E8%90%A5%E9%94%80%E7%AE%A1%E7%90%86/findCouponListBySkuParamUsingPOST
export const FindCouponListBySkuParam = '/java/portal/api/v2/sms/findCouponListBySkuParam';
// 所有可售卡片接口列表-- GET -- http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2%E6%96%B0%E7%89%88%E6%9C%AC/%E5%85%85%E5%80%BC%E5%8D%A1%E7%AE%A1%E7%90%86%E6%8E%A7%E5%88%B6%E7%B1%BB/saleableAllCardListUsingGET
export const GetsaleableAllCardList = '/java/portal/api/sms/saleableAllCardList';
// 充值卡充值接口-- POST -- http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2%E6%96%B0%E7%89%88%E6%9C%AC/%E5%85%85%E5%80%BC%E5%8D%A1%E7%AE%A1%E7%90%86%E6%8E%A7%E5%88%B6%E7%B1%BB/verificationRefillableCardUsingPOST
export const PostVerificationRefillableCard = '/java/portal/api/sms/verificationRefillableCard';
// 充值卡购买接口-- POST --  http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2%E6%96%B0%E7%89%88%E6%9C%AC/%E5%85%85%E5%80%BC%E5%8D%A1%E7%AE%A1%E7%90%86%E6%8E%A7%E5%88%B6%E7%B1%BB/buyCardUsingPOST
export const POSTBuyCard = '/java/portal/api/sms/buyCard';
// http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2新版本/提货卡卷控制类/myPickCardsUsingPOST
export const PostMyPickCards = '/java/portal/api/sms/myPickCards';
// http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2新版本/提货卡卷控制类/bindPickCardUsingPOST
export const PostBindPickCard = '/java/portal/api/sms/bindPickCard';
//礼品清单接口-- GET -- http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2%E6%96%B0%E7%89%88%E6%9C%AC/%E6%8F%90%E8%B4%A7%E5%8D%A1%E5%8D%B7%E6%8E%A7%E5%88%B6%E7%B1%BB/pickCardGoodsUsingGET
export const GetPickCardGoods = '/java/portal/api/sms/pickCardGoods';
//文件上传接口-- POST -- http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2%E6%96%B0%E7%89%88%E6%9C%AC/%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E7%AE%A1%E7%90%86/singleFileUploadUsingPOST
export const SingleFileUpload = '/java/portal/oss/singleFileUpload';
//获取广告详情-- GET -- http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2%E6%96%B0%E7%89%88%E6%9C%AC/%E9%A6%96%E9%A1%B5%E6%9C%8D%E5%8A%A1/adInfoUsingGET
export const GETAdInfo = '/java/portal/api/v2/home/adInfo/';
// 登出接口 -- POST -- http://6egroup-test.shinmigo.com/java/portal/doc.html#/V2%E6%96%B0%E7%89%88%E6%9C%AC/%E4%BC%9A%E5%91%98%E6%9C%8D%E5%8A%A1/logoutUsingPOST
export const Logout = '/java/portal/api/v2/member/logout';
// 微信授权登录接口 -- POST -- http://10.32.5.88:8199/static/wiki/_book/data/common.html#wx-login
export const LoginByWeixin = 'common/wx-login';
//获取商品标签
export const GetProductTags = 'product/tag';
//获取商品列表
export const GetProducts = 'product/index';
//获取商品详情
export const GetProductDetail = 'product/detail';
//获取哦购物车数量
export const GetCartCount = 'cart/count';
//获取购物车列表--GET--http://10.32.5.88:8199/static/wiki/_book/data/cart.html#index
export const GetCartInfor = 'cart/index';
//添加商品到购物车--POST--http://10.32.5.88:8199/static/wiki/_book/data/cart.html#add
export const AddCart = 'cart/add';
//购物车商品删除--DELETE--http://10.32.5.88:8199/static/wiki/_book/data/cart.html#delete
export const CartItemDelete = 'cart/delete';
//购物车商品全选--POST--http://10.32.5.88:8199/static/wiki/_book/data/cart.html#checked
export const CartItemCheckAll = 'cart/checked';
//收货地址列表
export const GetAddressList = 'address/index';
//编辑登录会员详情
export const UpdateMemberMsg = 'member/update';
//获取购物车列表--GET--http://10.32.5.88:8199/static/wiki/_book/data/banner.html
export const GetBanner = 'banner/index'; 

//获取支付参数 -- POST-- http://10.32.5.88:8199/static/wiki/_book/data/member.html#pay
export const Pay = 'member/pay'; 
