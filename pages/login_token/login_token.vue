<template>
	<view class="login">
		<view class="login_title">
			<text>使用token登录</text>
		</view>
		<view class="login_user" :class="nameFocus ?  'nameFocus' : ''">
			<input type="text" placeholder="用户ID" placeholder-style="color:rgb(173,185,193)" v-model="name" @focus="onFocusName" @blur="onBlurName"/>
		</view>
		<view class="login_pwd" :class="psdFocus ?  'psdFocus' : ''">
			<input type="text" placeholder="token" placeholder-style="color:rgb(173,185,193)" v-model="psd" @focus="onFocusPsd" @blur="onBlurPsd"/>
		</view>
		<view class="login_btn">
			<button hover-class="btn_hover" @tap="login">登录</button>
		</view>
		<view class="login_text">
			<navigator url="../register/register" open-type="redirect" hover-class="navigator-hover">新用户注册</navigator>
			<navigator url="../login/login" open-type="redirect" hover-class="navigator-hover">使用密码登录</navigator>
		</view>
	</view>
</template>

<script>
	let test_account, test_psword; //测试用账号密码
	let disp = require("../../utils/broadcast");

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
			disp.on("em.xmpp.error.tokenErr", function() {
				this.$helper.toast('none', 'token错误、token过期或者未授权', 2000, false, 'bottom');
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
				if (!test_account && this.name == "") {
					this.$helper.toast('none', '请输入用户名！', 2000, false, 'bottom');
					return;
				} else if (!test_account && this.psd == "") {
					this.$helper.toast('none', '请输入token！', 2000, false, 'bottom');
					return;
				}
				uni.setStorage({
					key: "myUsername",
					data: test_account || this.name.toLowerCase()
				});

				this.$im.conn.open({
					apiUrl: this.$im.config.apiURL,
					user: test_account || this.name.toLowerCase(),
					pwd: test_psword || this.psd,
					accessToken: test_psword || this.psd,
					//grant_type: this.grant_type,
					appKey: this.$im.config.appkey
				});
			}
		}
	}
</script>

<style>
	@import '../../common/css/pages/login.css';
</style>
