<template>
	<view class="login">
		<view class="login_title">
			<text>登录</text>
		</view>
		<view class="login_user" :class="nameFocus ?  'nameFocus' : ''">
			<input type="text" placeholder="用户ID" placeholder-style="color:rgb(173,185,193)" v-model="name" @focus="onFocusName" @blur="onBlurName"/>
		</view>
		<view class="login_pwd" :class="psdFocus ? 'psdFocus' : ''">
			<input type="text" password placeholder="用户密码" placeholder-style="color:rgb(173,185,193)" v-model="psd" @focus="onFocusPsd" @blur="onBlurPsd" />
		</view>
		<view class="login_btn">
			<button hover-class="btn_hover" @tap="login">登录</button>
		</view>

		<view class="login_text">
			<navigator url="../register/register" open-type="redirect" hover-class="navigator-hover">新用户注册</navigator>
			<navigator url="../login_token/login_token" open-type="redirect" hover-class="navigator-hover">使用Token登录</navigator>
		</view>
	</view>
</template>

<script>
	
	let test_account, test_psword; //测试用账号密码
	let disp = require("../../utils/broadcast");
	
	let runAnimation = true; //不知道有啥用,就放着吧

	export default {
		data() {
			return {
				name: "",
				psd: "",
				grant_type: "password",
				
				psdFocus: '',
				nameFocus: '',
			}
		},
		onLoad() {
			
			disp.on("em.xmpp.error.passwordErr", function() {
				this.$helper.toast('none', '用户名或密码错误', 2000, false, 'bottom');
			});
		},
		methods: {
			onFocusPsd() {
				this.psdFocus = 'psdFocus';
			},
			onBlurPsd() {
				this.psdFocus = '';
			},
			onFocusName() {
				this.nameFocus = 'nameFocus';
			},
			onBlurName() {
				this.nameFocus = '';
			},


			login() {
				// uni.switchTab({
				// 	url: "../chat/chat"
				// });
				// return;
				this.$helper.toast('loading', '正在初始化客户端...', 10000);
				runAnimation = !runAnimation
				if (!test_account && this.name == "") {
					this.$helper.toast('none', '请输入用户名！', 2000, false, 'bottom');
					return;
				} else if (!test_account && this.psd == "") {
					this.$helper.toast('none', '请输入密码！', 2000, false, 'bottom');
					return;
				}
				uni.setStorage({
					key: "myUsername",
					data: test_account || this.name.toLowerCase()
				});

				this.$conn.open({
					apiUrl: this.$im.config.apiURL,
					user: test_account || this.name.toLowerCase(),
					pwd: test_psword || this.psd,
					grant_type: this.grant_type,
					appKey: this.$im.config.appkey
				});
			}
		}
	}
	
</script>

<style>
	@import '../../common/css/pages/login.css';
</style>
