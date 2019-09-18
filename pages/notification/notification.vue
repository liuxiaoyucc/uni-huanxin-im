<template>
	<view>
		<view class="address_bottom" @tap="into_friendNot">
			<image src="/static/images/notification.png"></image>
			<text>加好友申请</text>
			<text v-if="messageNum > 0" class="notification_dot">{{ messageNum }}</text>
		</view>
		<view class="address_bottom" @tap="into_groupNot">
			<image src="/static/images/jiaqun@2x.png"></image>
			<text>加群组申请</text>
			<text v-if="groupInviteNum > 0" class="notification_dot">{{ groupInviteNum }}</text>
		</view>
	</view>
</template>

<script>
	let disp = require("../../utils/broadcast");
	export default {
		data() {
			return {
				messageNum: 0,
				unReadSpotNum: 0,
				groupInviteNum: 0,
				unReadTotalNotNum: 0
			}
		},
		onLoad() {
			let me = this;
			//监听加好友申请
			disp.on("em.xmpp.subscribe", function(){
				me.messageNum = getApp().globalData.saveFriendList.length;
				me.unReadTotalNotNum = getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length
			});
			
			//监听未读消息数
			disp.on("em.xmpp.unreadspot", function(){
				me.unReadSpotNum = getApp().globalData.unReadMessageNum
			});
			//监听加群通知数
			disp.on("em.xmpp.invite.joingroup", function(){
				me.groupInviteNum = getApp().globalData.saveGroupInvitedList.length;
				me.unReadTotalNotNum = getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length
			});
			
			uni.setStorageSync("friendNotiData", getApp().globalData.saveFriendList)
			uni.setStorageSync("groupNotiData", getApp().globalData.saveGroupInvitedList)
		},
		onShow() {
			this.messageNum = getApp().globalData.saveFriendList.length;
			this.unReadSpotNum = getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum;
			this.groupInviteNum = getApp().globalData.saveGroupInvitedList.length;
			this.unReadTotalNotNum = getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length;
		},
		methods: {
			into_friendNot: function(){
				uni.navigateTo({
					url: "../notification_friendDetail/friendDetail?myName=" + wx.getStorageSync("myUsername")
				});
			},
			
			into_groupNot: function(){
				uni.navigateTo({
					url: "../notification_groupDetail/groupDetail?myName=" + wx.getStorageSync("myUsername")
				});
			},
		}
	}
</script>

<style>
page{
	overflow: hidden;
}
.notification_title{
	background-color: #fff;
	width: 100%;
	height: 128rpx;
	line-height: 96rpx;
	font-size: 64rpx;
	font-weight: 400;
	padding-left: 32rpx;
	box-sizing: border-box;
}
.address_bottom{
	height: 108rpx;
	line-height: 108rpx;
	background: #fff;
	color: #000000;
	font-size: 34rpx;
	border-bottom: 0.5px #E5E5E5 solid;
	margin: 0 32rpx;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	position: relative;
} 
.address_bottom image{
	width: 72rpx;
	height: 72rpx;
	margin-right: 24rpx;
}
.notification_dot{
	width: 32rpx;
	height: 32rpx;
	background-color: #CE3918;
	border-radius: 16rpx;
	position: absolute;
	right: 32rpx;
	color: #fff;
	line-height: 32rpx;
	text-align: center;
	font-size: 24rpx;
	top: 38rpx;
}
</style>
