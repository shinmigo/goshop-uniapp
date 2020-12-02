<template>
	<view class="content">
		<NavBar backType="1" title="积分明细"></NavBar>
		<empty v-if="records.length <= 0" width="300" imgHeight="300" topPadding="-300"></empty>
		<view v-if="records.length > 0" class="header-top">
			<BannerImg class="bg" width="750" height="320" bannerUrl="/static/point/point_top.png"></BannerImg>
			<view class="info-box">
				<text class="total-point f56 texC c_text_brown">{{pointNum || '0'}}</text>
			</view>
		</view>

		<view v-if="records.length > 0" class="detailList-box">
			<text class="pointDetail-text f28 texL">积分明细</text>
			<view class="section-box" v-for="(item, section) in records">
				<view class="top-line"></view>

				<view class="date-box">
					<view class="date-line"></view>
					<text class="date-text">{{item.datestr}}</text>
				</view>
				<view class="list-box" v-for="(subItem, index) in item.lists">
					<view class="flex flexRow spaceBetween">
						<text class="flex flexGrow1 f28">{{subItem.sourceType == '0' ? '订单消费积分' : '管理员修改'}}</text>
						<text class="pointNum-text f30" :class="subItem.changeType =='1'? 'c_text_green' : 'c_text_red'">
							{{(subItem.changeType =='1'? '+' :'')+subItem.changeCount}}</text>
					</view>
					<text class="time-text ">{{String(subItem.createTime).date('yyyy.MM.dd mm:ss')}}</text>
				</view>
			</view>
			<view class="box-bottom-view"></view>
		</view>
		<view class="content-bottom-view "></view>
		<uniLoadMore :status="status"></uniLoadMore>

	</view>
</template>

<script>
	import empty from "../../components/empty/index.vue";
	import uniLoadMore from "../../components/uni-load-more/uni-load-more.vue"
	const util = require('@/utils/util.js');
	const app = getApp();
	import {
		PostIntegrationList
	} from '@/utils/api';
	export default {
		components: {
			empty,
			uniLoadMore
		},
		data() {
			return {
				pointNum: '',
				currentIndex: 0,
				pageSize: 30,
				status: 'more',
				loadMore: false,
				loadMoreText: '加载更多',
				records: []
			};
		},
		onLoad(option) {
			this.pointNum = app.globalData.userInfo.integration;
			this.postIntegrationList();
		},
		// onPullDownRefresh() {
		// 	this.currentIndex = 0;
		// 	this.postIntegrationList();
		// },
		onReachBottom() {

			if (this.loadMore) {
				this.currentIndex = this.currentIndex + 1;
				this.status = 'loading';
				this.postIntegrationList();
			}
		},
		methods: {
			postIntegrationList: function() {
				app.uniAjax({
					url: PostIntegrationList,
					type: 'POST',
					data: {
						changeType: '',
						sourceType: '',
						pageRequest: {
							pageNum: this.currentIndex,
							pageSize: this.pageSize,
						}
					},
					loading: {
						msg: '',
						mask: true
					},
				}).then(res => { //调用接口成功

					let resData = res.data;
					if (resData.code == 200) {
					  if (res.data.data.records.length > 0 && res.data.data.records >= this.pageSize) {
					  	this.status = 'more';
					  	this.loadMore = true;
					  } else {
					  	this.status = 'noMore';
					  	this.loadMore = false;
					  
					  }
					  if (this.currentIndex == 0 && this.records.length > 0) {
					  	this.records = [];
					  }
					  var dataSource = this.records;
					  let resDataRecords = res.data.data.records;
					  for (var i = 0; i < resDataRecords.length; i++) {
					  	let subItem = resDataRecords[i];
					  	var date = String(subItem.createTime).date('yyyy-MM');
					  	if (dataSource.length) {
					  		var haveHad = false;
					  		for (let item in dataSource) {
					  			if (item.datestr == date) {
					  				item.lists.push(subItem);
					  				haveHad = true;
					  			}
					  		}
					  
					  		if (!haveHad) {
					  			dataSource.push({
					  				datestr: date,
					  				lists: [subItem],
					  			});
					  		}
					  	} else {
					  
					  		dataSource.push({
					  			datestr: date,
					  			lists: [subItem],
					  		});
					  	}
					  }
					  this.records = dataSource;
					  console.log("zhanghuanan===", this.records);
					} else {
					  uni.showToast({
					    title: resData.msg,
					    icon: 'none',
					    duration: 2000
					  });
					}
					

				}).catch(res => { //调用接口失败
					// uni.stopPullDownRefresh();
				});
			}
		}
	};
</script>

<style lang="scss">
	@import './index.scss';
</style>
