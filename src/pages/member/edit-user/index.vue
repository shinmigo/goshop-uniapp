<template>

	<view class="content">
		<NavBar backType="1" title="个人信息"></NavBar>

		<view class="personal-information-content">
			<view class="user-img-content flex flexAlignC spaceBetween flexAlignSelfStart" @click="chengeUserImg()">
				<text class="img-title flexGrow1">头像</text>
				<BannerImg class="user-img" width="100" ratio="1" :banner-url="imgHost + user_pictrue" bg-img-type="2"
				 border-radius="100" />
				<img class="arrow-right" src="/static/common-icon/arrow-right.png">
			</view>

			<view class="user-name-content flex flexAlignC spaceBetween flexAlignSelfStart" @click="toEditPage()">
				<text class="text-stytle flexGrow1">昵称</text>
				<text :class="[isSet ? 'text-set-stytle' : 'name-set']">{{userName}}</text>
				<img class="arrow-right" src="/static/common-icon/arrow-right.png">
			</view>

			<view class="user-name-content flex flexAlignC spaceBetween flexAlignSelfStart" @click="selectSex()">
				<text class="text-stytle flexGrow1">性别</text>
				<text class="text-set-stytle">{{sex}}</text>
				<img class="arrow-right" src="/static/common-icon/arrow-right.png">
			</view>

			<picker class="picker-time" mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
				<view class="user-name-content flex flexAlignC spaceBetween flexAlignSelfStart">
					<text class="text-stytle flexGrow1">生日</text>
					<view class="text-set-stytle">{{date}}</view>
					<img class="arrow-right" src="/static/common-icon/arrow-right.png">
				</view>
			</picker>
		</view>

		<PopupWindow ref="popup" type="bottom" height="auto" width="100%" radius="6" :showCloseIcon="true">
			<view class="sex-change" @click="selectMale()">男</view>
			<view class="sex-change" @click="selectFemale()">女</view>
		</PopupWindow>

	</view>

</template>

<script>
	const app = getApp();
	import PopupWindow from '../../components/wyb-popup/wyb-popup.vue'
	import {
		UpdateMemberMsg,
		SingleFileUpload,
		GetCurrentMemberInfo
	} from "@/utils/api";
	export default {
		components: {
			PopupWindow
		},
		data() {
			// 设置日期
			const currentDate = this.getDate({
				format: true
			})
			return {
				imgHost: app.globalData.configRouter.imgHost,
				userName: '去设置',
				date: '',
				sex: '',
				isSet: false,
				selectGender: 0, //0->未知；1->男；2->女
				user_pictrue: '', //'../../../static/myinfo/missing-face.png',
				formEditname: false
			}
		},
		onLoad() {
			this.getUserInfo();
		},
		onShow() {
			var that = this;
			//获取本地存储设置昵称
			uni.getStorage({
				key: "user_name",
				success(e) {
					if (e.data != "") {
						that.userName = e.data;
						that.isSet = true;
						that.formEditname = true;
					}
				}
			});
			if (that.formEditname) {
				this.updateMemberMsg();
				that.formEditname = false;
				uni.setStorage({
					key: "user_name",
					data: ''
				})
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			chengeUserImg() {

				uni.showToast({
					title: '功能暂未开放'
				})

				var that = this;
				// uni.chooseImage({
				// 	// count:  允许上传的照片数量
				// 	count: 1,
				// 	// sizeType:  original 原图，compressed 压缩图，默认二者都有
				// 	sizeType: ['original', 'compressed'],
				// 	sourceType: ['album', 'camera'],
				// 	success(res) {
				// 		that.fileUpload(res.tempFilePaths[0])
				// 	},
				// 	fail(res) {
				// 		uni.showToast({
				// 			title: '获取头像失败',
				// 			icon: 'none',
				// 			duration: 2000
				// 		});
				// 	}
				// })
			},
			toEditPage() {
				uni.navigateTo({
					url: "/pages/member/edit-user-name/index"
				})
			},
			selectSex() {
				this.$refs.popup.show() // 显示
			},
			selectMale() {
				this.sex = '男';
				this.$refs.popup.hide(); // 隐藏
				this.updateMemberMsg();

			},
			selectFemale() {
				this.sex = '女';
				this.$refs.popup.hide(); // 隐藏
				this.updateMemberMsg();
			},
			// 选择生日
			bindDateChange: function(e) {
				this.date = e.target.value;
				this.updateMemberMsg();
				uni.setStorage({
					key: "user_birthday",
					data: e.target.value
				})
			},
			// 获取年月日信息
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			fileUpload: function(tempFile) {

				uni.uploadFile({
					url: app.globalData.configRouter.apiHost + SingleFileUpload, //仅为示例，非真实的接口地址
					filePath: tempFile,
					name: 'file',
					formData: {},
					success: (uploadFileRes) => {
						if (uploadFileRes.statusCode == 200) {
							let res = JSON.parse(uploadFileRes.data);
							if (res.code == 200) {
								this.user_pictrue = res.data.relativeUrl;
								this.updateMemberMsg();
								return
							}
						}
						uni.showToast({
							title: '获取头像失败',
							icon: 'none',
							duration: 2000
						});
					}
				});
			},
			updateMemberMsg: function() {
				if (this.sex === "男") {
					this.selectGender = 1;
				} else if (this.sex === "女") {
					this.selectGender = 2;
				}
				let memberUpdateRequest = {
					gender: this.selectGender,
					avatar: this.user_pictrue,
					nickname: this.userName === "去设置" ? "" : this.userName,
					birthday: this.date
				};
				app.uniAjax({
					// url: UpdateMemberMsg,
					url: UpdateMemberMsg,
					type: 'POST',
					data: memberUpdateRequest,
				}).then(res => { //调用接口成功
					if (res.data.code == 1) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
							duration: 2000
						});

					}
				}).catch(res => { //调用接口失败
					uni.showToast({
						title: res.data.status_txt,
						icon: 'none',
						duration: 2000
					});
				});

			},
			getUserInfo: function() {
				app.uniAjax({
					url: GetCurrentMemberInfo,
					type: 'Get',
					loading: {
						msg: '加载中',
						mask: true
					}
				}).then(res => {
					if (res.data.code === 1) {
						
						if (res.data.data[0].avatar != "" && res.data.data[0].avatar != null) {
							this.user_pictrue = res.data.data[0].avatar;
						}

						if (res.data.data[0].nickname != "" && res.data.data[0].nickname != null) {
							this.userName = res.data.data[0].nickname;
						}

						if (res.data.data[0].birthday != "" && res.data.data[0].birthday != null) {
							this.date = res.data.data[0].birthday.split(" ")[0];
						}

						if (res.data.data[0].gender != "" && res.data.data[0].gender != null) {

							if (res.data.data[0].gender === 1) {
								this.sex = "男";
							} else if (res.data.data[0].gender === 2) {
								this.sex = "女";
							}

						}

					}
				});
			}
		}
	}
</script>

<style lang="scss">
	@import "./index.scss";
</style>
