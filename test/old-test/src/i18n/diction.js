import common from './list/common'
import btn from './list/btn'
import attendance from './list/attendance'	
import dorm from './list/dorm'	
import form from './list/form'
import table from './list/table'
import route from './list/route'
import consult from './list/consult'
import isagroup from './list/isagroup'
import community from './list/community'
import mail from './list/mail'
import schoolDoctor from './list/schoolDoctor'
import busAttendance from './list/busAttendance'
import schoolbus from './list/schoolbus'
let data = {
	"version": "1.0.1",
	"lang_order": [
		"option_key",
		"zh",//中文
		"en"//英文
	],
	"desc": "key, 中文，英文",
	"dict": {
		//公用
		common,
		// 按钮
		btn,
		// 表格
		table,
		// 表单
		form,
		// 路由名称
		route,
		// 咨询管理
		consult,
		// 爱莎国籍教育
		isagroup,
		// 爱莎圈
		community,
		// 考勤管理
		attendance,
		dorm,
		// 邮件管理
		mail,
		// 校医管理
		schoolDoctor,
		// 校巴考勤
		busAttendance,
		// 校巴管理
		schoolbus

	}
}
export default data
