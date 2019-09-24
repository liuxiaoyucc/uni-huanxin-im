<template>
	<view class="group-wrap">
	    <view class="wrap">
	    <view class="group-name">
	        <text class="pd-10">群组名称</text>
	        <text class="item-name">{{ groupName }}</text>
	    </view>
	    <view class="group-name">
	        <text class="pd-10">群描述</text>
	        <view class="item-name">{{ groupDec }}</view>
	    </view>
	    <view class="group-member">
	        <text class="pd-10">群组成员</text>
	        <view v-for="(item, index) in groupMember" :key="index">
	            <view class="member-list">{{ item.member || item.owner }}</view>
	        </view>
	    </view>
	    <view class="invite-member">
	        <text class="pd-10 invite-title">邀请群成员</text>
	        <view class="invite-wrap">
	            <input placeholder="用户名" @input="add_friend_name" placeholder-style="color:#CFCFCF;line-height:40px;font-size:14px;"/>
	            <button type="primary" @tap="addGroupMembers">邀请</button>
	        </view>
	    </view>
	    <!-- <view class="black-list border-bottom">
	        <text class="pd-5">群组黑名单</text>
	    </view> -->
	    <view class="bottom-wrap">
	    <view class="disband-group" v-if="isOwner">
	        <button type="warn" @tap="dissolveGroup">解散群组</button>
	    </view>
	    <view class="exit-group" v-if="!isOwner">
	        <button type="warn" @tap="leaveGroup">退出群组</button>
	    </view>
	    </view>
	    </view>
	</view>
</template>

<script>
	let disp = require("../../utils/broadcast");
	export default {
		data() {
			return {
				roomId: "",			// 群id
				groupName: "",		// 群名称
				currentName: "",	// 当前用户
				groupMember: [],	// 群成员
				curOwner: "",		// 当前群管理员
				groupDec: "",		// 群描述
				addFriendName: [],
				isOwner: false
			}
		},
		onLoad(options) {
			let me = this;
			this.roomId = JSON.parse(options.groupInfo).roomId
			this.groupName = JSON.parse(options.groupInfo).groupName
			this.currentName = JSON.parse(options.groupInfo).myName
			
			
			disp.on("em.xmpp.group.leaveGroup", function(){
				var pageStack = getCurrentPages();
				// 判断是否当前路由是本页
				if(pageStack[pageStack.length - 1].route === me.route){
					me.getGroupMember();
					me.getGroupInfo();
				}
			});
			console.log(this.roomId, this.groupName, this.currentName);
			// 获取群成员
			this.getGroupMember();
			// 获取群信息
			this.getGroupInfo();
		},
		methods: {
			getGroupMember(){
				var me = this;
				// 获取群成员
				var pageNum = 1,
					pageSize = 1000;
				var options = {
					pageNum: pageNum,
					pageSize: pageSize,
					groupId: this.roomId,
					success: function(resp){
						if(resp && resp.data && resp.data.data){
							me.groupMember = resp.data.data
						}
						console.log(me.groupMember);
					},
					error: function(err){
			
					}
				};
				this.$im.conn.listGroupMember(options);
			},
			
			getGroupInfo(){
				var me = this;
				// 获取群信息
				var options = {
					groupId: this.roomId,
					success: function(resp){
						if(resp && resp.data && resp.data.data){
							me.curOwner = resp.data.data[0].owner
							me.groupDec = resp.data.data[0].description
			
							if(me.currentName == resp.data.data[0].owner){
								me.isOwner = true
							}
						}
					},
					error: function(){
			
					}
				};
				this.$im.conn.getGroupInfo(options);
			},
			
			add_friend_name(e){
				var firendArr = [];
				firendArr.push(e.detail.value);
				this.addFriendName = firendArr
			},
			
			// 加好友入群
			addGroupMembers(){
				var me = this;
				var option = {
					list: this.addFriendName,
					roomId: this.roomId,
					success: function(){
						if(me.isExistGroup(me.addFriendName, me.groupMember)){
							uni.showToast({
								title: "已在群中",
								duration: 2000,
							});
						}
						else{
							uni.showToast({
								title: "邀请已发出",
								duration: 2000,
							});
						}
						
						me.getGroupMember();
					},
					error: function(err){
						uni.showToast({
							title: err.data.error_description,
						});
					}
				};
				this.$im.conn.addGroupMembers(option);
			},
			
			isExistGroup(name, list){
				for(let index = 0; index < list.length; index++){
					if(name == list[index].member || name == list[index].owner){
						return true
					}
				}
				return false
			},
			
			leaveGroup(){
				var me = this;
				this.$im.conn.leaveGroupBySelf({
					to: this.currentName,
					roomId: this.roomId,
					success: function(){
						uni.showToast({
							title: "已退",
							duration: 2000,
							success: function(res){
								// redirectTo = 此操作不可返回
								setTimeout(() => uni.navigateBack({
									url: "../groups/groups?myName=" + me.currentName
								}), 2000);
							},
						});
						disp.fire("em.xmpp.invite.deleteGroup");//退群
					},
					error: function(err){
						uni.showToast({
							title: err.data.error_description,
						});
					}
				});
			},
			
			dissolveGroup(){
				var me = this;
				// 解散一个群组
				this.$im.conn.dissolveGroup({
					groupId: this.roomId,
					success: function(){
						uni.showToast({
							title: "已解散",
							duration: 2000,
							success: function(res){
								// redirectTo = 此操作不可返回
								setTimeout(() => uni.navigateBack({
									url: "../groups/groups?myName=" + me.currentName
								}), 2000);
							},
						});
					},
					error: function(err){
						uni.showToast({
							title: err.data.error_description,
						});
					},
				});
			}
		}
	}
</script>

<style>
.group-wrap{
	height: 100%;
	background-color: #CFCFCF;
}
.wrap{
	border-radius:3px;
	background: #fff;
	height:100%;
}
.border-bottom{
	border-bottom: 1px solid #e1e1e1;
}
.pd-10{
	padding-left:10px;
}
text{
	font-size: 14px;
}
.group-name{
	width: 100%;
	height: 40px;
    line-height: 40px;
    border-top: 1px solid #cfcfcf;
}
.group-name .item-name{
	float: right;
	margin-right:10px;
	color: #ccc;
	font-size: 14px;
}
.invite-member,.group-member{
    border-top: 1px solid #cfcfcf;
}

.group-member .member-list{
	padding-left: 10px;
	font-size: 14px;
	height: 30px;
	line-height: 30px;
	color: #ccc;
}
.invite-member .invite-wrap input{
    display:inline-block;
    width: calc(100% - 80px);
    height:40px;
    line-height:40px;
    font-size:14px;
    border:1px solid #e1e1e1;
    border-radius:4px;
    padding: 0 8px;
    box-sizing: border-box;
}
.invite-wrap{
    padding: 0 10px 0 10px;
    box-sizing: border-box;
    margin-bottom:6px;
}
.invite-member .invite-wrap button{
    float:right;
    width: 70px;
    height:40px;
    line-height:40px;
    font-size:14px;
}
.invite-title{
	display: block;
	height: 35px;
	line-height: 35px;
}
.black-list{
	height: 40px;
	line-height: 40px;
}
.disband-group{
	padding:0 8px;
	height: 40px;
	line-height: 40px;
}
.exit-group{
	padding:0 8px;
}
.bottom-wrap{
	position:fixed;
	bottom:10px;
	width:100%;
	z-index: 2;
}

</style>
