<template>
	<view class="register">
		<view class="register_title">
			<text>注册</text>
		</view>
		<view class="register_user" :class="nameFocus ?  'nameFocus' : ''">
			<input type="text" placeholder="用户ID（字母或数字)" placeholder-style="color:rgb(173,185,193)" v-model="username" @focus="onFocusName" @blur="onBlurName" />
		</view>
		<view class="register_pwd" :class="psdFocus ?  'psdFocus' : ''">
			<input type="text" password placeholder="用户密码" hover-class="input-hover" placeholder-style="color:rgb(173,185,193)" v-model="password" @focus="onFocusPsd" @blur="onBlurPsd" />
		</view>
		<view class="register_btn">
			<button hover-class="btn_hover" @tap="register">注册</button>
		</view>
		<view class="register_back">
			<navigator url="../login/login" open-type="redirect" hover-class="navigator-hover">返回登录</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: "",
				password: "",
				psdFocus: '',
				nameFocus: '',
			}
		},
		onLoad() {
			console.log('onLoad');
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

			register() {
				const that = this;
				if (that.username == "") {
					this.$helper.toast('none', '请输入用户名！', 2000, false, 'bottom');
					return;
				} else if (that.password == "") {
					this.$helper.toast('none', '请输入密码！', 2000, false, 'bottom');
					return;
				} else {
					var options = {
						apiUrl: this.$im.config.apiURL,
						username: that.username.toLowerCase(),
						password: that.password,
						nickname: "",
						appKey: this.$im.config.appkey,
						success: function(res) {
							if (res.statusCode == "200") {
								that.$helper.toast('none', '注册成功！', 2000, false, 'bottom');
								var data = {
									apiUrl: that.$im.config.apiURL,
									user: that.username.toLowerCase(),
									pwd: that.password,
									grant_type: "password",
									appKey: that.$im.config.appkey
								};
								uni.setStorage({
									key: "myUsername",
									data: that.username
								});
								uni.redirectTo({
									url: '../login/login',
								})
							}
						},
						error: function(res) {
							console.log('res', res)
							if (res.statusCode !== "200") {
								if (res.statusCode == '400' && res.data.error == 'illegal_argument') {
									that.$helper.toast('none', '用户名非法！', 2000, false, 'bottom');
									return;
								}
								that.$helper.toast('none', '用户名已被占用！', 2000, false, 'bottom');
							}
						}
					};
					this.$im.utils.registerUser(options);
				}
			}
		}
	}
</script>

<style>
	@import '../../common/css/pages/register.css';
</style>
