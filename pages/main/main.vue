<template>
	<view>
		<view class="main_body">
			<!-- <view wx:for="{{ member }}" class="numbers" wx:key="word">
				<view class="nbr_header">{{ item.word }}</view>
				<view class="info" bindtap="into_info">
					<image src="../../images/number.png"  data-username="{{ item.name }}"></image>
				</view>
				<view class="nbr_body" data-username="{{ item.name }}" bindtap="into_room">
					<text data-username="{{ item.name }}">{{ item.name }}</text>
				</view>
				<view class="delete" bindtap="delete_friend" data-username="{{ item.name }}">
					<image src="../../images/delete.png"  data-username="{{ item.name }}"></image>
				</view>
			</view> -->
			<view>
				<!-- 左侧列表内容部分 -->
				<scroll-view
				class="content" 
				:class="gotop ?  'goTop' : 'goback'"
				enable-back-to-top :scroll-into-view="toView" 
				scroll-y="true" scroll-with-animation="true" 
				@scroll="on_page_scroll" 
				> 
					<!-- search -->
					<!-- <view class="search" v-if="search_btn">
						<view @tap="openSearch">
							<icon type="search" size="13"></icon>
							<text>搜索</text>
						</view>
					</view> -->
					<!-- <view class="search_input" v-if="search_friend">
						<view>
							<icon type="search" size="13"></icon>
							<input placeholder="搜索" 
								placeholder-style="color:#CFCFCF;line-height:20px;font-size:12px;" 
								auto-focus
								confirm-type="search"
								type='text'
								@confirm="onSearch"
								@input="onInput"
								:value="input_code"
								></input>
								<icon type="clear" size="13" @tap.stop.prevent='clearInput' v-if="show_clear"></icon>
						</view>
						<text @tap="cancel">取消</text>
					</view> -->
					<!-- other item -->
					<view class="contain">
						<view class="otherItem" @tap="add_new">
							<image src="/static/images/invite_theme@2x.png"  :data-username="name"></image>
							<text>添加好友</text>
							<!-- <image class='line' src="/static/images/line.png"></image> -->
							<!-- 0.5px border -->
						</view>
					<!-- 	<view class="chat" bindtap="into_inform">
							<image src="/static/images/chat.png"></image>
							<text>申请与通知</text>
							<text  class="em-msgNum">3</text>
							<text wx:if="{{ messageNum > 0 }}" class="em-msgNum">{{ messageNum }}</text>
						</view> -->
						<view class="otherItem" @tap="into_groups">
							<image src="/static/images/group@2x.png"></image>
							<text>群组</text>
						</view>
						<!-- <view class="chat_lists">
							<image src="/static/images/cell_groups.png"></image>
							<text>聊天室列表</text>
						</view> -->
					</view>
			
					<view v-for="group in listMain" :key="group.id"  :id="'inToView'+group.id" :data-id="group.id"> 
					  <view class="address_top" >{{group.region}}</view> 
						<view v-for="item in group.brands" :key="item.brandId" :data-username="item.name" @tap.stop.prevent="delete_friend"> 
							<!-- <swipe-delete > -->
								<view class="tap_mask" @tap.stop.prevent="into_room" :data-username="item.name">
									<view class="address_bottom" :data-username="item.name" @tap.stop.prevent="into_room">
										<image src="/static/images/theme@2x.png" @tap.stop.prevent="into_room" :data-username="item.name"></image>
										<text @tap.stop.prevent="into_room" :data-username="item.name">{{item.name}}</text>
									</view>
								</view>
							<!-- </swipe-delete> -->
						</view> 
					</view> 
				  </scroll-view> 
				  <!-- 顶部固定分类 -->
				  <view class="list-fixed" :class="[fixedTitle=='' ? 'hide':'',gotop?'fixedTitleTop': '']" v-if="showFixedTitile">
						<view class="fixed-title">
							{{fixedTitle}}
						</view>
				  </view>
				  <!-- 右侧字母导航 -->
				  <view class="orientation_region"> 
				   <!--  <view class="orientation">#</view> --> 
						 <block v-for="item in listMain"  :key="item.id"> 
							<view class="orientation_city" :class="isActive==item.id ?  'active' : ''" @tap="scrollToViewFn" :data-id="item.id" >{{item.region}}
							</view> 
						</block> 
				  </view>  
				</view>
			</view>
	</view>
</template>

