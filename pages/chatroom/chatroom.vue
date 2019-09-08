<template>
	<view>
		<chat id="chat" :username="username" chatType="singleChat"></chat>
	</view>
</template>

<script>
	import chat from "@/comps/chat/chat.vue";
	let disp = require("../../utils/broadcast");
	
	
	export default {
		components: {
			chat
		},
		data() {
			return {
				username: {
					your: "",
				},
			}
		},
		onLoad(options) {
			let username = JSON.parse(options.username);
			this.username = username;
			uni.setNavigationBarTitle({
				title: username.your
			});
		},
		onUnload() {
			disp.fire("em.chatroom.leave");
		},
		methods: {
			onPullDownRefresh: function() {
				uni.showNavigationBarLoading();
				//这里触发chat组件的getMore方法 --xyliu
				// this.selectComponent('#chat').getMore()
				// 停止下拉动作
				uni.hideNavigationBarLoading();
				uni.stopPullDownRefresh();
			},
		}
	}
</script>

<style>
page{
	background-color: #FAFAFA;
}
</style>
