<template>
	<view class="content">
		<NavBar left-icon="back" :title="navTitle"></NavBar>
		<view class="cell mTop10">
			<view class="row">
				<text class="text">收货人</text>
				<input class="input" v-model="addressData.name" type="text" placeholder="请填写姓名" placeholder-class="pl-text" />
			</view>
			<view class="line"></view>
		</view>
		<view class="cell">
			<view class="row">
				<text class="text">手机号</text>
				<input class="input" v-model="addressData.mobile" type="number" placeholder="请填写手机号" placeholder-class="pl-text" maxlength="11" />
			</view>
			<view class="line"></view>
		</view>
		<view class="cell">
			<view class="row" @click="onClickArea">
				<text class="text">收货地区</text>
				<view :class="(area ? 'c_text_title' : 'c_text_grey') + ' f28 pl40'">{{ area || '小区/街道/写字楼' }}</view>
				<image class="arrow" src="../../../static/address/ic-detail-gray.png" mode="aspectFit"></image>
			</view>
			<view class="line"></view>
		</view>
		<view class="rowFlex">
			<text class="text">详细地址</text>
			<textarea class="input" v-model="addressData.address" type="text" placeholder="例：16号楼501室" placeholder-class="pl-text" auto-height="true" maxlength="-1" />
		</view>
		<view class="cell mTop10">
			<view class="row ">
				<text class="text" style="width: 200rpx;">设为默认地址</text>
				<switch :checked="addressData.is_default" @change="onClickSwitch" />
			</view>
		</view>
		<view class="" style=" padding-top: 64rpx;">
			<button :class="[isSubmitBtnEnable ? 'bg-image' : 'button-dis', 'button']" :disabled="!isSubmitBtnEnable" type="custom" @click="onClickSubmitBtn">保存</button>
			<button class="button-del" v-if="pageType === 'edit'" type="custom" @click="onClickDelBtn">删除</button>
		</view>
		<address-picker ref="addressPicker" @onConfirm="addressPickerConfirm"></address-picker>
	</view>
</template>

<script>
import { GetAreaList, AddressDetail, EditAddress, AddAddress, DeleteAddr } from '@/utils/api.js';
import addressPicker from '@/pages/components/simple-address/simple-address.vue';
const app = getApp();