<script>
	let disp = require("../../utils/broadcast");
	let systemReady = false;
	let canPullDownreffesh = true;
	let oHeight = [];
	
	export default {
		data() {
			return {
				search_btn: true,
				search_friend: false,
				show_mask: false,
				myName: "",
				member: [],
				messageNum: "", //加好友申请数
				unReadSpotNum: 0, //未读消息数
				unReadNoticeNum: 0, //加群通知数
				unReadTotalNotNum: 0, //总通知数：加好友申请数 + 加群通知数
				
				showFixedTitile: false,
				isActive:null,   
				listMain:[],
				listTitles: [],
				fixedTitle:null,    
				toView: 'inToView0',
				oHeight:[],
				scroolHeight:0,
				show_clear: false,
				isHideLoadMore: true
			}
		},
		onLoad() {
			const me = this;
			//监听加好友申请
			disp.on("em.xmpp.subscribe", ()=>{
				this.messageNum = getApp().globalData.saveFriendList.length;
				this.unReadTotalNotNum = getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length;
			});
			
			disp.on("em.xmpp.contacts.remove", (message)=>{
				var pageStack = getCurrentPages();
				if(pageStack[pageStack.length - 1].route === me.route){
					me.getRoster();
				}
			});
			
			//监听未读“聊天”
			disp.on("em.xmpp.unreadspot", ()=>{
				this.unReadSpotNum = getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum;
			});
			//监听未读加群“通知”数
			disp.on("em.xmpp.invite.joingroup", ()=>{
				this.unReadNoticeNum = getApp().globalData.saveGroupInvitedList.length
				this.unReadTotalNotNum = getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length;
			});
			disp.on("em.xmpp.subscribed", ()=>{
				var pageStack = getCurrentPages();
				if(pageStack[pageStack.length - 1].route === me.route){
					me.getRoster();
				}
			});
			this.myName = uni.getStorageSync("myUsername");
		},
		onShow() {
			this.messageNum = getApp().globalData.saveFriendList.length
			this.unReadSpotNum = getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum;
			this.unReadNoticeNum = getApp().globalData.saveGroupInvitedList.length;
			this.unReadTotalNotNum = getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length;

			this.getRoster();
		},
		methods: {
			getRoster(){
				let me = this;
				let rosters = {
					success(roster){
						var member = [];
						for(let i = 0; i < roster.length; i++){
							if(roster[i].subscription == "both"){
								member.push(roster[i]);
							}
						}
						uni.setStorage({
							key: "member",
							data: member
						});
						me.member = member;
						
						if(!systemReady){
							disp.fire("em.main.ready");
							systemReady = true;
						}
						me.getBrands(member);
					},
					error(err){
						console.log("[main:getRoster]", err);
					}
				};
				// WebIM.conn.setPresence()
				this.$im.conn.getRoster(rosters);
			
			},
			
			moveFriend(message){
				let me = this;
				let rosters = {
					success: function(roster){
						var member = [];
						for(let i = 0; i < roster.length; i++){
							if(roster[i].subscription == "both"){
								member.push(roster[i]);
							}
						}
						me.setData({
							member: member
						});
					}
				};
				if(message.type == "unsubscribe" || message.type == "unsubscribed"){
					WebIM.conn.removeRoster({
						to: message.from,
						success: function(){
							WebIM.conn.unsubscribed({
								to: message.from
							});
							WebIM.conn.getRoster(rosters);
						}
					});
				}
			},
			
			handleFriendMsg(message){
				uni.showModal({
					title: "添加好友请求",
					content: message.from + "请求加为好友",
					success: function(res){
						if(res.confirm == true){
							WebIM.conn.subscribed({
								to: message.from,
								message: "[resp:true]"
							});
							WebIM.conn.subscribe({
								to: message.from,
								message: "[resp:true]"
							});
						}
						else{
							WebIM.conn.unsubscribed({
								to: message.from,
								message: "rejectAddFriend"
							});
						}
					},
					fail: function(err){
					}
				});
			},
			
			delete_friend(event){
				const me = this;
				var delName = event.currentTarget.dataset.username;
				var myName = wx.getStorageSync("myUsername");// 获取当前用户名
				wx.showModal({
					title: "确认删除好友" + delName,
					cancelText: "取消",
					confirmText: "删除",
					success(res){
						if(res.confirm == true){
							WebIM.conn.removeRoster({
								to: delName,
								success: function(){
									WebIM.conn.unsubscribed({
										to: delName
									});
									// wx.showToast({
									// 	title: "删除成功",
									// });
									me.toastSuccess('删除成功');
									// 删除好友后 同时清空会话
									wx.setStorageSync(delName + myName, "");
									wx.setStorageSync("rendered_" + delName + myName, "");
									me.getRoster();
									disp.fire('em.main.deleteFriend')
								},
								error: function(error){
									me.toastSuccess('删除失败');
								}
							});
						}
					}
				});
			},
			
			openSearch(){
				this.search_btn = false;
				this.search_friend = true;
				this.show_mask = true;
				this.gotop = true;
			},
			
			clearInput(){
				this.input_code = '';
				this.show_clear = false;
			},
			
			onInput(e){
				let inputValue = e.detail.value
				if (inputValue) {
					this.show_clear = true; 
				} else {
					this.show_clear = true; 
				}
			},
			
			cancel(){
				this.search_btn = true;
				this.search_friend = false;
				this.gotop = false;
				this.getBrands(this.member)
			},
			
			onSearch(val){
				let searchValue = val.detail.value
				let member = this.member;
				let serchList = [];
				member.forEach((item, index)=>{
					if(String(item.name).indexOf(searchValue) != -1){
						serchList.push(item)
					}
				})
				this.getBrands(serchList)
			},
			
			add_new(){
				uni.navigateTo({
					url: "../add_new/add_new"
				});
			},
			
			tab_chat(){
				uni.redirectTo({
					url: "../chat/chat"
				});
			},
			
			close_mask(){
				this.search_btn = true;
				this.search_friend = false;
			},

			
			into_inform(){
				uni.navigateTo({
					url: "../inform/inform?myName=" + this.myName //wx.getStorageSync("myUsername")
				});
			},
			
			into_groups(){
				uni.navigateTo({
					url: "../groups/groups?myName=" + this.myName
				});
			},
			
			into_room(event){
				var nameList = {
					myName: this.myName,
					your: event.target.dataset.username
				};
				uni.navigateTo({
					url: "../chatroom/chatroom?username=" + JSON.stringify(nameList)
				});
			},
			
			into_info(event){
				uni.navigateTo({
					url: "../friend_info/friend_info?yourname=" + event.target.dataset.username
				});
			},
			
			//点击右侧字母导航定位触发
			scrollToViewFn(e) {
			    let _id = e.target.dataset.id;
			    for (let i = 0; i < this.listMain.length; ++i) {
				    if (this.listMain[i].id === _id) {
						this.isActive = _id;
						this.toView = 'inToView' + _id;
				        break
				    }
			    }
			},
			
			// 页面滑动时触发
			on_page_scroll(e){
			  	if (e.detail){
				    if (e.detail.scrollTop > 80) {
				    	this.showFixedTitile = true
				    }else{
						this.showFixedTitile = false
				    }
				    for (let i in oHeight){
				      	if (e.detail.scrollTop - 80 < oHeight[i].height){
							this.isActive = oHeight[i].key
							this.fixedTitle = oHeight[i].name
					        return false;
				      	}
				    }
			    }
			},
			
			// 处理数据格式，及获取分组高度
			getBrands(member){
				const that = this;
				const reg = /[a-z]/i;
					// member = [
			    	// 	{
			    	// 		groups: [],
			    	// 		jid: "easemob-demo#chatdemoui_zdtest2@easemob.com",
			    	// 		name: "adtest2",
			    	// 		subscription:"both"
					// 	}
					// ]
			
					member.forEach((item) => {
						if (reg.test(item.name.substring(0, 1))) {
							item.initial = item.name.substring(0, 1).toUpperCase();
						}else{
							item.initial = '#'
						}
					})
					member.sort((a, b) => a.initial.charCodeAt(0) - b.initial.charCodeAt(0))
			      	var someTtitle = null;
			      	var someArr=[];
			
			      	for(var i=0; i< member.length; i++){
			        	var newBrands = { brandId: member[i].jid, name: member[i].name };
			
			        	if (member[i].initial == '#') {
			        		if (!lastObj) {
			        			var lastObj = {
					                id: i,
					                region: '#',
					                brands: []
					            };
			        		}
				            lastObj.brands.push(newBrands);
			        	} else {
			        		if (member[i].initial != someTtitle){
			              		someTtitle = member[i].initial
					            var newObj = {
					                id: i,
					                region: someTtitle,
					                brands: []
					            };
			              		someArr.push(newObj)
			            	}
			            	newObj.brands.push(newBrands);
			            }
			      	};
			      	someArr.sort((a, b) => a.region.charCodeAt(0) - b.region.charCodeAt(0))
			      	if (lastObj) {someArr.push(lastObj)}
				//  someArr = [
				// 	{
				//         id: "1", region: "A",
				//         brands: [
				//           	{ brandId: "..", name: "阿明" },
				//           	{ brandId: "..", name: "奥特曼" },
				//           	{ brandId: "..", name: "安庆" },
				//           	{ brandId: "..", name: "阿曼" }
				//         ]
				//     },
				// ]
			
			     //赋值给列表值
				that.listMain = someArr;
			     //赋值给当前高亮的isActive
				that.isActive = someArr[0].id;
				that.fixedTitle = someArr[0].region;
			
			      //计算分组高度,wx.createSelectotQuery()获取节点信息
			    let number = 0;
			      	for (let j = 0; j < someArr.length; ++j) {
			        uni.createSelectorQuery().select('#inToView' + someArr[j].id).boundingClientRect(function (rect) {
			          	number = rect.height + number;
			          	var newArry = [{ 'height': number, 'key': rect.dataset.id, "name": someArr[j].region}]
			          	//that.setData({
			            	oHeight = oHeight.concat(newArry)
			          	//})
			        }).exec();
			    };
			},
		}
	}
