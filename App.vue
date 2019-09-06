<script>
	require("sdk/libs/strophe");
	let msgStorage = require("comps/chat/msgstorage");
	let msgType = require("comps/chat/msgtype");
	let ToastPannel = require("./comps/toast/toast");
	let disp = require("utils/broadcast");
	let logout = false;
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
