<template>
	<view class="inform">
	
		<text class="defaultText" v-if="!groupList.length > 0">暂时没有新的通知</text>
	
		<view v-for="item in groupList" :key="item.from" class="itemBar">
	
			<view class="notInfoDetContent">
				<view class="headContent">
					<image src='/static/images/theme@2x.png'></image>
				</view>
				<view class="infoContent">
					<text class="itemName">{{ item.from }}</text>
					<text>邀请您加入群组为{{item.roomid}}</text>
				</view>
			</view>
			
			<view class="buttonContent">
				<!-- <view v-if="!item.typeText" :data-from="item.from" class="rejectBtn" @tap="reject">拒绝</view>
				<view v-if="!item.typeText" class="centerLine"></view>
				<view v-if="!item.typeText" :data-from="item.from" class="agreeBtn" @tap="agree">同意</view> -->
				<view class="actionDone">已同意</view>
			</view>
	
		</view>
	</view>
</template>

<script>
	let disp = require("../../utils/broadcast");
	export default {
		data() {
			return {
				groupList: [],
			}
		},
		onLoad() {
			var me = this;
			// 不需要 object 地址更新，就能刷
			disp.on("em.xmpp.invite.joingroup", function(){
				me.groupList = getApp().globalData.saveGroupInvitedList
				uni.setStorageSync("groupNotiData", getApp().globalData.saveGroupInvitedList)
			});
			
			this.groupList = uni.getStorageSync("groupNotiData")
		},
		onShow(){
			getApp().globalData.saveGroupInvitedList = [];
			this.listGroups()
		},
		methods: {
			listGroups(){
				var me = this;
				return this.$im.conn.listRooms({
					success: function(rooms){
						uni.setStorage({
							key: "listGroup",
							data: rooms
						});
					},
					error: function(err){
						console.log(err)
					}
				});
			},
			
			removeAndRefresh(removeId){
				
			},
		}
	}
</script>

<style>
page{
	background-color: #FAFAFA;
}
.defaultText{
	color: #E3E3E3;
	font-size: 32rpx;
	text-align: center;
	display: block;
	margin: 300rpx auto 0 auto;
}
.itemBar{
	margin: 20rpx 40rpx;
	min-height: 252rpx;
	background-color: #fff;
	border: 1px solid #FAFAFA;
	border-radius: 10rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}
.notInfoDetContent{
	min-height: 160rpx;
	width: 100%;
	border-bottom: 1px solid #FAFAFA;
}
.headContent{
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	margin: 24rpx 30rpx 0;
	float: left;
}
.headContent image{
	width: 72rpx;
	height: 72rpx;
}
.infoContent{
	display: flex;
	flex-direction: column;
}
.infoContent text{
	min-height: 54rpx;
	line-height: 54rpx;
	font-size: 28rpx;
	color: #9B9B9B;
}
.infoContent .itemName{
	height: 62rpx;
	font-size: 32rpx;
	line-height: 62rpx;
	color: #000;
	margin-top: 24rpx;
	overflow: hidden;
	text-overflow: ellipsis;
}

.buttonContent{
	display: inline-flex;
	width: 100%;
	flex: 1;
	height: 72rpx;
}
.buttonContent .agreeBtn, .buttonContent .rejectBtn{
	flex: 1;
	font-size: 32rpx;
	background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
}
.agreeBtn{
	color: #0873DE;
}
.rejectBtn{
	color: #666666;
}
.centerLine{
	border-right: 1px solid #FAFAFA;
}
.actionDone{
	flex: 1;
	font-size: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #999999;
}

</style>
