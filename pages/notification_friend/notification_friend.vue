<template>
	<view class="inform">
	
		<text class="defaultText" v-if="!friendList.length > 0">暂时没有新的通知</text>
	
		<view v-for="item in friendList" :key="item.from" class="itemBar">
	
			<view class="notInfoDetContent">
				<view class="headContent">
					<image src='/static/images/theme@2x.png'></image>
				</view>
				<view class="infoContent">
					<text class="itemName">{{ item.from }}</text>
					<text>申请添加您为好友</text>
				</view>
			</view>
			
			<view class="buttonContent">
				<view v-if="!item.typeText" :data-from="item.from" class="rejectBtn" @tap="reject">拒绝</view>
				<view v-if="!item.typeText" class="centerLine"></view>
				<view v-if="!item.typeText" :data-from="item.from" class="agreeBtn" @tap="agree">同意</view>
				<view v-if="item.typeText" class="actionDone">{{ item.typeText }}</view>
			</view>
	
		</view>
	</view>
</template>

<script>
	let disp = require("../../utils/broadcast");
	export default {
		data() {
			return {
				friendList: [],
				myName: "",
			}
		},
		onLoad() {
			var me = this;
			// 不需要 object 地址更新，就能刷
			disp.on("em.xmpp.subscribe", function(){
				me.friendList = getApp().globalData.saveFriendList;
				uni.setStorageSync("friendNotiData", getApp().globalData.saveFriendList);
			});
			this.myName = uni.getStorageSync("myUsername");
			// this.friendList = uni.getStorageSync("friendNotiData");
			this.friendList = getApp().globalData.saveFriendList;
		},
		methods: {
			removeAndRefresh(removeId){
				var idx;
				this.friendList.forEach(function(v, k){
					if(v.from === removeId){
						idx = k;
					}
				});
				this.friendList.splice(idx, 1);
				getApp().globalData.saveFriendList.splice(idx, 1);
				// if(!this.friendList.length){
				// 	uni.navigateBack({
				// 		url: "../main/main?myName=" + this.myName
				// 	});
				// }
				// else{
				// 	this.friendList = this.friendList
				// }
			},
			
			agree(event){
				console.log(event);
				var me = this;
				// 同意（无回调）
				this.$im.conn.subscribed({
					to: event.currentTarget.dataset.from,
					message: "[resp:true]",
				});
				// 需要反向添加对方好友（无回调）
				// this.$im.conn.subscribe({
				// 	to: event.currentTarget.dataset.from,
				// 	message: "[resp:true]",
				// });
			
				this.friendList.forEach((item) => {
					if (item.from == event.currentTarget.dataset.from) {
						item.type = 'subscribed';
						item.typeText = '已同意';
						uni.setStorageSync("friendNotiData", this.friendList)
						//getApp().globalData.saveFriendList = this.friendList;
						this.friendList = this.friendList
					}
				})
				this.removeAndRefresh(event.currentTarget.dataset.from);
				this.getRoster();
			},
			getRoster(){
				let me = this;
				let rosters = {
					success(roster){
						var member = [];
						for(let i = 0; i < roster.length; i++){
							if(roster[i].subscription == "both"){
								member.push(roster[i]);
							}
						}
						uni.setStorage({
							key: "member",
							data: member
						});
					},
					error(err){
						console.log(err);
					}
				};
				this.$im.conn.getRoster(rosters);
			},
			reject(event){
				var me = this;
				// 无回调
				this.$im.conn.unsubscribed({
					to: event.currentTarget.dataset.from,
					message: "rejectAddFriend",
				});
			
				this.friendList.forEach((item) => {
					if (item.from == event.currentTarget.dataset.from) {
						item.type = 'unsubscribed';
						item.typeText = '已拒绝';
						uni.setStorageSync("friendNotiData", this.friendList)
						//getApp().globalData.saveFriendList = this.friendList;
						this.friendList = this.friendList
					}
				})
				this.removeAndRefresh(event.currentTarget.dataset.from)
			}
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
	height: 252rpx;
	background-color: #fff;
	border: 1px solid #FAFAFA;
	border-radius: 10rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}
.notInfoDetContent{
	height: 160rpx;
	width: 100%;
	border-bottom: 1px solid #FAFAFA;
}
.headContent image{
	width: 72rpx;
	height: 72rpx;
}
.headContent{
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	margin: 24rpx 30rpx 0;
	float: left;
}
.infoContent{
	display: flex;
	flex-direction: column;
}
.infoContent text{
	height: 54rpx;
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