</script>

<style>
page{ 
	height: 100%;
}
.main_title{
	background-color: #fff;
	width: 100%;
	height: 128rpx;
	position: fixed;
	top: 0;
	z-index: 9;
}
.main_title text{
	line-height: 96rpx;
	font-size: 64rpx;
	font-weight: 400;
	margin-left: 32rpx;
}
.main_title_hide{
	top: -128rpx;
	transition: top 0.5s;
}
.main_title_show{
	top: 0;
	transition: top 0.5s;
}
.search,.search_input {
	width: 100%;
	height: 88rpx;
	background-color: #fff;
	display: flex;
	align-items: center;
	top: 0;
	left: 0;
}
.search {
	justify-content: space-around;
}
.search_input {
	justify-content: space-around;
}
.search view, .search_input view {
	height: 64rpx;
	line-height: 64rpx;
	background-color: #F5F5F5;
	border-radius: 16rpx;
	text-align: center;
	display: flex;
	align-items: center;
	margin: 0 32rpx;
}
.search view {
	width: 100%;
	justify-content: center;
	align-items: center;
}
.search image {
	display: block;
	width: 6%;
	height: 53%;
	margin-right: 10rpx;
}
.search_input view {
	padding-left: 24rpx;
	text-align: left;
	flex: 1;
	margin: 0 28rpx 0 32rpx;
}
.search icon,.search_input icon {
	display: inline-block;
	margin: 8rpx 12rpx 0;
	font-size: 24rpx;
}
.search text {
	font-size: 30rpx;
	color: #9B9B9B;
}

