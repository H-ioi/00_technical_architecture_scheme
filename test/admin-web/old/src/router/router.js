import Vue from 'vue'
import VueRouter from 'vue-router'
import PageRouter from './page/'
import ViewsRouter from './views/'
import AvueRouter from './avue-router'
import Store from '../store/'
import User from './user/'
import Order from './order/'
import Space from './space/'
import Reservation from './reservation/'
import Assets from './assets/'
import Consult from './consult/'
import Notification from './notification/'
import ISA from './isa/'
import Academy from './academy/'
import Isacommunity from './isacommunity/'
import Ems from './ems/'
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function (location) {
	return originalPush.call(this, location).catch((err) => err)
}
//创建路由
export const createRouter = () => new VueRouter({
	routes: [...PageRouter, ...ViewsRouter, ...User, ...Order, ...Space, ...Reservation, ...Assets, ...Consult, ...Notification, ...ISA, ...Academy, ...Isacommunity, ...Ems]

})

const Router = createRouter()
AvueRouter.install(Router, Store)
Router.$avueRouter.formatRoutes(Store.state.user.menu, true)
// 重置路由
export function resetRouter () {
	const newRouter = createRouter()
	Router.matcher = newRouter.matcher
	AvueRouter.install(Router, Store)
}
export default Router
