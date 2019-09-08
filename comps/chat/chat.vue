<template>
	<view>
		<view>chat_comp</view>
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
	export default {
		components: {
			chatMsglist,
			chatInputbar,
			chatSuitAudio
		},
		props: {
			
		},
		data() {
			return {
				
			}
		},
		created() {
			
		},
		
		onReady() {
			
		},
		beforeMount(){
			
		},
		beforeDestroy() {
			
		},
		methods: {
			
		}
	}
</script>

<style>
	.main {
		width: 100%;
		height: 100%;
	}
</style>
