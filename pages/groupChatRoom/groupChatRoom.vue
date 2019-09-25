<template>
	<view>
		<chat :username="username" chatType="chatRoom"></chat>
	</view>
</template>

<script>
	import chat from "@/comps/chat/chat.vue";
	let disp = require("../../utils/broadcast");
	export default {
		components: {
			chat
		},
		props: {
			
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
			console.log(username);
			this.username = username;
			uni.setNavigationBarTitle({
				title: username.your
			});
		},
		onUnload(){
			disp.fire("em.chatroom.leave");
		},
		methods: {
			onPullDownRefresh: function() {
				uni.showNavigationBarLoading();
				//这里触发chat组件的getMore方法 --xyliu
				// this.selectComponent('#groupchat').getMore()
				// 停止下拉动作
				uni.hideNavigationBarLoading();
				uni.stopPullDownRefresh();
			},
		}
	}
</script>

<style>

</style>
