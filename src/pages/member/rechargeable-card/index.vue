<template>
	<view class="content">
		<NavBar backType="1" title="我的充值卡"></NavBar>
		<view class="navbar">
			<view v-for="(item, index) in navTabbarList" :key="index" class="nav-item" :class="{current:tabCurrentIndex === index}"
			 @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navTabbarList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y="true" @scrolltolower="loadData">

					<view v-for="(itemCardObj,index) in tabItem.rechargeableList" :key="index" class="card-content">
						<view class="left-content">
							<text class="card-face-value">{{itemCardObj.childFaceValue}}</text>
							<text class="card-unit">元</text>
						</view>
						<view class="right-content">

							<view class="item-card-id-code">
								<text class="sku-id-code">ID：{{itemCardObj.id}}</text>
								<image class="copy-img" src="/static/common-icon/ic-copy.png" @click="copyCardId(index)"></image>
							</view>

							<view class="item-card-idcode">
								<text class="sku-id-code">兑换码：{{itemCardObj.cardSecretKey}}</text>
								<image class="copy-img" src="/static/common-icon/ic-copy.png" @click="copyCardCode(index)"></image>
							</view>


							<text class="sku-date">{{itemCardObj.buyTime}} 购买</text>
						</view>
					</view>

					<view class="load-more">{{tabItem.loadMoreState}}</view>

				</scroll-view>
			</swiper-item>
		</swiper>
	</view>

</template>

<script>
	import icanH5 from "../../components/ican-H5Api/ican-H5Api.js"
	import {
		GetMyGiftCardList
	} from "../../../utils/api.js";
	const app = getApp();
	const rechargeableList = [{}];
	export default {
		data() {
			return {
				tabCurrentIndex: 0,
				cardId: '',
				cardSecretKey: '',
				navTabbarList: [{
						state: 0,
						text: '未兑换',
						loadingType: 'more',
						currentPage: 1,
						pageSize: 20,
						rechargeableList: [],
						loadMoreState: "加载中"
					},
					{
						state: 1,
						text: '已兑换',
						loadingType: 'more',
						currentPage: 1,
						pageSize: 20,
						rechargeableList: [],
						loadMoreState: "加载中"
					}
				],
			};
		},
		onLoad(e) {
			this.gainCardList("")
		},
		methods: {
			loadData(source) {
				this.gainCardList(source)
			},
			copyCardId(index) {
				this.cardId = this.navTabbarList[this.tabCurrentIndex].rechargeableList[index].id;
				this.setClipboardText(this.cardId);
			},
			copyCardCode(index) {
				this.cardSecretKey = this.navTabbarList[this.tabCurrentIndex].rechargeableList[index].cardSecretKey;
				this.setClipboardText(this.cardSecretKey);
			},
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			gainCardList: function(source) {

				let index = this.tabCurrentIndex;
				let navItem = this.navTabbarList[index];
				let entity = {
					cardNumber: "",
					pageNum: navItem.currentPage,
					pageSize: navItem.pageSize,
					useStatus: navItem.state,
				};
				if (source === 'tabChange' && navItem.rechargeableList.length > 0) {
					return;
				}

				if (navItem.loadingType === 'loading' || navItem.loadingType === 'noMore') {
					return;
				}
				navItem.loadingType = 'loading';

				app.uniAjax({
					url: GetMyGiftCardList,
					type: 'POST',
					data: entity,
					loading: {
						msg: '加载中',
						mask: true
					}
				}).then(res => { //调用接口成功
					if (res.data.code == 200) {
						var recordsLength = res.data.data.records.length;
						if (recordsLength > 0 && recordsLength >= navItem.pageSize) {
							navItem.loadMoreState = "加载更多";
							navItem.loadingType = "more";
							navItem.currentPage++;
						} else {
							navItem.loadMoreState = "已经到底了"
							navItem.loadingType = "noMore";
							if (recordsLength === 0 && navItem.currentPage === 1) {
								navItem.loadMoreState = "暂无充值卡"
							}
						}
						if (navItem.currentPage === 1) {
							navItem.rechargeableList = res.data.data.records

						} else {

							if (recordsLength > 0) {
								navItem.rechargeableList = navItem.rechargeableList.concat(res.data.data.records)

							}
						}

						if (navItem.state === 0) {
							navItem.text = "未兑换" + "(" + navItem.rechargeableList.length + ")";
						} else {
							navItem.text = "已兑换" + "(" + navItem.rechargeableList.length + ")";
						}

					}
				}).catch(res => { //调用接口失败
					uni.showToast({
						title: res.data.status_txt,
						icon: 'none',
						duration: 2000
					});
				});
			},
			setClipboardText: function(text) {
				uni.setClipboardData({
					data: text,
					success: function(data) {},
					fail: function(err) {}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "./index.scss";
</style>
