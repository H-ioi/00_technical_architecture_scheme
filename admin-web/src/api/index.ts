import authApi from './modules/auth'
import baseDictApi from './modules/base-dict'
import captchaApi from './modules/captcha'
import membershipApi from './modules/membership'
import studentApi from './modules/member-student'
import teacherApi from './modules/member-teacher'
import menuApi from './modules/menu'
import protocolApi from './modules/protocol'

export { authApi, baseDictApi, captchaApi, membershipApi, studentApi, teacherApi, menuApi, protocolApi }
export type { CaptchaImageData } from '@/types/modules/captcha'
