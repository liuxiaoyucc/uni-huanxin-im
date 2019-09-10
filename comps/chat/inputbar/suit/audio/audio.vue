<template>
	<view v-if="recordStatus != RecordStatus.HIDE" class="modal modal-record" @tap="toggleRecordModal">
		
	</view>
</template>

<script>
	let msgType = require("../../../msgtype");
	let RECORD_CONST = require("./record_status");
	let RecordStatus = RECORD_CONST.RecordStatus;
	let RecordDesc = RECORD_CONST.RecordDesc;
	let disp = require("../../../../../utils/broadcast");
	let RunAnimation = false
	const InitHeight = [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
	
	export default {
		components: {
			
		},
		data() {
			return {
				changedTouches: null,
				recordStatus: RecordStatus.HIDE,
				RecordStatus,
				RecordDesc,		// 模板中有引用
				radomheight: InitHeight,
				recorderManager: uni.getRecorderManager(),
				recordClicked: false
			}
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

		onUnload() {
			
		},
		methods: {
			toggleRecordModal(){
				this.recordStatus = this.recordStatus == RecordStatus.HIDE ? RecordStatus.SHOW : RecordStatus.HIDE
				this.radomheight = InitHeight
			},
		}
	}
</script>

<style>
</style>
