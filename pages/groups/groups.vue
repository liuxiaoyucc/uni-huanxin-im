<template>
	<view>
		<view class="search_input" v-if="search_friend">
			<view>
				<icon type="search" size="13"></icon>
				<input placeholder="搜索" placeholder-style="color:#CFCFCF;line-height:20px;font-size:12px;"></input>
			</view>
			<text @tap="cancel">取消</text>
		</view>
		<view class="contain">
			<view class="build_group" @tap="build_group">
				<image src="/static/images/chat-list.png"></image>
				<text>新建群聊</text>
			</view>
			<!-- <view class="add_group">
				<image src="/static/images/cell_groups.png"></image>
				<text>添加公开群</text>
			</view> -->
			<!-- <view class="line"></view> -->
			<!-- 群聊列表 -->
			<view v-for="item in groupList" class="groupList" :key="item.roomId">
				<view class="nbr_header"></view>
				<view class="info" @tap="edit_group">
					<image src="/static/images/number.png"  :data-username="item.name"></image>
				</view>
				<view class="nbr_body" :data-username="item.name" :data-roomid="item.roomId" @tap="into_room">
					<text :data-username="item.name">{{ item.name }}</text>
				</view>
				<view class="edit" @tap="edit_group" :data-username="item.name" :data-roomid="item.roomId">
					<image src="/static/images/cell_groups.png"  :data-username="item.name"></image>
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
				search_btn: true,
				search_friend: false,
				show_mask: false,
				groupList: [],		// 群聊列表
				myName: ""
			}
		},
		onLoad(options) {
			let me = this;
			disp.on("em.xmpp.invite.joingroup", function(){
				var pageStack = getCurrentPages();
				// 判断是否当前路由是本页
				if(pageStack[pageStack.length - 1].route === me.route){
					me.listGroups();
				}
			});
			
			disp.on("em.xmpp.invite.deleteGroup", function(){
				var pageStack = getCurrentPages();
				// 判断是否当前路由是本页
				if(pageStack[pageStack.length - 1].route === me.route){
					me.listGroups();
				}
			});
			
			this.myName = options.myName;
			console.log(this.myName);
		},
		onShow() {
			this.listGroups();
		},
		methods: {
			listGroups(){
				var me = this;
				this.$im.conn.listRooms({
					success: function(rooms){
						me.groupList = rooms
						// 好像也没有别的官方通道共享数据啊
						getApp().globalData.groupList = rooms || [];
					},
					error: function(){
			
					}
				});
			},
			
			openSearch(){
				this.search_btn = false
				this.search_friend = true
				this.show_mask = true
			},
			
			cancel(){
				this.search_btn = true
				this.search_friend = false
				this.show_mask = false
			},
			
			close_mask(){
				this.search_btn = true
				this.search_friend = false
				this.show_mask = false
			},
			
			into_room(event){
				var nameList = {
					myName: this.myName,
					your: event.currentTarget.dataset.username,
					groupId: event.currentTarget.dataset.roomid
				};
				uni.navigateTo({
					url: "../groupChatRoom/groupChatRoom?username=" + JSON.stringify(nameList)
				});
			},
			
			build_group(){
				var me = this;
				var nameList = {
					myName: me.myName
				};
				uni.navigateTo({
					url: "../add_groups/add_groups?owner=" + JSON.stringify(nameList)
				});
			},
			
			edit_group(event){
				var nameList = {
					myName: this.myName,
					groupName: event.currentTarget.dataset.username,
					roomId: event.currentTarget.dataset.roomid
				};
				uni.navigateTo({
					url: "../groupSetting/groupSetting?groupInfo=" + JSON.stringify(nameList)
				});
			}
		}
	}
</script>

<style>
.search,.search_input {
	width: 100%;
	height: 40px;
	background-color: #CFCFCF;
	display: flex;
	align-items: center;
	position: fixed;
	top:0;
	left:0;
}
.search {
	justify-content:space-around;
}
.search_input {
	justify-content:space-around;
}
.search view, .search_input view {
	height: 28px;
	line-height: 40px;
	background-color: #ffffff;
	border-radius: 5px;
	text-align: center;
	display: flex;
	align-items: center;
}
.search view {
	width: calc(100% - 12px);
	justify-content:center;
}
.search image {
	display: block;
	width: 6%;
	height: 53%;
	margin-right: 5px;
}
.search_input view {
	padding-left: 10px;
}
.search icon,.search_input icon {
	display: inline-block;
	margin: 13px 4px 0 0;
	height: 26px;
	line-height: 26px;
}
.search text {
	font-size: 12px;
	color: #CFCFCF;
}
.search_input view {
	width: 80%;
	text-align: left;
	margin-right: -10px;
}
.search_input text {
	display: inline-block;
	width: 40px;
	height: 30px;
	line-height: 30px;
	font-size: 16px;
	color:#7B68EE;
	text-align: right;
}
.search_input input {
	font-size: 14px;
	width: 90%;
}
.mask {
	background-color: black;
	opacity: 0.4;
	position: absolute;
	top: 40px;
	left: 0;
	right: 0;
	bottom: 0;
}
.contain {
	width: 100%;
	height: auto;
	/* margin-top: 40px; */
}
.build_group,.add_group {
	width: 100%;
	height: 45px;
	display: flex;
	align-items: center;
}
.build_group {
	border-bottom: 1px solid rgba(173,185,193,0.5);
}
.build_group image {
	width: 8%;
	height: 50%;
	margin:0 10px 0 10px;
}
.add_group image {
	width: 12%;
	height: 100%;
	margin:0 2px 0 2px;
}
.build_group text,.add_group text {
	font-size:14px;
}
.line {
	width: 100%;
	height: 15px;
	background-color: rgba(173,185,193,0.5);
}
.groupList {
	width: 100%;
	height: 50px;
}
.nbr_header {
	height: 1px;
	background-color: #D4D4D4;
	line-height: 20px;
	padding-left: 16px;
}
.nbr_body {
	width: 70%;
	height: 50px;
	display: inline-block;
	font-size: 16px;
	line-height: 50px;
	margin-right: 0;
	float: left;
}
.mask {
	background-color: black;
	opacity: 0.4;
	position: absolute;
	top: 40px;
	left: 0;
	right: 0;
	bottom: 0;
}
.edit {
	margin: 6px 10px 0 0;
	width: 30px;
	height: 35px;
	float: right;
}
.edit image {
	width: 39px;
	height: 39px;
}
.info {
	margin-top: 5px;
	width: 12%;
	height: 40px;
	display: inline-block;
	float: left;
}
.info image {
	width: 68%;
	height: 70%;
	display: inline-block;
	margin: 6px auto auto 6px;
}

</style>
