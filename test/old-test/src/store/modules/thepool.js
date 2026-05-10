import { getStore, setStore } from '@/util/store'

const thePool = {
	state: {
		thePool_LocalCache: getStore({ name: 'thePool_LocalCache' }) || {},
	},
	actions: {

	},
	mutations: {
		SET_ThePool_LocalCache: (state, params = {}) => {
			let { name, value } = params;
			state.thePool_LocalCache[name] = value
			setStore({
				name: 'thePool_LocalCache',
				content: state.thePool_LocalCache,
			})
		},
	}

}

export default thePool
