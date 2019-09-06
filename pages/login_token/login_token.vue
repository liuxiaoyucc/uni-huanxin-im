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
.login {
	width: 100%;
	height: 100%;
	background-color: #ffffff;
}
.login_title {
	height: 128rpx;
	padding-left: 32rpx;
}
.login_title text{
	font-size: 64rpx;
	font-weight: 400;
	line-height: 96rpx;
}
.login_user, .login_pwd, .login_btn {
	display: flex;
}
.login_user input, .login_pwd input {
	height: 96rpx;
	background-color: #ffffff;
	border: 2rpx solid #999999;
	border-radius: 8rpx;
	box-sizing: border-box;
	padding: 0 32rpx;
	font-size: 34rpx;
	color: #000;
	margin: 0 64rpx;
	display: inline-block;
	flex: 1;
}
.login_user input {
	margin-top: 128rpx
}
.login_pwd input {
	margin-top: 32rpx;
}
.login_btn button{
	flex: 1;
	height: 96rpx;
	margin: 32rpx 64rpx 0;
	border-radius: 8rpx;
	line-height: 96rpx;
	color: rgb(255,255,255);
	background-color: #0873DE;
	font-size: 34rpx;
}
.login_text {
	height: 34rpx;
	margin-top: 28rpx;
	padding: 0 64rpx;
	display: flex;
	justify-content: space-between;
}

.login_text navigator {
	font-size: 24rpx;
	color: #0873DE;
	display: inline-block;
}

.btn_hover {
	background-color: #137DCD;
}
.nameFocus input, .psdFocus input{
	border: 3rpx solid #0873DE;
	box-sizing: border-box;
}

</style>
