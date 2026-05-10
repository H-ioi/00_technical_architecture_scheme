import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ElementLocale from 'element-ui/lib/locale'
import elementEnLocale from 'element-ui/lib/locale/lang/en'  // elementui 的英文语言包
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN' // elementui 的中文语言包
import output_dicts from './lang' // 将对应的语言包引入
import store from '@/store'
Vue.use(VueI18n)

const messages = {
    'zh': {  // 中文包
        message: '你好',
        ...output_dicts.zh,
        ...elementZhLocale
    },
    'en': {  // 英文包
        ...output_dicts.en,
        ...elementEnLocale
    }
}

const i18n = new VueI18n({
    locale: store.getters.i18nlocel,
    messages,
    silentTranslationWarn: true
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

export default i18n