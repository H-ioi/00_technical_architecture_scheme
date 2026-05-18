import { getNewSchoolList } from "@/api/isacommunity/buscommon.js";

/**
 * 校区下拉数据改为 /buscommon/getNewSchoolList，替代 Vuex dictionary['school']
 * 用法：mixins 引入后模板用 schoolSelectList，标签 :label="schoolDropdownLabel(i)" :value="i.id"
 * 初始化单校区逻辑用 schoolSelectList.length === 1
 */
export default {
	data () {
		return {
			schoolListBuscommon: [],
		};
	},
	computed: {
		schoolSelectList () {
			return Array.isArray(this.schoolListBuscommon) ? this.schoolListBuscommon : [];
		},
	},
	methods: {
		async fetchSchoolListBuscommon () {
			try {
				const list = await getNewSchoolList();
				this.schoolListBuscommon = Array.isArray(list) ? list : [];
			} catch (e) {
				this.schoolListBuscommon = [];
			}
		},
		schoolDropdownLabel (row) {
			if (!row) return "";
			return this.i18nlocel === "en"
				? row.enName || row.cnName || row.label || ""
				: row.cnName || row.label || row.enName || "";
		},
	},
};
