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
		/** 按校区 id 取展示名（详情等只读场景） */
		schoolLabelById (id) {
			if (id == null || id === "") return "";
			const row = this.schoolSelectList.find((s) => String(s.id) === String(id));
			return row ? this.schoolDropdownLabel(row) : "";
		},
		/** 多校区 id（数组或单值）拼接展示名 */
		schoolLabelsByIds (ids) {
			if (ids == null || ids === "") return "";
			const idList = Array.isArray(ids)
				? ids
				: [ids];
			const labels = idList
				.map((id) => this.schoolLabelById(id))
				.filter(Boolean);
			return labels.length ? labels.join(", ") : "";
		},
		/** 列表行 schoolEnNames ← schoolIds */
		applySchoolEnNamesFromIds (item) {
			const mapped = this.schoolLabelsByIds(item.schoolIds);
			item.schoolEnNames = mapped || item.schoolEnNames || "--";
		},
		/** 列表行 schoolEnName ← schoolId */
		applySchoolEnNameFromId (item) {
			const mapped = this.schoolLabelById(item.schoolId);
			item.schoolEnName = mapped || item.schoolEnName || "--";
		},
		/** 列表行 schoolName ← schoolId（考勤） */
		applySchoolNameFromId (item) {
			const mapped = this.schoolLabelById(item.schoolId);
			item.schoolName = mapped || item.schoolName || "--";
		},
		/** 详情对象 schoolEnNames ← schoolIds */
		withSchoolEnNamesFromIds (data) {
			if (!data) return data;
			return {
				...data,
				schoolEnNames:
					this.schoolLabelsByIds(data.schoolIds) || data.schoolEnNames || "--",
			};
		},
	},
};
