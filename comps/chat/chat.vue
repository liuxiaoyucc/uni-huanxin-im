<template>
	<view>

		<view class="main">
			<chat-suit-audio
				id="chat-suit-audio"
				:username="username"
				:chatType="chatType"
				@newAudioMsg="saveSendMsg"></chat-suit-audio>
		
			<chat-msglist
				id="chat-msglist"
				:username="username"
				@msglistTap="normalScroll"></chat-msglist>
		</view>
			<chat-inputbar
				id="chat-inputbar"
				:username="username"
				:chatType="chatType"
		
				@newTextMsg="saveSendMsg"
				@newImageMsg="saveSendMsg"
				@newLocationMsg="saveSendMsg"
				@newVideoMsg="saveSendMsg"
				@tapSendAudio="toggleRecordModal"
		
				@inputFocused="shortScroll"
				@inputBlured="normalScroll"></chat-inputbar>
	</view>
	
	
</template>

<script>
	import chatMsglist from "@/comps/chat/msglist/msglist.vue";
	import chatInputbar from "@/comps/chat/inputbar/inputbar.vue"
	import chatSuitAudio from "@/comps/chat/inputbar/suit/audio/audio.vue"
	
	let msgStorage = require("./msgstorage");
	let msgType = require("./msgtype");
	export default {
		components: {
			chatMsglist,
			chatInputbar,
			chatSuitAudio
		},
		props: {
			username: {
				type: Object,
				value: {},
			},
			chatType: {
				type: String,
				value: msgType.chatType.SINGLE_CHAT,
			},
		},
		data() {
			return {
				
			}
		},
		created() {
			uni.$on('newTextMsg', (data)=>{
				this.saveSendMsg(data);
			})
		},
		beforeDestroy() {
			uni.$off('newTextMsg');
		},
		
		onReady() {
			
		},
		methods: {
			toggleRecordModal(){
				this.data.__comps__.audio.toggleRecordModal();
			},
			
			normalScroll(){
				this.data.__comps__.msglist.normalScroll();
				this.data.__comps__.inputbar.cancelEmoji();
			},
			
			shortScroll(){
				this.data.__comps__.msglist.shortScroll();
			},
			
			saveSendMsg(data){
				msgStorage.saveMsg(data.msg, data.type);
				// return;
				// this.data.__comps__.inputbar.cancelEmoji();
			},
			
			getMore(){
				this.selectComponent('#chat-msglist').getHistoryMsg()
			},
		}
	}
</script>

<style>
	.main {
		width: 100%;
		height: 100%;
	}
</style>
