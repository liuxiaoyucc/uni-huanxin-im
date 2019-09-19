<template>
	<view>
		<view class="setting_list">
			<view class="setting_listContent">
				<text>当前版本</text>
				<text>1.0.0</text>
			</view>
		</view>
		
		<view class="setting_list">
			<view class="setting_listContent">
				<text>开启deBug</text>
				<switch :checked="switchStatus? true: false" color="#0873DE" @change="openDebug"/>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				switchStatus: false,
			}
		},
		onLoad() {
			this.switchStatus = this.$im.config.isDebug
		},
		onShow() {
			this.switchStatus = this.$im.config.isDebug
		},
		methods: {
			openDebug(event){
				this.$im.isDebug({
					isDebug: event.detail.value
				});
			}
		}
	}
</script>

<style>

page {
	background-color: #F5F5F5;
	display: flex;
	flex-direction: column;
}
.setting_list{
	background-color: #fff;
	margin-top: 48rpx;
}
.setting_listContent {
	height: 88rpx;
	margin: 0 32rpx;
	border-bottom: 2rpx solid #E5E5E5;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 32rpx;
	background-color: #fff;
}
.list_right {
	width: 112rpx;
	height: 56rpx;
	margin-right: 8rpx;
	color: #9B9B9B;
}
.setting_redtext{
	color: #CE3918;
}

switch {
	zoom: .8;
}

</style>
