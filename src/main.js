import Vue from 'vue'
import App from './App'
import BannerImg from "./pages/components/banner-img/index";
import NavBar from "./pages/components/nav-bar/index";
Vue.config.productionTip = false
App.mpType = 'app'

/*
  注意：因navbar组件挂在全局中，h5执行顺序与小程序不一致，导致h5端navbar组件生命周期没触发时，无法获取到getApp实例
*/
Vue.component('BannerImg', BannerImg)
Vue.component('NavBar', NavBar)


const app = new Vue({
  ...App
})
app.$mount()
