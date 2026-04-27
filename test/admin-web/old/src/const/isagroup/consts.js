export default {
	// 校区ids
	schoolIds: {
		ISAIC: '爱莎科创中心',
		'CL6-0003': '武汉爱莎文华高级中学',
		'ISAWH-AC': '爱莎武汉国际学苑',
		ISALW: '爱莎荔湾学校',
		ISAIEG: '爱莎国际教育集团',
		'CL6-0002': '武汉爱莎外籍人员子女学校',
		'CL6-0001': '武汉爱莎文华学校',
		'CL5-0002': '广州荔湾爱莎外籍人员子女学校',
		'CL5-0001': '广州荔湾爱莎文华学校',
		'ISA': '爱莎国际学苑',
		'CL4-4268': '爱莎文华国际课程学院A Level中心',
		'CL3-323': '广州科学城爱莎外籍人员子女学校',
		'CL2-1312': '广州外国语爱莎文华IB国际课程',
		'CL1-ISG': '广州天河爱莎外籍人员子女学校',
	},
	// 不同分值对应颜色
	scoreColor: {
		veryLow: "#E13225",
		belowAverage: "#EEC29E",
		average: "#F8FF0F",
		aboveAverage: "#D1FFD2",
		veryHigh: "#75FB4C",
	},
	scoreColorList: [
		{
			label: "VERY LOW",
			value: "#E13225",
			progress: {
				min: 0,
				max: 74,
			},
			mb: {
				min: 1,
				max: 2,
			},
			pass: {
				min: 0.1,
				max: 5.99,
			},
			cat: {
				min: 0,
				max: 74,
			},
		},
		{
			label: "BELOW AVERAGE",
			value: "#EEC29E",
			progress: {
				min: 74,
				max: 88,
			},
			mb: {
				min: 3,
				max: 4,
			},
			pass: {
				min: 6,
				max: 20.99,
			},
			cat: {
				min: 74,
				max: 88,
			},
		},
		{
			label: "AVERAGE",
			value: "#F8FF0F",
			progress: {
				min: 89,
				max: 111,
			},
			mb: {
				min: 5,
				max: 5,
			},
			pass: {
				min: 21,
				max: 30.99,
			},
			cat: {
				min: 89,
				max: 111,
			},
		},
		{
			label: "ABOVE AVERAGE",
			value: "#D1FFD2",
			progress: {
				min: 112,
				max: 126,
			},
			mb: {
				min: 6,
				max: 6,
			},
			pass: {
				min: 1000,
				max: 1000,
			},
			cat: {
				min: 112,
				max: 126,
			},
		},
		{
			label: "VERY HIGH",
			value: "#75FB4C",
			progress: {
				min: 126,
				max: 1000,
			},
			mb: {
				min: 7,
				max: 7,
			},
			pass: {
				min: 31,
				max: 101,
			},
			cat: {
				min: 126,
				max: 1000,
			},
		},
	]
}