.search_input text {
	display: inline-block;
	height: 60rpx;
	line-height: 60rpx;
	font-size: 30rpx;
	color: #0873DE;
	margin-right: 32rpx;
}
.search_input input {
	font-size: 28rpx;
	width: 90%;
}

/*.contain {
	margin-top: 40px;
}*/
.chat,.chat_groups,.chat_lists{
	position: relative;
	width: 100%;
	height: 90rpx;
	display: flex;
	align-items: center;
}
.chat,.chat_groups {
	border-bottom: 0.5px solid #E5E5E5;
}
.chat image {
	width: 6%;
	height: 50%;
	margin:0 26rpx 0 20rpx;
}
.chat .em-msgNum {
	position: absolute;
	right: 20rpx;
	height: 34rpx;
	border-radius: 20rpx;
	min-width: 30rpx;
	background: #f04134;
	color: #fff;
	line-height: 40rpx;
	text-align: center;
	padding: 0px 4rpx 4rpx 4rpx;
}
.chat_groups image {
	width: 8%;
	height: 54%;
	margin:0 20rpx 0 16rpx;
}
.chat_lists image {
	width: 12%;
	height: 100%;
	margin-right: 4rpx;
}
.chat text,.chat_groups text,.chat_lists text {
	font-size: 28rpx;
}
.numbers {
	width: 100%;
	height: 100rpx;
}
.nbr_header {
	height: 2rpx;
	background-color: #D4D4D4;
	line-height: 40rpx;
	padding-left: 32rpx;
}
.nbr_body {
	width: 70%;
	height: 100rpx;
	display: inline-block;
	font-size: 32rpx;
	line-height: 100rpx;
	margin-right: 0;
	float: left;
}
.mask {
	background-color: black;
	opacity: 0.4;
	position: absolute;
	top: 40rpx;
	left: 0;
	right: 0;
	bottom: 0;
}
.delete {
	width: 60rpx;
	height: 70rpx;
	float: right;
	margin-top: 12rpx;
}
.delete image {
	width: 32rpx;
	height: 4rpx;
}
.info {
	margin-top: 10rpx;
	width: 12%;
	height: 80rpx;
	display: inline-block;
	float: left;
}
.info image {
	width: 68%;
	height: 70%;
	display: inline-block;
	margin: 12rpx auto auto 12rpx;
}

