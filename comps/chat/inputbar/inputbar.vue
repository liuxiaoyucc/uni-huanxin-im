<template>
	<view class="room_bar">
		<chat-suit-emoji ref="emoji" @newEmojiStr="emojiAction"></chat-suit-emoji>
		<chat-suit-main ref="main" :username="username" :chatType="chatType" @inputBlured="inputBlured" @inputFocused="cancelEmoji"></chat-suit-main>
		<chat-suit-image ref="image" :username="username" :chatType="chatType"></chat-suit-image>

		
		<view class="other_func">
			
			<view class="v-record" @tap="toggleRecordModal">
				<image
					class="icon-record"
					:src="recordStatus != RecordStatus.HIDE ? '/static/images/iconAudioActive@2x.png' : '/static/images/voice.png'" style="width:16px; height: 24px"/>
			</view>
			<view class="open_emoji" @tap="openEmoji">
				<image src="/static/images/Emoji.png"/>
			</view>
			<view class="open_camera" @tap="openCamera">
				<image src="/static/images/camora.png" style="width:24px; height: 18px"/>
			</view>
			<view class="send_image" @tap="sendImage">
				<image src="/static/images/pic.png" style="height:20px; width: 20px"/>
			</view>
			
		</view>
	</view>
</template>

<script>
	let RecordStatus = require("./suit/audio/record_status").RecordStatus;
	let msgType = require("../msgtype");
	import chatSuitMain from "@/comps/chat/inputbar/suit/main/main.vue";
	import chatSuitEmoji from "@/comps/chat/inputbar/suit/emoji/emoji.vue";
	import chatSuitImage from "@/comps/chat/inputbar/suit/image/image.vue";
	
	export default {
		components: {
			chatSuitMain,
			chatSuitImage,
			chatSuitEmoji
		},
		props: {
			username: {
				type: Object,
				value: {}
			},
			chatType: {
				type: String,
				value: msgType.chatType.SINGLE_CHAT,
			},
		},
		data() {
			return {
				recordStatus: RecordStatus.HIDE,
				RecordStatus,
			}
		},
		created() {
			
		},
		
		onReady() {
			
		},
		methods: {
			inputBlured() {
				this.$emit('inputBlured');
			},
			toggleRecordModal(){
				this.$emit('tapSendAudio');
			},
			
			// sendVideo(){
			// 	this.data.__comps__.video.sendVideo();
			// },
			
			openCamera(){
				this.$refs.image.openCamera();
			},
			
			openEmoji(){
				this.$refs.emoji.openEmoji();
			},
			
			cancelEmoji(){
				this.$refs.emoji.cancelEmoji();
			},
			
			sendImage(){
				this.$refs.image.sendImage();
			},
			
			sendLocation(){
				// this.data.__comps__.location.sendLocation();
			},
			
			emojiAction(evt){
				this.$refs.main.emojiAction(evt.msg);
			},
		}
	}
</script>

<style>
	.room_bar {
		width: 100%;
		height: auto;
		border-top: 1px solid #CFCFCF;
		position: fixed;
		bottom: 0;
		right: 0;
		z-index: 1;
		background-color: #FFFFFF;
		transform: translateZ(1000px);
	}
	
	.other_func {
		width: 100%;
		height: 60rpx;
		display: flex;
	}
	.other_func_X{
		height: 128rpx;
	}
	
	.other_func image {
		width: 42rpx;
		height: 40rpx;
	}
	
	.open_emoji,
	.send_image,
	.open_camera,
	.v-record {
		width: 48rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 48rpx;
	}
	
	
	.v-record .icon-record {
		width: 18rpx;
		height: 40rpx;
	}
	.v-record{
		margin-left: 48rpx;
	}
	.open_camera, .send_image{
		margin-left: 64rpx;
	}
	
	

</style>
