const isaData = {
    nationalityTable: [
        { label: "方向/学部", prop: 'divisionName', width: "200px", fixed: 'left', hasEn: true },
        { label: "国籍", prop: 'countryName', width: "200px", fixed: '', hasEn: true },
    ],
    genderTable: [
        { label: "方向/学部", prop: 'divisionName', width: "200px", fixed: 'left', hasEn: true },
        { label: "性别", prop: 'gender', width: "200px", fixed: '', hasEn: true },
    ],
    gradeTable: [
        { label: "方向/学部", prop: 'divisionName', width: "200px", fixed: 'left', hasEn: true },
        { label: "年级", prop: 'gradeCode', width: "200px", fixed: '', hasEn: true },
        { label: "男生数量", prop: 'maleCounts', width: "", fixed: '', hasEn: true },
        { label: "女生数量", prop: 'femaleCounts', width: "", fixed: '', hasEn: true },
        { label: "其他数量", prop: 'otherCounts', width: "", fixed: '', hasEn: true },
        { label: "总数量", prop: 'totalCounts', width: "", fixed: '', hasEn: true },
    ],
    stayTable: [
        { label: "方向/学部", prop: 'divisionName', width: "200px", fixed: 'left', hasEn: true },
        { label: "年级", prop: 'gradeCode', width: "", fixed: '', hasEn: true },
        { label: "男生数量", prop: 'maleCounts', width: "", fixed: '', hasEn: true },
        { label: "女生数量", prop: 'femaleCounts', width: "", fixed: '', hasEn: true },
        { label: "其他数量", prop: 'otherCounts', width: "", fixed: '', hasEn: true },
        { label: "总数量", prop: 'totalCounts', width: "", fixed: '', hasEn: true },
    ],
    enrolledTable: [
        { label: "年份", prop: 'schoolYear', width: "", fixed: 'left', hasEn: true },
        { label: "方向/学部", prop: 'divisionName', width: "", fixed: '', hasEn: true },
        { label: "入读学生数量", prop: 'totalCounts', width: "", fixed: '', hasEn: true },
        // { label: "男生数量", prop: 'maleCounts', width: "", fixed: '', hasEn: true },
        // { label: "女生数量", prop: 'femaleCounts', width: "", fixed: '', hasEn: true },
        // { label: "其他数量", prop: 'otherCounts', width: "", fixed: '', hasEn: true },
    ],
    dimensionList: [
        { label: "学生国籍分布表",enLabel:"Distribution table of student nationalities", value: "1" },
        { label: "年度入读学生统计表",enLabel:"Statistics of Annual Enrollment of Student", value: "2" },
        { label: "住宿学生年级分布表",enLabel:"Distribution  of Resident Student grades", value: "3" },
        { label: "学生年级分布表",enLabel:"Distribution table of student grades", value: "4" },
        { label: "学生性别分布表",enLabel:"Distribution table of student genders", value: "5" },
    ],
    genderList: [
        { label: "男-Male", value: 'Male' },
        { label: "女-Female", value: 'Female' },
    ],

}
export default isaData