import { mapGetters } from 'vuex'
import { getStore, setStore } from "@/util/store";
const version = require('element-ui/package.json').version
const ORIGINAL_THEME = getStore('theme') || '#175E67'
export default function () {
	return {
		data () {
			return {
				// 从本地存储读取主题，若没有则使用默认主题
				themeVal: getStore('theme') || ORIGINAL_THEME
			}
		},
		created () {
			// this.applyTheme()
			this.setTheme()
		},
		watch: {
			themeVal (val, oldVal) {
				this.$store.commit('SET_THEME', val)
				this.updateTheme(val, oldVal)
			},
			tenantId (newTenantId) {
				this.applyTheme(newTenantId)
			}
		},
		computed: {
			...mapGetters(['theme', 'tenantId'])
		},
		methods: {
			applyTheme (tenantId = this.tenantId) {
				// 保存租户 ID 到本地存储
				setStore('tenantId', tenantId);
				const body = document.body;
				// 移除现有的主题类
				body.classList.remove(
					'tenant-1-theme',
					'tenant-2-theme',
					'tenant-3-theme',
					'tenant-4-theme',
					'tenant-5-theme',
					'tenant-6-theme',
					'tenant-default-theme'
				);
				// 根据租户 ID 添加对应的主题类
				if (tenantId >= 1 && tenantId <= 6) {
					body.classList.add(`tenant-${tenantId}-theme`);
				} else {
					body.classList.add('tenant-default-theme');
				}
			},
			setTheme (tenantId = this.tenantId) {
				let color = ''
				this.$store.commit('SET_TENANTID', tenantId)
				switch (tenantId) {
					case 1:
						color = "#175E67"
						break;
					case 2:
						color = "#BA8E62"
						break;
					case 3:
						color = "#2A3F54"
						break;
					case 4:
						color = "#2A3F54"
						break;
					case 5:
						color = "#BA8E62"
						break;
					case 6:
						color = "#BA8E62"
						break;
				}
				this.themeVal = color
				this.updateTheme(color, this.theme)
				this.$store.commit('SET_THEME', color)
				// console.log('this.tenantId', tenantId, color);
			},
			updateTheme (val, oldVal) {
				// console.log('updateTheme', val, oldVal);
				if (typeof val !== 'string') return
				const head = document.getElementsByTagName('head')[0]
				const themeCluster = this.getThemeCluster(val.replace('#', ''))
				const originalCluster = this.getThemeCluster(oldVal.replace('#', ''))
				const getHandler = (variable, id) => {
					return () => {
						const originalCluster = this.getThemeCluster(
							ORIGINAL_THEME.replace('#', '')
						)
						const newStyle = this.updateStyle(
							this[variable],
							originalCluster,
							themeCluster
						)

						let styleTag = document.getElementById(id)
						if (!styleTag) {
							styleTag = document.createElement('style')
							styleTag.setAttribute('id', id)
							head.appendChild(styleTag)
						}
						styleTag.innerText = newStyle
					}
				}

				const chalkHandler = getHandler('chalk', 'chalk-style')

				if (!this.chalk) {
					const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`
					this.getCSSString(url, chalkHandler, 'chalk')
				} else {
					chalkHandler()
				}

				const link = [].slice.call(
					document.getElementsByTagName('head')[0].getElementsByTagName('link')
				)
				for (let i = 0; i < link.length; i++) {
					const style = link[i]
					if (style.href.includes('css')) {
						this.getCSSString(style.href, innerText => {
							const originalCluster = this.getThemeCluster(
								ORIGINAL_THEME.replace('#', '')
							)
							const newStyle = this.updateStyle(
								innerText,
								originalCluster,
								themeCluster
							)
							let styleTag = document.getElementById(i)
							if (!styleTag) {
								styleTag = document.createElement('style')
								styleTag.id = i
								styleTag.innerText = newStyle
								head.appendChild(styleTag)
							}
						})
					}
				}

				const styles = [].slice.call(document.querySelectorAll('style'))

				styles.forEach(style => {
					const {
						innerText
					} = style
					if (typeof innerText !== 'string') return
					style.innerText = this.updateStyle(
						innerText,
						originalCluster,
						themeCluster
					)
				})
			},
			updateStyle (style, oldCluster, newCluster) {
				let newStyle = style
				oldCluster.forEach((color, index) => {
					newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
				})
				return newStyle
			},
			async getCSSString (url, callback, variable) {
				try {
					// 添加随机参数，避免缓存
					const urlWithCacheBuster = `${url}?t=${Date.now()}`;
					const response = await fetch(urlWithCacheBuster);
					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}
					const cssText = await response.text();
					const cleanedCssText = cssText.replace(/@font-face{[^}]+}/, '');
					if (variable) {
						this[variable] = cleanedCssText;
					}
					callback(cleanedCssText);
				} catch (error) {
					console.error('Failed to load CSS:', error);
					// 可以在这里添加更多错误处理逻辑，如重试机制等
				}
			},
			// getCSSString (url, callback, variable) {
			// 	const xhr = new XMLHttpRequest()
			// 	xhr.onreadystatechange = () => {
			// 		if (xhr.readyState === 4 && xhr.status === 200) {
			// 			if (variable) {
			// 				this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '')
			// 			}
			// 			callback(xhr.responseText)
			// 		}
			// 	}
			// 	xhr.open('GET', url)
			// 	xhr.send()
			// },

			getThemeCluster (theme) {
				const tintColor = (color, tint) => {
					let red = parseInt(color.slice(0, 2), 16)
					let green = parseInt(color.slice(2, 4), 16)
					let blue = parseInt(color.slice(4, 6), 16)

					if (tint === 0) {
						// when primary color is in its rgb space
						return [red, green, blue].join(',')
					} else {
						red += Math.round(tint * (255 - red))
						green += Math.round(tint * (255 - green))
						blue += Math.round(tint * (255 - blue))

						red = red.toString(16)
						green = green.toString(16)
						blue = blue.toString(16)

						return `#${red}${green}${blue}`
					}
				}

				const shadeColor = (color, shade) => {
					let red = parseInt(color.slice(0, 2), 16)
					let green = parseInt(color.slice(2, 4), 16)
					let blue = parseInt(color.slice(4, 6), 16)

					red = Math.round((1 - shade) * red)
					green = Math.round((1 - shade) * green)
					blue = Math.round((1 - shade) * blue)

					red = red.toString(16)
					green = green.toString(16)
					blue = blue.toString(16)

					return `#${red}${green}${blue}`
				}

				const clusters = [theme]
				for (let i = 0; i <= 9; i++) {
					clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
				}
				clusters.push(shadeColor(theme, 0.1))
				return clusters
			}
		}
	}
}
