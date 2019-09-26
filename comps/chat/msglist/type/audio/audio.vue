<template>
	<view class="audio-player" @tap="audioPlay" :style="{opacity: opcity}">
		<text class="time">{{ time }}</text>
		<view class="controls play-btn">
			<image :src="style == 'self'? '/static/images/voicemsgmy.png' : '/static/images/voicemsg.png'"></image>
		</view>
		<!-- <view
			class="controls pause-btn"
			wx:if="{{ curStatus == playStatus.PLAYING }}"
			bind:tap="audioPause">
			<image bind:tap="audioPause" src="../../../../../images/audioPause.png"></image>
		</view> -->
	</view>
	
</template>

<script>
	let audioCtxFc = require("./audioCtxFactory");
	let playStatus = require("./playStatus");
	// if (uni.setInnerAudioOption) {
	//   uni.setInnerAudioOption({
	//     obeyMuteSwitch: false,
	//     autoplay: true
	//   })
	// }else {
	  // myaudio.obeyMuteSwitch = false;
	  // myaudio.autoplay = true;
	// }
	export default {
		components: {
			
		},
		props: {
			msg: {
				type: Object,
				val: {}
			},
		},
		data() {
			return {
				playStatus: playStatus,
				curStatus: playStatus.STOP,
				style: '',
				time: "0'",
				opcity: 1,
				comps: {
					audioCtx: null,
				},
				inter: ()=>{},
				onPlaying: ()=>{},
				onPause: ()=>{},
				onDone: ()=>{},
				onTimeUpdate: ()=>{},
				onWait: ()=>{}
			}
		},
		beforeMount(){
			this.time = this.msg.msg.length + "''";
			this.style = this.msg.style;
		},
		beforeDestroy() {
			let audioCtx = this.comps.audioCtx = audioCtxFc.getCtx(this.msg.mid);
			this.audioPause(audioCtx);
			this.delEvent();
		},
		created() {
			
		},
		
		onReady() {
			let self = this
			let curl = ''
			let audioCtx = this.comps.audioCtx = audioCtxFc.getCtx(this.msg.mid);
			
			audioCtx.autoplay = false;
			audioCtx.loop = false;
			//
			this.onPlaying = () => {
				//console.log("onPlaying", JSON.stringify(this.data));
				this.curStatus = playStatus.PLAYING
				this.inter && clearInterval(this.inter)
				this.inter = setInterval(() => {
					let opcity = this.opcity;
					this.opcity = opcity == 1 ? 0.4 : 1
				}, 500)
			};
			this.onPause = () => {
				// console.log("onPause", JSON.stringify(this.data));
				// 第二次播放会立即抛出一个异常的 onPause
				if(parseInt(this.time, 10) < 1){
					return;
				}
				this.curStatus = playStatus.PAUSE;
				this.opcity = 1
			};
			this.onDone = () => {
				// console.log("onDone", JSON.stringify(this.data));

				this.curStatus = playStatus.STOP
				this.opcity = 1

				clearInterval(this.inter)
			};
			// 多次播放会丢失这个回调
			this.onTimeUpdate = () => {
				this.time = (audioCtx.currentTime >> 0) + "'"
			};
			this.onWait = () => {
				uni.showToast({
					title: "下载中...",
					duration: 1000
				});
			}
			this.addEvent();
		},
		methods: {
			audioPlay(){
				let me = this;
				console.log(this.inter);
				this.inter && clearInterval(this.inter)
				let audioCtx = this.comps.audioCtx;
				var curl = ''
				
				
				if (this.msg.msg.local_url) {
					
					audioCtx.src = this.msg.msg.local_url;
					audioCtx.play();
				}else {
					uni.downloadFile({
						url: this.msg.msg.data,
						header: {
							"X-Requested-With": "XMLHttpRequest",
							Accept: "audio/mp3",
							Authorization: "Bearer " + this.msg.msg.token
						},
						success(res){
							curl = res.tempFilePath;
							me.msg.msg.local_url = res.tempFilePath;
							audioCtx.src = curl;
							audioCtx.play();
						},
						fail(e){
							console.log("downloadFile failed", e);
							uni.showToast({
								title: "下载失败",
								duration: 1000
							});
						}
					});
				}
				
			},
			
			audioPause(auCtx){
				//let audioCtx = this.data.__comps__.audioCtx;
				let audioCtx = this.comps.audioCtx = audioCtxFc.getCtx(this.msg.mid) || auCtx
				audioCtx&&audioCtx.pause();
			},
			
			addEvent(){
				let audioCtx = this.comps.audioCtx;
				audioCtx.onPlay(this.onPlaying);
				audioCtx.onPause(this.onPause);
				audioCtx.onWaiting(this.onPause);
				audioCtx.onStop(this.onDone);
				audioCtx.onEnded(this.onDone);
				audioCtx.onError(this.onDone);
				audioCtx.onWaiting(this.onWait)
			
				//audioCtx.onTimeUpdate(this.onTimeUpdate);
			},
			
			delEvent(){
				let audioCtx = this.comps.audioCtx;
				audioCtx.offPlay(this.onPlaying);
				audioCtx.offPause(this.onPause);
				audioCtx.offWaiting(this.onPause);
				audioCtx.offStop(this.onDone);
				audioCtx.offEnded(this.onDone);
				audioCtx.offError(this.onDone);
				audioCtx.offWaiting(this.onWait)
				// 多次播放会丢失这个回调，所以不用卸载
				// audioCtx.offTimeUpdate(this.onTimeUpdate);
			},
		}
	}
</script>

<style>
	.audio-player {
		position: relative;
		overflow: hidden;
		display: flex;
		transition: opacity .5s;
	}
	
	.audio-player .controls {
		height:40rpx;
		align-items:center;
		display:flex;
	}
	
	.audio-player .controls image {
		height: 48rpx;
		width: 30rpx;
		margin: 0 8rpx 0 100rpx;
	}
	
	.audio-player .time {
		font-size: 30rpx;
		line-height: 40rpx;
		flex: 1;
		text-align: left;
	}
	
</style>
