import Vue from 'vue'
import App from './App'
import helper from './helper/helper.js';


let WebIM = require("utils/WebIM")["default"];


WebIM.conn = {
	closed: false,
	curOpenOpt: {},
	open(opt) {
		uni.showToast({
			icon: 'loading',
			title: '正在初始化客户端...'
		})
		console.log(this.curOpenOpt);
		this.curOpenOpt = opt;
		WebIM.conn.open(opt);
		this.closed = false;
	},
	reopen() {
		if (this.closed) {
			//this.open(this.curOpenOpt);
			WebIM.conn.open(this.curOpenOpt);
			this.closed = false;
		}
	}
};

Vue.prototype.$im = WebIM;
Vue.prototype.$helper = helper;

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
