<template>
	<view class="content">
		<NavBar backType="1" title="余额明细"></NavBar>
		<empty v-if="records.length <= 0"></empty>
		<view v-else class="detailList-box">
			<view class="section-box" v-for="(item, section) in records">
				<view v-if="section > 0" class="top-line"></view>
				<view class="date-box">
					<view class="date-line"></view>
					<text class="date-text">{{item.datestr}}</text>
				</view>
				<view class="list-box" v-for="(subItem, index) in item.lists">
					<view class="flex flexRow spaceBetween">
						<text class="flex flexGrow1 f28">{{getUseDescribeStr(subItem.type)}}</text>
						<text class="pointNum-text f30" :class="subItem.changeType =='1'? 'c_text_green' : 'c_text_red'"> {{(subItem.changeType =='1'? '+' :'')+subItem.price}}</text>
					</view>
					<text class="time-text ">{{subItem.createDate}}</text>
				</view>
			</view>
			<view class="box-bottom-view"></view>
		</view>
		<view class="content-bottom-view "></view>
		<uniLoadMore :status="status"></uniLoadMore>
	</view>
</template>

<script>
	const util = require('@/utils/util.js');
	const app = getApp();
	import empty from "../../components/empty/index.vue";
	import uniLoadMore from "../../components/uni-load-more/uni-load-more.vue"
	import {
		PostBalanceList
	} from '@/utils/api';
	export default {
		components: {
			empty,
			uniLoadMore
		},
		data() {
			return {
				balanceNum: '',
				currentIndex: 0,
				pageSize: 30,
				status: 'more',
				loadMore: false,
				loadMoreText: '加载更多',
				records: []
			};
		},
		onLoad(option) {
			this.balanceNum = option.balanceNum;
			this.postBalanceList();
		},
		// onPullDownRefresh() {
		// 	this.currentIndex = 0;
		// 	this.postBalanceList();
		// },
		onReachBottom() {
			if (this.loadMore) {
				this.currentIndex = this.currentIndex + 1;
				this.status = 'loading';
				this.postBalanceList();
			}
		},
		methods: {
			postBalanceList:function(){
				app.uniAjax(
				{
					url: PostBalanceList,
					type:'POST',
					data:{
						changeType:'',
						sourceType:'',
						pageRequest:{
							pageNum:this.currentIndex,
							pageSize:this.pageSize,
						}
					},
					loading: {
					msg: '',
					mask: true
				},
				}).then(res =>{//调用接口成功
				let resData = res.data;
				console.log("sssssss", resData);
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
						var exchangedate =  subItem.createDate.replace(/-/g,'/');
						var date = Date.parse(exchangedate);
				  	var dateStr = String(date).date('yyyy-MM');
				  	if (dataSource.length) {
				  		var haveHad = false;
				  		for (let item in dataSource) {
				  			if (item.datestr == dateStr) {
				  				item.lists.push(subItem);
				  				haveHad = true; 
				  			} 
				  		}
				  	
				  		if (!haveHad) {
				  			dataSource.push({
				  				datestr:dateStr,
				  				lists:[subItem],
				  			});
				  		}
				  	} else{
				  		dataSource.push({
				  			datestr:dateStr,
				  			lists:[subItem],
				  		});
				  	}
				  }
				  this.records = dataSource;
				} else {
				  uni.showToast({
				    title: resData.msg,
				    icon: 'none',
				    duration: 2000
				  });
				}
					
				
				}).catch(res =>{//调用接口失败
					// uni.stopPullDownRefresh();
				});
			},
			getUseDescribeStr: function(type) {
				let describeStr = '';
				switch (type) {
					case 1:
						describeStr = '订单';
							break;
					case 2:
						describeStr = '消费';
							break;
					case 3:
						describeStr = '退款';
							break;
					case 4:
						describeStr = '充值';
							break;
					case 5:
						describeStr = '提现';
							break;
					case 6:
						describeStr = '佣金';
							break;
					case 7:
						describeStr = '平台调整';
							break;
					case 8:
						describeStr = '充值卡充值';
							break;
					case 9:
						describeStr = '他人充值';
							break;

					default:
						describeStr = '未知状态';
						break;
				}
				return describeStr;
			}

		}
	};
</script>

<style lang="scss">
	@import './index.scss';
</style>
