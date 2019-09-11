<template>
	<view>
		<!-- <view class="search" v-show="search_btn">
			<view @tap="openSearch">
				<icon type="search" size="12"></icon>
				<text>搜索</text>
			</view>
		</view> -->
		
		<!-- <view class="search_input" v-if="search_chats">
			<view>
				<icon type="search" size="12"></icon>
				<input placeholder="搜索" 
					placeholder-style="color:#9B9B9B;line-height:21px;font-size:15px;" 
					:focus="focus"
					confirm-type="search"
					type='text'
					@confirm="onSearch"
					@input="onInput"
					:value="input_code"
					></input>
					<icon type="clear" size="12" @tap.stop.prevent='clearInput' v-if="show_clear"></icon>
		
			</view>
			<text @tap="cancel">取消</text>
		</view> -->
		<view v-for="(item, index) in arr" :key="index" class="chat_list">
			<uni-swipe-action :options="options" @click.stop.prevent="action_click($event, item)">
				<view class="tap_mask" @tap.stop.prevent="into_chatRoom(item)">
					<view class="list_box">
						<view class="list_left" :data-username="item.username">
							<view class="list_pic">
								<image :src="(item.chatType == 'groupchat' || item.chatType == 'chatRoom')? '../../static/images/groupTheme.png':'../../static/images/theme@2x.png'"></image>
							</view>
							<view class="list_text">
								<text class="list_user">{{(item.chatType == 'groupchat' || item.chatType == 'chatRoom' || item.groupName)?item.groupName : item.username}}</text>
								<text class="list_word" v-if="item.msg.data[0].data">{{item.msg.data[0].data}}</text>
								<text class="list_word" v-if="item.msg.type == 'img'">[图片]</text>
								<text class="list_word" v-if="item.msg.type == 'audio'">[语音]</text>
							</view>
						</view>
						<view class="list_right">
							<text :data-username="item.username">{{item.time}}</text>
						</view>
						<view class="em-msgNum" v-if="item.unReadCount > 0 || item.unReadCount == '99+'">{{ item.unReadCount }}</view>
					</view>
				</view>
			</uni-swipe-action>
		</view>
		
		<view v-if="arr.length == 0" class="chat_noChat">
			当前没有历史聊天，添加一个好友开始聊天吧
		</view>

		<view style="height: 1px;"></view>
		
		
		<view class="mask" @tap="close_mask" v-if="show_mask"></view>
	</view>
</template>

