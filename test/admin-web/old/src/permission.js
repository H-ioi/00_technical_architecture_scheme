/**
 * 全站权限配置
 *
 */
import router from './router/router'
import store from '@/store'
import { validatenull } from '@/util/validate'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getStore } from "@/util/store";
import { redirectPath, canEnterPage } from "@/const/redirect/index.js";
NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
	NProgress.start()
	const meta = to.meta || {}
	// 判断当前路由跳转是否可以继续
	let canEnter = canEnterPage(to['path'], to['meta'])
	// console.log('router.beforeEach.canEnter', canEnter);
	// console.log('router.beforeEach.to', to);
	// console.log('router.beforeEach.from', from);
	if (canEnter) {
		if (store.getters.access_token) {
			if (store.getters.isLock && to.path !== '/lock') {
				next({ path: '/lock' })
			} else if (to.path === '/login') {
				next({ path: '/' })
			} else {
				const value = to.query.src || to.fullPath
				const label = to.query.name || to.name
				const enLabel = to.meta['enName'] || to.name
				// 针对外链跳转
				if (value.includes('http') || value.includes('https')) {
					window.open(value, '_blank')
					return
				}
				if (meta.isTab !== false && !validatenull(value) && !validatenull(label)) {
					store.commit('ADD_TAG', {
						label: label,
						value: value,
						params: to.params,
						query: to.query,
						group: router.$avueRouter.group || [],
						enLabel: enLabel
					})
				}
				next()
			}
		} else {
			if (meta.isAuth === false) {
				next()
			} else {
				const TENANT_ID = getStore({
					name: "tenantId"
				});
				if (TENANT_ID) {
					let loginPath = redirectPath();
					if (to.query['redirect'] == 1 || (from['fullPath'] == '/' && loginPath == to['path'])) {
						next(loginPath);
					} else {
						next({
							path: loginPath,
							query: {
								path: to['path'],
								...to['query']
							}
						})
					}

				} else {
					next()
				}
			}
		}
		NProgress.done()
	} else {
		NProgress.done()
		next({ path: '/redirect' })
	}

})

router.afterEach(() => {
	NProgress.done()
	let title = store.getters.tag.label;
	if (!store.getters.access_token) title = undefined;
	router.$avueRouter.setTitle(title)
})
