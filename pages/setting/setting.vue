<template>
	<view>
		
		<view class="setting_head">
			<view class="head_pic">
				<image src="/static/images/theme@2x.png"></image>
				<view>
					<text class="setting_username">{{ yourname }}</text>
					<text class="setting_username2">说点什么吧</text>
				</view>
			</view>
		</view>
		
		<view class="setting_list">
			<view class="setting_listContent" @tap="goGeneralSetting">
				<text>通用设置</text>
				<image class="list_right" src="/static/images/next.png"></image>
			</view>
		</view>
		
		<view class="setting_list">
			<view class="setting_listContent" @tap="logout">
				<text class="setting_redtext">退出登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				yourname: "",
			}
		},
		onLoad() {
			this.yourname = uni.getStorageSync("myUsername");
		},
		methods: {
			goGeneralSetting(){
				uni.navigateTo({
					url: "./general"
				});
			},
			
			logout(){
				console.log('logout');
				uni.showModal({
					title: '退出',
					content: '是否退出登录?',
					success: (res)=>{
						if(res.confirm){
							this.$im.conn.close();
							// wx.closeSocket()
							uni.redirectTo({
								url: "../login/login"
							});
						}
					}
				})
			}
		}
	}
</script>

<style>
page {
	background-color: #F5F5F5;
}
.setting_title{
	height: 128rpx;
	line-height: 128rpx;
	font-size: 64rpx;
	font-weight: 400;
	padding-left: 32rpx;
	background-color: #fff;
}
.setting_head {
	width: 100%;
	height: 160rpx;
	background-color: #fff;
}
.head_pic {
	height: 100%;
	margin: 0 32rpx;
	border-bottom: 0.5px #E5E5E5 solid;
	display: flex;
	align-items: center;
}
.head_pic view{
	margin-left: 20rpx;
}
.head_pic image {
	width: 112rpx;
	height: 112rpx;
	border-radius: 56rpx;
	display: block;
}
.setting_username {
	height: 68rpx;
	line-height: 68rpx;
	font-size: 40rpx;
	display: block;
}

.setting_username2{
	height: 54rpx;
	line-height: 54rpx;
	font-size: 30rpx;
	color: #9B9B9B;
	display: block;
}

.setting_list{
	background-color: #fff;
}
.setting_listContent {
	height: 88rpx;
	margin: 48rpx 32rpx 0;
	border-bottom: 0.5px #E5E5E5 solid;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 32rpx;
	background-color: #fff;
}
.list_right {
	width: 48rpx;
	height: 48rpx;
	margin-right: 8rpx;
	color: #9B9B9B;
}
.setting_redtext{
	color: #CE3918;
}

</style>
