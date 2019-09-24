<template>
	<view>
		<!-- 创建群组 -->
		<view class="createGroup">
			<!-- 群组名称 -->
			<view class="create_input">
				<view>
					<input @input="getGroupName" placeholder="群名称" placeholder-style="color:#CFCFCF;line-height:20px;font-size:12px;"></input>
				</view>
			</view>
			<!-- 群简介 -->
			<view class="create_textarea">
				<view>
					<textarea @input="getGroupDec" placeholder="群简介" placeholder-style="color:#CFCFCF;line-height:20px;font-size:12px;"/>
				</view>
			</view>
			
			<!-- 获取需要邀请的好友列表 -->
			<view class="friend_list">
				<view>
					<text class="invite_text">邀请好友</text>
					<checkbox-group class="checkbox-group" @change="invite_friend">
						<label class="checkbox" v-for="(item, index) in friendList" :key="index">
							<checkbox :value="item.name"/>{{ item.name }}
						</label>
					</checkbox-group>
				</view>
			</view>
			<!--  -->
			<view class="create_btn">
				<button type="primary" @tap="createGroup">创建</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				friendList: [],			// 好友列表
				groupName: "",			// 群名称
				groupDec: "",			// 群简介
				allowJoin: true,		// 是否允许任何人加入
				allowApprove: false,	// 加入需要审批
				noAllowJoin: false,		// 不允许任何人加入
				allowInvite: false,		// 允许群人员邀请
				inviteFriend: [],		// 需要加好友ID
				owner: "",				// = myName
			}
		},
		onLoad(options) {
			this.owner = JSON.parse(options.owner).myName
		},
		onShow() {
			var me = this;
			// 获取当前用户的好友信息
			this.$im.conn.getRoster({
				success: function(roster){
					var member = [];
					for(let i = 0; i < roster.length; i++){
						if(roster[i].subscription == "both"){
							member.push(roster[i]);
						}
					}
					me.friendList = member
				}
			});
		},
		methods: {
			getGroupName(e){
				this.groupName = e.detail.value
			},
			
			getGroupDec(e){
				this.groupDec = e.detail.value
			},
			
			// allowJoin(e){
			// 	this.allowJoin = Boolean(e.detail.value) || false
			// },
			
			// allowApprove(e){
			// 	this.allowApprove = Boolean(e.detail.value) || false
			// },
			
			// noAllowJoin(e){
			// 	this.noAllowJoin = Boolean(e.detail.value) || false
			// },
			
			// allowInvite(e){
			// 	this.allowInvite = Boolean(e.detail.value) || false
			// },
			
			invite_friend(e){
				this.inviteFriend = e.detail.value
			},
			
			// 创建群组
			createGroup(){
				let me = this;
				let allGroups = getApp().globalData.groupList;
				if(!this.groupName.trim()){
					uni.showModal({
						title: "",
						content: "请输入群名",
						confirmText: "OK",
						showCancel: false
					});
					return;
				}
				if(allGroups.reduce(function(result, v, k){
					return result || (v.name == me.groupName);
				}, false)){
					uni.showModal({
						title: "",
						content: "群名被占用",
						confirmText: "OK",
						showCancel: false
					});
					return;
				}
				let options = {
					data: {
						groupname: this.groupName,
						desc: this.groupDec,
						members: this.inviteFriend,
						"public": this.allowJoin,
						// approval: this.allowApprove,
						// allowinvites: this.allowInvite,
						owner: this.owner
					},
					success: function(respData){
						uni.showToast({
							title: "添加成功",
							duration: 2000,
							success: function(res){
								setTimeout(() => uni.navigateTo({
									url: "../groups/groups?myName=" + me.owner
								}), 2000);
							},
						});
					},
					error: function(err){
						this.$helper.toast('none', err.data.error_description, 2000, false, 'bottom');
						console.log(err);
					},
				};
				this.$im.conn.createGroupNew(options);
			},
		}
	}
</script>

<style>
.createGroup{
	background-color: #CFCFCF;
}
.create_input {
	width: 100%;
	height: 40px;
	background-color: #ffffff;
	border-top: 1px solid #CFCFCF;
}
.create_input view {
	width: 100%;
	height: 100%;
	padding: 0 10px 0 10px;
	box-sizing: border-box;
}
.create_input input {
	font-size: 14px;
	width: 100%;
	height: 100%;
	line-height: 100%;
}

.create_textarea {
	width: 100%;
	height: 150px;
	background-color: #ffffff;
	border-top: 1px solid #CFCFCF;
}
.create_textarea view {
	width: 100%;
	height: 100%;
	line-height: 100;
	padding: 0 10px 0 10px;
	box-sizing: border-box;
}
.create_textarea textarea {
	padding-top: 7px;
	font-size: 14px;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	line-height: 20px;
}

/*  */
.check_area {
	margin-top: 1px;
}
.check_area .checkbox-group {
	background: #fff;
	width: 100%;
	margin: 0 auto;
	padding: 10px 10px 0 10px;
	box-sizing: border-box;
}
.check_area .checkbox-group:last-child {
	padding: 10px;
}
.check_area .checkbox-group .checkbox {
	display: block;
	font-size: 14px;
	line-height: 30px;
}
.invite_text {
	font-size: 14px;
	padding-left: 12px;
	color: #333;
}

/*  */
.friend_list {
	margin-top: 1px;
	background: #fff;
}
.friend_list .checkbox-group {
	background: #fff;
	padding: 10px;
	box-sizing: border-box;
}
.friend_list .checkbox-group .checkbox {
	display: block;
	font-size: 14px;
	line-height:30px;
	margin-bottom: 8px;
}

.create_btn {
	background-color: #fff;
}
.create_btn button {
	margin: 0 auto;
	width: calc(100% - 20px);
}

</style>
