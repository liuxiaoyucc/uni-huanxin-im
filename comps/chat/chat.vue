<template>
	<view>

		<view class="main">
			<chat-suit-audio
				ref="audio"
				:username="username"
				:chatType="chatType"
				@newAudioMsg="saveSendMsg"></chat-suit-audio>
		
			<chat-msglist
				ref="msglist"
				:username="username"
				@msglistTap="normalScroll"></chat-msglist>
		</view>
			<chat-inputbar
				ref="inputbar"
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
			uni.$on('saveSendMsg', (data)=>{
				this.saveSendMsg(data);
			})
		},
		beforeDestroy() {
			uni.$off('saveSendMsg');
		},
		
		onReady() {
			
		},
		methods: {
			toggleRecordModal(){
				this.$refs.audio.toggleRecordModal();
			},
			
			normalScroll(){
				this.$refs.msglist.normalScroll();
				this.$refs.inputbar.cancelEmoji();
			},
			
			shortScroll(){
				this.$refs.msglist.shortScroll();
			},
			
			saveSendMsg(data){
				msgStorage.saveMsg(data.msg, data.type);
				// return;
				// this.data.__comps__.inputbar.cancelEmoji();
			},
			
			getMore(){
				this.$refs.msglist.getHistoryMsg()
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