<script>
	import uniSwipeAction from "@/comps/uni/uni-swipe-action/uni-swipe-action.vue"
	let disp = require("../../utils/broadcast");
	let isfirstTime = true

	export default {
		components: {
			uniSwipeAction
		},
		data() {
			return {
				focus: false,
				search_btn: true,
				search_chats: false,
				show_mask: false,
				yourname: "",
				unReadSpotNum: 0,
				unReadNoticeNum: 0,
				messageNum: 0,
				unReadTotalNotNum: 0,
				arr: [],
				show_clear: false,
				
				gotop: false,
				input_code: '',
				
				options: [{
					text: '置顶'
				}, {
					text: '标记为已读',
					style: {
						backgroundColor: 'rgb(254,156,1)'
					}
				}, {
					text: '删除',
					style: {
						backgroundColor: 'rgb(255,58,49)'
					}
				}],
			}
		},
		onLoad() {
			
			let me = this;
			//监听加好友申请
			disp.on("em.xmpp.subscribe", function(){
				me.messageNum = getApp().globalData.saveFriendList.length;
				me.unReadTotalNotNum = getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length;
			});
			
			//监听解散群
			disp.on("em.xmpp.invite.deleteGroup", function(){
				me.listGroups();
				me.getRoster();
				me.arr = me.getChatList();
				me.messageNum = getApp().globalData.saveFriendList.length;
			});
			
			//监听未读消息数
			disp.on("em.xmpp.unreadspot", function(message){
				me.arr = me.getChatList();
				me.unReadSpotNum = getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum;
			});
			
			//监听未读加群“通知”
			disp.on("em.xmpp.invite.joingroup", function(){
				me.unReadNoticeNum = getApp().globalData.saveGroupInvitedList.length;
				me.unReadTotalNotNum = getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length
			});
			
			disp.on("em.xmpp.contacts.remove", function(){
				me.getRoster();
				// me.setData({
				// 	arr: me.getChatList(),
				// 	unReadSpotNum: getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum,
				// });
			});
			
			this.getRoster();
			
		},
		onShow(){
			this.arr = this.getChatList();
			this.unReadSpotNum = getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum;
			this.messageNum = getApp().globalData.saveFriendList.length;
			this.unReadNoticeNum = getApp().globalData.saveGroupInvitedList.length;
			this.unReadTotalNotNum = getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length;
		},
		methods: {
			openSearch(){
				this.search_btn = false;
				this.search_chats = true;
				this.gotop = true;
				setTimeout(()=> { //加适当延迟,避免focus时软键盘闪退
					this.focus = true;
				}, 300);
			},
			
			onSearch(val){
				let searchValue = val.detail.value
				let chartList = this.getChatList();
				let searchList = [];
				chartList.forEach((item, index)=>{
					if(String(item.username).indexOf(searchValue) != -1){
						searchList.push(item)
					}
				})
				
				this.arr = searchList
			},
			
			cancel(){
				this.search_btn = true;
				this.search_chats = false;
				this.gotop = false;
				this.focus = false;
				this.arr = this.getChatList();
				this.unReadSpotNum = getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum;
			},
			clearInput(){
				this.input_code = '';
				this.show_clear = false;
			},
			
			onInput(e){
				let inputValue = e.detail.value
				if (inputValue) {
					this.show_clear = true;
				} else {
					this.show_clear = false;
				}
			},
			getRoster() {
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

						me.listGroups()
						
						disp.fire("em.main.ready");
						me.arr = me.getChatList();
						me.unReadSpotNum = getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum
					},
					error(err){
						console.log(err);
					}
				};
				this.$im.conn.getRoster(rosters);
			},
			listGroups(){
				var me = this;
				return this.$im.conn.listRooms({
					success: function(rooms){
						uni.setStorage({
							key: "listGroup",
							data: rooms
						});
						me.getChatList()
					},
					error: function(err){
						console.log(err)
					}
				});
			},
			
			getChatList(){
				var array = [];
				var member = uni.getStorageSync("member");
				var myName = uni.getStorageSync("myUsername");
				var listGroups = uni.getStorageSync('listGroup')|| [];
				for(let i = 0; i < member.length; i++){
					let newChatMsgs = uni.getStorageSync(member[i].name + myName) || [];
					let historyChatMsgs = uni.getStorageSync("rendered_" + member[i].name + myName) || [];
					let curChatMsgs = historyChatMsgs.concat(newChatMsgs);
			
					if(curChatMsgs.length){
						let lastChatMsg = curChatMsgs[curChatMsgs.length - 1];
						lastChatMsg.unReadCount = newChatMsgs.length;
						if(lastChatMsg.unReadCount > 99) {
							lastChatMsg.unReadCount = "99+";
						}
						let dateArr = lastChatMsg.time.split(' ')[0].split('-')
						let timeArr = lastChatMsg.time.split(' ')[1].split(':')
						let month = dateArr[2] < 10 ? '0' + dateArr[2] : dateArr[2]
						lastChatMsg.dateTimeNum = `${dateArr[1]}${month}${timeArr[0]}${timeArr[1]}${timeArr[2]}`
						lastChatMsg.time = `${dateArr[1]}月${dateArr[2]}日 ${timeArr[0]}时${timeArr[1]}分`
						array.push(lastChatMsg);
					}
				}
				for(let i = 0; i < listGroups.length; i++){
					let newChatMsgs = uni.getStorageSync(listGroups[i].roomId + myName) || [];
					let historyChatMsgs = uni.getStorageSync("rendered_" + listGroups[i].roomId + myName) || [];
					let curChatMsgs = historyChatMsgs.concat(newChatMsgs);
					if(curChatMsgs.length){
						let lastChatMsg = curChatMsgs[curChatMsgs.length - 1];
						lastChatMsg.unReadCount = newChatMsgs.length;
						if(lastChatMsg.unReadCount > 99) {
							lastChatMsg.unReadCount = "99+";
						}
						let dateArr = lastChatMsg.time.split(' ')[0].split('-')
						let timeArr = lastChatMsg.time.split(' ')[1].split(':')
						let month = dateArr[2] < 10 ? '0' + dateArr[2] : dateArr[2]
						lastChatMsg.time = `${dateArr[1]}月${dateArr[2]}日 ${timeArr[0]}时${timeArr[1]}分`
						lastChatMsg.dateTimeNum = `${dateArr[1]}${month}${timeArr[0]}${timeArr[1]}${timeArr[2]}`
						lastChatMsg.groupName = listGroups[i].name
						array.push(lastChatMsg);
					}
				}
				
				//	测试列表
				
				// for (let i = 0; i < 12; i++) {
				// 	let newSESSION = {
				// 		info: {from: "zdtest", to: "zdtest2"},
				// 		mid: "txtWEBIM_427ab8b10c",
				// 		unReadCount: 6,
				// 		msg: {type: "txt", data: [{data: "丢晚高丢完", type: "txt"}]},
				// 		style: "self",
				// 		time: "2019-2-18 16:59:25",
				// 		username: "zdtest" + i,
				// 		yourname: "zdtest"
				// 	}
				// 	let dateArr = newSESSION.time.split(' ')[0].split('-')
				// 	let timeArr = newSESSION.time.split(' ')[1].split(':')
				// 	newSESSION.time = `${dateArr[1]}月${dateArr[2]}日 ${timeArr[0]}时${timeArr[1]}分`
				// 	array.push(newSESSION)
				// }
				
				array.sort((a, b) => {
					return b.dateTimeNum - a.dateTimeNum
				})
				return array;
			},
			
			into_chatRoom(item){
				let detail = item;
				
				//↓↓↓↓ 谁赞成谁反对?
				//群聊的chatType居然是singlechat？脏数据？ 等sdk重写后整理一下字段
				if (detail.chatType == 'groupchat' || detail.chatType == 'chatRoom' || detail.groupName) {
					this.into_groupChatRoom(detail)
				} else {
					this.into_singleChatRoom(detail)
				}
			},
			
			//	单聊
			into_singleChatRoom(detail){
				var my = uni.getStorageSync("myUsername");
				var nameList = {
					myName: my,
					your: detail.username
				};
				uni.navigateTo({
					url: "../chatroom/chatroom?username=" + JSON.stringify(nameList)
				});
			},
			
			//	群聊 和 聊天室 （两个概念）
			into_groupChatRoom(detail){
				var my = uni.getStorageSync("myUsername");
				var nameList = {
					myName: my,
					your: detail.groupName,
					groupId: detail.info.to
				};
				uni.navigateTo({
					url: "../groupChatRoom/groupChatRoom?username=" + JSON.stringify(nameList)
				});
			},
			
			action_click(e, item) {
				switch (e.index){
					case 2:
						this.del_chat(item);
						break;
					default:
						break;
				}
			},
			
			del_chat(item){
				
				let detail = item;
				let nameList;
				if (detail.chatType == 'groupchat' || detail.chatType == 'chatRoom') {
					nameList = {
						your: detail.info.to
					};
				} else {
					nameList = {
						your: detail.username
					};
				}
			
				var myName = uni.getStorageSync("myUsername");
				var currentPage = getCurrentPages();
				
				
				uni.showModal({
					title: "",
					content: "删除该聊天记录?",
					confirmText: "删除",
					success: function(res){
						if(res.confirm){
							uni.setStorageSync(nameList.your + myName, "");
							uni.setStorageSync("rendered_" + nameList.your + myName, "");
							if(currentPage[0]){
								currentPage[0].onShow();
							}
							disp.fire("em.chat.session.remove");
						}
					},
					fail: function(err){
					}
				});
			},
			
		}
	}
</script>

<style>
	@import '../../common/css/pages/chat.css';
</style>