.otherItem{
	height: 108rpx;
	display: flex;
  	align-items: center;
  	border-bottom: 0.5px solid #E5E5E5;
  	margin:0 32rpx;
  	position: relative;
}
.otherItem image{
	width: 72rpx;
	height: 72rpx;
	margin: 0 22rpx 0 0;
}
.otherItem text{
	font-size: 34rpx;
	color: #000;
}
.otherItem .line{
	position: absolute;
	bottom: 0;
	width: 100%;
	height:.5px;
}

.content{
	/* padding-bottom: 270rpx; */
	box-sizing: border-box; 
	height: 100%;
	position: fixed;
	/* top: 128rpx; */
	top: 0;
} 

.location{
	width: 100%;
} 
.location_top{
	height: 76rpx;
	line-height: 76rpx;
	background: #f4f4f4;
	color: #606660;
	font-size: 28rpx;
	padding: 0 20rpx;
} 
.location_bottom{
	height: 140rpx;
	line-height: 140rpx;
	color: #d91f16;
	font-size: 28rpx;
	border-top: 0.5px #E5E5E5 solid;
	border-bottom: 0.5px #E5E5E5 solid;
	padding: 0 20rpx;
	align-items: center;
	display: -webkit-flex;
} 
.address_top{
	height:40rpx;
	line-height:40rpx;
	background:#FAFAFA;
	color:#9B9B9B;
	font-size:20rpx;
	padding:0 32rpx;
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
} 
.address_bottom image{
	width: 72rpx;
	height: 72rpx;
	margin-right: 24rpx;
}
.address_bottom text{
	overflow: hidden;
	text-overflow: ellipsis;
	flex: 1;
}
.location_img{
	width: 48rpx;
	height: 48rpx;
	position: absolute;
	right: 20rpx;
	top: 125rpx;
} 
.add_city{
	width: 228rpx;
	height: 60rpx;
	line-height: 60rpx;
	text-align: center;
	border: 0.5px solid #E5E5E5;
	color: #000000;
	margin-right: 20rpx;
} 
.add_citying{
	width: 228rpx;
	height: 60rpx;
	line-height: 60rpx;
	text-align: center;
	border: 2rpx solid #09bb07;
	color: #09bb07;
	margin-right: 20rpx;
} 
.orientation{
	white-space:normal;
	display: inline-block;
 	width: 45rpx;
 	height:50rpx;
	font-size: 28rpx;
	font-weight: bold;
 	color: rgb(88, 87, 87);
 	text-align: center;
} 
.orientation_region{
	padding: 10rpx 0px; 
	width: 28rpx;
	font-size: 20rpx;
	position: fixed;
	top: 50%;
	right: 0;
	transform:translate(0,-50%);
	border-radius: 10px
} 
.orientation_city{
	height: 24rpx;
	width: 24rpx;
	line-height: 24rpx;
	font-size: 18rpx;
	color: #000;
	text-align: center;
} 
.active{
	color: #fff;
	background-color: #0873DE;
	border-radius: 50%;
}
.list-fixed{
	position: fixed;
	width: 100%;
	z-index: 999; 
	height: 56rpx;
	line-height: 56rpx; 
	background: #EBEBEB;
	color: #999999;
	font-size: 28rpx;
	padding: 0 20rpx;
	/* top: 128rpx; */
	top: 0;
}
.fixed-title{
	color:#2cc1d1;
}

.goTop{
	top: 0;
	transition: top 0.5s;
	padding-bottom: 104rpx!important;
}
.goTopX{
	top: 0rpx;
	transition: top 0.5s;
	padding-bottom: 140rpx!important;
}
.goback{
	top: 0;
	transition: top 0.5s;
}
.fixedTitleTop{
	top: 0;
}
.tap_mask{
	width: 100%;
	overflow: hidden;
}



</style>