export default {
	props: {},
	data() {
		return {
			navTitle: '添加收货地址',
			addressData: {},
			area: '',
			pageType: {
				type: String,
				default: 'add'
			},
			isSubmitBtnEnable: false
		};
	},

	onLoad(option) {
		console.log('type = ', option.type);

		this.pageType = option.type;
		if (this.pageType === 'edit') {
			console.log('item = ', JSON.parse(option.item));
			this.navTitle = '编辑收货地址';
			this.addressData = JSON.parse(option.item);
			this.getAddressDetail();
		} else {
			this.addressData = {
				name: '',
				mobile: '',
				code_prov_name: '',
				code_city_name: '',
				code_coun_name: '',
				address: ''
			};
		}
	},
	components: {
		addressPicker
	},
	watch: {
		addressData: {
			handler(newValue, oldValue) {
				console.log('watch addressData = ', newValue);
				this.isSubmitBtnEnable = this.isEnabledSubmitBtn();
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		onClickArea: function() {
			//弹出地址选择器

			this.getAreaList();
		},

		addressPickerConfirm: function(e) {
			//选择地址确定

			let arr = e.labelArr;
			console.log('picker choose = ', e);

			this.addressData.code_prov_name = arr[0];
			this.addressData.code_city_name = arr[1];
			this.addressData.code_coun_name = arr[2];
			this.addressData.code_prov = e.provinceCode.toString();
			this.addressData.code_city = e.cityCode.toString();
			this.addressData.code_coun = e.areaCode.toString();
			this.area = this.addressData.code_prov_name + this.addressData.code_city_name + this.addressData.code_coun_name;
		},

		onClickSwitch: function(e) {
			//默认地址
			console.log('switch value = ', e.target.value);
			this.addressData.is_default = e.target.value ? 1 : 0;
		},

		onClickDelBtn: function(e) {
			//删除地址
			app.uniAjax({
				url: DeleteAddr,
				type: 'POST',
				data: {
					address_id: this.addressData.address_id
				},
				loading: {
					msg: '',
					mask: true
				}
			})
				.then(result => {
					console.log('submit result = ', result);
					if (result.data.code == 1) {
						uni.navigateBack();
					}
					this.showToastWithMsg(result.data.message);
				})
				.catch(error => {
					console.log('submit error = ', error);
					this.showToastWithMsg(error.errMsg);
				});
		},

		isEnabledSubmitBtn() {
			let data = this.addressData;
			let area = data.code_prov_name + data.code_city_name + data.code_coun_name;
			var flag =
				data.name && data.name.length > 0 && (data.mobile && data.mobile.length > 0) && (area && area.length > 0) && (data.address && data.address.length > 0)
					? true
					: false;
			console.log('isEnabledSubmitBtn = ', flag);

			return flag;
		},

		onClickSubmitBtn: function() {
			//提交保存

			let data = this.addressData;
			let area = data.code_prov_name + data.code_city_name + data.code_coun_name;
			let aid = '';

			if (!data.name || !data.mobile || !area || !data.address) {
				this.showToastWithMsg('请输入完整信息');
				return;
			}
			if (data.mobile.length != 11) {
				this.showToastWithMsg('请填写正确的号码');
				return;
			}
			console.log('submit data = ', data);
			var params = {
				is_default: data.is_default ? true : false,
				name: data.name,
				mobile: data.mobile,
				address: data.address,
				room_number: '',
				code_city: data.code_city,
				code_prov: data.code_prov,
				code_coun: data.code_coun
			};

			if (this.pageType === 'edit') {
				aid = data.address_id;
				this.$set(params, 'address_id', aid);
				console.log('api =', EditAddress, params);
				this.editAddressInfo(params);
				return;
			}

			this.addAddressInfo(params);
		},

		getAreaList() {
			//提交请求
			app.uniAjax({
				url: GetAreaList,
				type: 'GET',
				loading: {
					msg: '',
					mask: true
				}
			})
				.then(result => {
					console.log('getAreaList result = ', result);
					if (result.data.code == 1) {
						let areas = result.data.data[0].areas;
						this.$refs.addressPicker.initWithData(areas);
						this.$refs.addressPicker.open();
					}
				})
				.catch(error => {
					console.log('getAreaList error = ', error);
					this.showToastWithMsg(error.errMsg);
				});
		},

		addAddressInfo: function(params) {
			//提交请求
			app.uniAjax({
				url: AddAddress,
				type: 'POST',
				data: params,
				loading: {
					msg: '',
					mask: true
				}
			})
				.then(result => {
					console.log('submit result = ', result);
					if (result.data.code == 1) {
						uni.navigateBack();
					}
					this.showToastWithMsg(result.data.message);
				})
				.catch(error => {
					console.log('submit error = ', error);
					this.showToastWithMsg(error.errMsg);
				});
		},

		editAddressInfo: function(params) {
			//提交请求
			app.uniAjax({
				url: EditAddress,
				type: 'POST',
				data: params,
				loading: {
					msg: '',
					mask: true
				}
			})
				.then(result => {
					console.log('editAddressInfo result = ', result);
					if (result.data.code == 1) {
						uni.navigateBack();
					}
					this.showToastWithMsg(result.data.message);
				})
				.catch(error => {
					console.log('editAddressInfo error = ', error);
					this.showToastWithMsg(error.errMsg);
				});
		},

		getAddressDetail: function() {
			//地址详情
			app.uniAjax({
				url: AddressDetail, //+ "/" + this.addressData.address_id,
				type: 'GET',
				data: { address_id: this.addressData.address_id },
				loading: {
					msg: '',
					mask: true
				}
			})
				.then(result => {
					console.log('getAddressDetail result = ', result);
					this.addressData = result.data.data[0];
					let data = this.addressData;
					this.area = data ? data.code_prov_name + data.code_city_name + data.code_coun_name : '';
					this.isSubmitBtnEnable = this.isEnabledSubmitBtn();
					console.log('getAddressDetail this.area value = ', this.area);
				})
				.catch(error => {
					console.log('getAddressDetail error = ', error);
					this.showToastWithMsg(error.errMsg);
				});
		},

		showToastWithMsg: function(msg) {
			if (!msg || msg.length == 0) {
				return;
			}
			uni.showToast({
				title: msg,
				icon: 'none',
				duration: 2000
			});
		}
	}
};
</script>

<style lang="scss">
@import './index.scss';
</style>
