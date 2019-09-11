<template>
	<view
		scroll-y="true"
		:class="view"
		class="wrap"
		@tap="onTap"
		@scroll="scrollmore"
		@scrolltoupper="refresh"
		upper-threshold='-50'
		:scroll-into-view="toView">
		<view class="message" v-for="item in chatMsg" :key="item.mid" :id="item.mid">
			<!-- <view class="time">
				<text class="time-text">{{ item.time }}</text>
			</view> -->
			<view class="main" :class="item.style">
				<view class="user">
					<!-- yourname：就是消息的 from -->
					<text class="user-text">{{ item.yourname + ' ' + item.time}}</text>
				</view>
				<image class="avatar" src="/static/images/theme@2x.png"/>
				<view class="msg">
					<image
					class="err" :class="(item.style == 'self' && item.isFail) ?  'show' : 'hide'"
					src="/static/images/msgerr.png"/>
	
					<image v-if="item.style == 'self'" src="/static/images/poprightarrow@2x.png" class="msg_poprightarrow"/>
					<image v-if="item.style == ''" src="/static/images/popleftarrow@2x.png" class="msg_popleftarrow"/>
					<view v-if="item.msg.type == 'img' || item.msg.type == 'video'">
						
						
						<image  v-if="item.msg.type == 'img'"
								class="avatar"
								:src="item.msg.data"
								style="width:90px; height:120px; margin:2px auto;"
								mode="aspectFit"
								@tap="previewImage"
								:data-url="item.msg.data" />
						<video v-if="item.msg.type == 'video'" :src="item.msg.data" controls autoplay />
					</view>
					<audio-msg
						v-if="item.msg.type == 'audio'"
						:msg="item"></audio-msg>
					<view v-else-if="item.msg.type == 'txt' || item.msg.type == 'emoji'">
						<view class="template" v-for="(d_item, d_index) in item.msg.data" :key="d_index">
							<text v-if="item.msg.type == 'txt'"  class="msg-text" style="float:left;">{{ d_item.data }}</text>
							
							<image  v-if="item.msg.type == 'emoji'"
									class="avatar"
									:src="'/static/images/faces/' + item.data"
									style="width:25px; height:25px; margin:0 0 2px 0; float:left;" />
						</view>
						
					</view>
				</view>
			</view>
		</view>
	</view>
	<!-- <view style="height: 1px;"></view> -->
</template>

<script>
	import audioMsg from "@/comps/chat/msglist/type/audio/audio.vue";
	
	let msgStorage = require("../msgstorage");
	let disp = require("../../../utils/broadcast");
	let LIST_STATUS = {
		SHORT: "scroll_view_change",
		NORMAL: "scroll_view"
	};
	let page = 0;
	let Index = 0;
	let curMsgMid = ''
	let isFail = false
	export default {
		components: {
			audioMsg
		},
		props: {
			username: {
				type: Object,
				value: {},
			},
		},
		data() {
			return {
				view: LIST_STATUS.NORMAL,
				toView: "",
				chatMsg: [],
				visibility: false,
			}
		},
		beforeMount(){
			this.visibility = true;
			page = 0;
			Index = 0;
		},
		beforeDestroy() {
			this.visibility = false;
		},
		created() {
			
		},
		
		onReady() {
			let me = this;
			
			let username = this.username;
			let myUsername = uni.getStorageSync("myUsername");
			
			let sessionKey = username.groupId
				? username.groupId + myUsername
				: username.your + myUsername;
			
			let chatMsg = uni.getStorageSync(sessionKey) || [];
			this.renderMsg(null, null, chatMsg, sessionKey);
			uni.setStorageSync(sessionKey, null);
			
			
			disp.on('em.xmpp.error.sendMsgErr', function(err) {
				curMsgMid = err.data.mid
				isFail = true
				return
			});
			
			msgStorage.on("newChatMsg", function(renderableMsg, type, curChatMsg, sesskey){
				me.curChatMsg = curChatMsg;
				if(!me.visibility) return;
				// 判断是否属于当前会话
				if(username.groupId){
					// 群消息的 to 是 id，from 是 name
					if(renderableMsg.info.from == username.groupId || renderableMsg.info.to == username.groupId){
						if (sesskey == sessionKey) {
							me.renderMsg(renderableMsg, type, curChatMsg, sessionKey, 'newMsg');
						}
						
					}
				}
				else if(renderableMsg.info.from == username.your || renderableMsg.info.to == username.your){
					if (sesskey == sessionKey) {
						me.renderMsg(renderableMsg, type, curChatMsg, sessionKey, 'newMsg');
					}
				}
			
			});
		},
		methods: {
			normalScroll(){
				this.view = LIST_STATUS.NORMAL
			},
			
			shortScroll(){
				this.view = LIST_STATUS.SHORT
			},
			
			onTap(){
				// console.log('onTap');
				this.$emit('msglistTap');
				// this.triggerEvent("msglistTap", null, { bubbles: true });
			},
			
			previewImage(event){
				var url = event.target.dataset.url;
				uni.previewImage({
					urls: [url]		// 需要预览的图片 http 链接列表
				});
			},
			
			getHistoryMsg(){
				console.log('getHistoryMsg');
				return;
				let me = this
				let username = this.data.username;
				let myUsername = wx.getStorageSync("myUsername");
				let sessionKey = username.groupId ? username.groupId + myUsername : username.your + myUsername;
				let historyChatMsgs = wx.getStorageSync("rendered_" + sessionKey) || [];
			
				if (Index < historyChatMsgs.length) {
					let timesMsgList = historyChatMsgs.slice(-Index-10, -Index)
			
					this.setData({
						chatMsg: timesMsgList.concat(me.data.chatMsg),
						toView: timesMsgList[timesMsgList.length - 1].mid,
					});
					Index += timesMsgList.length;
					if (timesMsgList.length == 10) {
						page ++
					}
					wx.stopPullDownRefresh()
				}
			},
			renderMsg(renderableMsg, type, curChatMsg, sessionKey, isnew){
				let me = this
				if (curChatMsg.length > 1) {
					this.chatMsg.map(function(elem, index) {
						curChatMsg.map(function(item, i) {
							if(elem.mid == item.mid){
								//me.data.chatMsg.splice(index, 1)
								curChatMsg.splice(i, 1)
							}
						})
					})
				}
				
			
				var historyChatMsgs = uni.getStorageSync("rendered_" + sessionKey) || [];
				
				historyChatMsgs = historyChatMsgs.concat(curChatMsg);
			
				//console.log('当前历史',renderableMsg)
				//console.log('历史消息', historyChatMsgs)
				if(!historyChatMsgs.length) return;
				if (isnew == 'newMsg') {
					this.chatMsg = this.chatMsg.concat(curChatMsg)
					this.toView = historyChatMsgs[historyChatMsgs.length - 1].mid
				}else{
					this.chatMsg = historyChatMsgs.slice(-10)
					this.toView = historyChatMsgs[historyChatMsgs.length - 1].mid
				}
				
				uni.setStorageSync("rendered_" + sessionKey, historyChatMsgs);
			
				let chatMsg = uni.getStorageSync(sessionKey) || [];
				chatMsg.map(function(item, index) {
					curChatMsg.map(function(item2, index2) {
						if (item2.mid == item.mid) {
							chatMsg.splice(index, 1)
						}
					})
				})
				
			
				uni.setStorageSync(sessionKey, chatMsg);
				Index = historyChatMsgs.slice(-10).length;
				uni.pageScrollTo({
				  	scrollTop: 9999,
				})
			
				if (isFail) {
					this.renderFail(sessionKey)
				}
			},
			
			renderFail(sessionKey){
				let me = this
				let msgList = me.chatMsg
				msgList.map((item) =>{
					if (item.mid.substring(item.mid.length - 10) == curMsgMid.substring(curMsgMid.length - 10)) {
						item.msg.data[0].isFail = true
						item.isFail = true
						me.chatMsg = msgList
					}
				})
				if (me.curChatMsg[0].mid == curMsgMid) {
					me.curChatMsg[0].msg.data[0].isShow = false;
					me.curChatMsg[0].isShow = false
				}
				uni.setStorageSync("rendered_" + sessionKey, msgList);
				isFail = false
			}
		}
	}
