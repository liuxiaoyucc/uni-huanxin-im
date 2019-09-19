<template>
	<view>
		<view class="search" v-if="search_btn">
			<view @tap="openSearch">
				<icon type="search" size="13"></icon>
				<text>请输入好友用户名</text>
			</view>
		</view>
		
		<view class="search_input" v-if="search_chats">
			<view>
				<icon type="search" size="13"></icon>
				<input placeholder="请输入好友用户名" 
					placeholder-style="color:#CFCFCF;line-height:20px;font-size:12px;" 
					:focus="focus"
					confirm-type="Search"
					type='text'
					@confirm="onSearch"
					@input="onInput"
					v-model="input_code"
					></input>
					<icon type="clear" size="13" @tap.stop.prevent="clearInput" v-if="show_clear"></icon>
			</view>
			<text @tap="cancel">取消</text>
		</view>
		
		<view class="address_bottom" v-if="show_clear">
			<image src="/static/images/theme@2x.png"  data-username="1"></image>
			<text>{{friend_name}}</text>
			<button @tap="add_friend" :disabled="isdisable">发送申请</button>
		</view> 
		<view class="add_nobody" v-if="!show_clear">
			请输入好友的username,申请成为好友吧
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				friend_name: "",
				search_btn: true,
				search_chats: false,
				show_clear: false,
				input_code: '',
				isdisable: false,
				focus:false,
			}
		},
		onLoad() {
			
		},
		methods: {
			openSearch(){
				this.search_btn = false;
				this.search_chats = true;
				setTimeout(()=> {
					this.focus = true;
				}, 300);
			},
			
			onInput(e){
				let inputValue = e.detail.value
				if (inputValue) {
					this.show_clear = true;
					this.friend_name = inputValue;
					this.isdisable = false;
				} else {
					this.show_clear = false;
				}
			},
			
			clearInput(){
				this.input_code = '';
				this.show_clear = false;
			},
			
			cancel(){
				this.search_btn = true;
				this.search_chats = false;
				this.show_clear = false;
				this.focus = false;
			},
			
			add_friend(){
				let me = this;
				let myName = uni.getStorageSync("myUsername");
				console.log(me.friend_name)
				if(me.friend_name == "" || me.friend_name.toLowerCase() == myName.toLowerCase()){
					this.$helper.toast('none', '添加失败');
					return;
				}
				this.$im.conn.subscribe({
					to: me.friend_name
				});
			
				// 判断当前是否存在该好友
				let rosters = {
					success: function(roster){
						console.log('success')
						var member = [];
						for(let i = 0; i < roster.length; i++){
							if(roster[i].subscription == "both"){
								member.push(roster[i]);
							}
						}
						if(me.isExistFriend(me.friend_name, member)){
							me.$helper.toast('none', '已经是你的好友');
						}
						else{
							me.$helper.toast('none', '已经发出好友申请');
						}
						me.isdisable = true;
						// console.log(member)
					}
				};
				this.$im.conn.getRoster(rosters);
			},
			
			isExistFriend(name, list){
				for(let index = 0; index < list.length; index++){
					if(name == list[index].name){
						return true
					}
				}
				return false
			}
		}
	}
</script>

<style>
.search_input {
	height: 80rpx;
	background-color: #CFCFCF;
	display: flex;
	justify-content: center;
	align-items: center;
	margin:0 32rpx;
}
.search_input view {
	height: 60rpx;
	line-height: 80rpx;
	background-color: #ffffff;
	border-radius: 4rpx;
	text-align: center;
	display: flex;
	align-items: center;
	padding-left: 20rpx;
	text-align: left;
}
.search_input input {
	font-size: 14px;
	width: 90%;
}
button {
	margin-top: 40rpx;
	font-size: 14px;
}

.search,.search_input {
	height: 80rpx;
	background-color: #fff;
	display: flex;
	align-items: center;
	top:0;
	left:0;
}
.search {
	justify-content:space-around;
}

.search view, .search_input view {
	height: 64rpx;
	line-height: 80rpx;
	background-color: #F5F5F5;
	border-radius: 16rpx;
	text-align: center;
	display: flex;
	align-items: center;
}
.search view {
	width: 100%;
	margin: 0 32rpx;
	justify-content:center;
}
.search image {
	display: block;
	width: 5%;
	height: 50%;
}
.search_input view {
	padding-left: 20rpx;
}
.search icon,.search_input icon {
	display: inline-block;
	margin: 26rpx 8rpx 0 0;
	height: 26px;
	line-height: 52rpx;
}
.search text {
	font-size: 12px;
	color: #CFCFCF;
}
.search_input view {
	flex:1;
	text-align: left;
}
.search_input text {
	display: inline-block;
	height: 60rpx;
	line-height: 60rpx;
	font-size: 16px;
	color:#0873DE;
	margin-left: 28rpx;
	text-align:right;
}
.search_input input {
	font-size: 14px;
}

.address_bottom{
	height: 108rpx;
	line-height: 108rpx;
	background: #fff;
	color: #000000;
	font-size: 34rpx;
	border-bottom: 0.5px #E5E5E5 solid;
	margin: 0 32rpx;
	display: flex;
	align-items: center;
	position:relative;
} 
.address_bottom text{
	width:calc(100% - 280rpx);
	overflow:hidden;
}
.address_bottom image{
	width: 72rpx;
	height: 72rpx;
	margin-right: 24rpx;
}
.address_bottom button{
	margin: 0;
	background-color: #0873DE;
	color: #fff;
	width: 168rpx;
	height: 64rpx;
	font-size: 15px;
	padding: 0;
	line-height: 64rpx;
	position: absolute;
	right: 32rpx;
	top: 20rpx;
}
.add_nobody{
	text-align:center;
	font-size:30rpx;
	color:#9B9B9B;
	margin-top: 400rpx;
}


</style>