</script>

<style>
	/*.chat-bg{
		position:fixed;
		width: 100%;
		height: 100%;
		z-index: 0;
		top: 50px;
	}*/
	.scroll_view,
	.scroll_view_change {
		/*width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 150rpx;*/
		margin-bottom: 174rpx;
		background-color: #FAFAFA;
	}
	
	.scroll_view_X,
	.scroll_view_change_X{
		margin-bottom: 244rpx;
	}
	
	.scroll_view_change {
		/*bottom: 440rpx;*/
		margin-bottom: 590rpx;
	}
	
	.message {
		width: 92%;
		height: auto;
		padding: 0 30rpx;
		position: relative;
	
	}
	
	.time {
		margin: 14rpx 0;
		text-align: center;
	}
	
	.time .time-text {
		display: inline-block;
		padding: 6rpx 20rpx 0 20rpx;
		font-size: 24rpx;
		color: #fff;
		line-height: 28rpx;
		border-radius: 4rpx;
		background-color: #dcdcdc;
	}
	
	.user .user-text {
		margin: auto 100rpx 8rpx;
		font-size: 20rpx;
		color: #dcdcdc;
		display: block;
	}
	
	.avatar {
		width: 72rpx;
		height: 72rpx;
		margin: 0 20rpx 0 0;
		border-radius: 6rpx;
		float: left;
	}
	
	.msg {
		display: inline-block;
		padding: 20rpx;
		max-width: calc(85% - 80rpx);
		min-height: 40rpx; 
		font-size: 24rpx;
		/*overflow: hidden;*/
		text-align: left;
		word-break: break-all;
		background-color: #fff;
		border-radius: 26rpx;
		position: relative;
		margin-top: 24rpx;
	}
	
	.msg .msg_poprightarrow {
		position: absolute;
		right: -10rpx;
		height: 18rpx;
		width: 18rpx;
		margin-top: -10rpx;
	}
	
	.msg .msg_popleftarrow{
		position:absolute;
		left: -14rpx;
		height: 18rpx;
		width: 18rpx;
		margin-top: -10rpx;
	}
	
	.msg .msg-text {
		line-height: 40rpx;
		font-size: 32rpx;
		margin: 0;
	}
	
	/*.msg:before {
		content: " ";
		position: absolute;
		top: 9px;
		right: 100%;
		border: 6px solid transparent;
		border-right-color: #EDEDED;
	}*/
	
	.self {
		text-align: right;
	}
	
	.self .avatar {
		float: right;
		margin: 0 0 0 20rpx;
	}
	
	.user {
		position: relative;
		bottom: -30rpx;
	}
	
	.self .msg {
		background-color: #0873DE;
		color: #fff;
	}
	
	.self .msg:before {
		right: inherit;
		left: 100%;
		border-right-color: transparent;
		border-left-color: #b2e281;
	}
	
	.template {
		display: inline;
	}
	.err{
		width: 32rpx;
		height: 32rpx;
		position: absolute;
		left: -40rpx;
	}
	.hide{
		display: none;
	}
	.show{
		display: block;
	}

</style>
