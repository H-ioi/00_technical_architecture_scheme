const attendance = [
	["请假管理", "请假管理", "Leave Management"],
	["销假管理", "销假管理", "Cancel Leave Management"],
	["返校时间", "返校时间", "Return Time"],
	[
		"选择学生",
		"选择学生",
		"Select Student"
	],
	[
		"事假",
		"事假",
		"Personal"
	],
	[
		"病假",
		"病假",
		"Sick"
	],
	[
		"请假申请",
		"请假申请",
		"Leave Application"
	],
	[
		"请假类型",
		"请假类型",
		"Leave Type"
	],
	[
		"请假范围",
		"请假范围",
		"Scope"
	],
	[
		"固定假",
		"固定假",
		"Fixed"
	],
	[
		"星期",
		"星期",
		"Week"
	],
	[
		"请假时间",
		"请假时间",
		"Leave Time"
	],
	[
		"延期时间",
		"延期时间",
		"Extend End Time"
	],
	[
		"请选择延期时间",
		"请选择延期时间",
		"Please select extend end time"
	],
	[
		"请假原因",
		"请假原因",
		"Leave Reason"
	],
	[
		"附件",
		"附件",
		"Attachment"
	],
	[
		"时段",
		"时段",
		"Time Slot"
	],
	[
		"确认",
		"确认",
		"Confirm"
	],
	[
		"取消",
		"取消",
		"Cancel"
	],
	[
		"确定申请",
		"确定申请",
		"Submit Application"
	],
	[
		"课程",
		"课程",
		"Course"
	],
	[
		"宿舍",
		"宿舍",
		"Dorm"
	],
	[
		"校巴",
		"校巴",
		"Bus"
	],
	[
		"是",
		"是",
		"Yes"
	],
	[
		"否",
		"否",
		"No"
	],
	[
		"周一",
		"周一",
		"Monday"
	],
	[
		"周二",
		"周二",
		"Tuesday"
	],
	[
		"周三",
		"周三",
		"Wednesday"
	],
	[
		"周四",
		"周四",
		"Thursday"
	],
	[
		"周五",
		"周五",
		"Friday"
	],
	[
		"开始日期",
		"开始日期",
		"Start Date"
	],
	[
		"开始时间",
		"开始时间",
		"Start Time"
	],
	[
		"结束日期",
		"结束日期",
		"End Date"
	],
	[
		"请选择",
		"请选择",
		"Please Select"
	],
	[
		"请详细描述请假原因",
		"请详细描述请假原因",
		"Please describe the leave reason in detail"
	],
	[
		"将文件拖到此处，或",
		"将文件拖到此处，或",
		"Drag files here, or"
	],
	[
		"点击上传",
		"点击上传",
		"click to upload"
	],
	[
		"支持上传jpg/png/pdf/doc/docx文件，单文件不超过2MB",
		"支持上传jpg/png/pdf/doc/docx文件，单文件不超过2MB",
		"Support jpg/png/pdf/doc/docx files, single file not exceeding 2MB"
	],
	[
		"请假期间，家长负责孩子的安全",
		"请假期间，家长负责孩子的安全",
		"During leave, parents are responsible for child safety"
	],
	[
		"姓名",
		"姓名",
		"Name"
	],
	[
		"学校",
		"学校",
		"School"
	],
	[
		"年级",
		"年级",
		"Grade"
	],
	[
		"班级",
		"班级",
		"Class"
	],
	[
		"请选择学生",
		"请选择学生",
		"Please select student"
	],
	[
		"请选择请假类型",
		"请选择请假类型",
		"Please select leave type"
	],
	[
		"请选择请假范围",
		"请选择请假范围",
		"Please select leave scope"
	],
	[
		"请填写请假原因",
		"请填写请假原因",
		"Please fill in leave reason"
	],
	[
		"请选择请假时间",
		"请选择请假时间",
		"Please select leave time"
	],
	[
		"只能上传图片格式的文件",
		"只能上传图片格式的文件",
		"Only image files can be uploaded"
	],
	[
		"文件大小不能超过2MB",
		"文件大小不能超过2MB",
		"File size cannot exceed 2MB"
	],
	[
		"参数名",
		"参数名",
		"Parameter"
	],
	[
		"查询",
		"查询",
		"Query"
	],
	[
		"任务编号",
		"任务编号",
		"Task ID"
	],
	[
		"任务名称",
		"任务名称",
		"Task Name"
	],
	[
		"任务KEY",
		"任务KEY",
		"Task Key"
	],
	[
		"流程发起人",
		"流程发起人",
		"Initiator"
	],
	[
		"流程发起时间",
		"流程发起时间",
		"Initiation Time"
	],
	[
		"流程定义ID",
		"流程定义ID",
		"Process Def ID"
	],
	[
		"流程实例ID",
		"流程实例ID",
		"Process Inst ID"
	],
	[
		"审批人",
		"审批人",
		"Approver"
	],
	[
		"操作",
		"操作",
		"Action"
	],
	[
		"家长申请",
		"家长申请",
		"Parent Application"
	],
	[
		"重新填单",
		"重新填单",
		"Re-submit"
	],
	[
		"审批",
		"审批",
		"Approve"
	],
	[
		"查看流程进度",
		"查看流程进度",
		"View Process Progress"
	],
	[
		"流程审批",
		"流程审批",
		"Process Approval"
	],
	[
		"学生姓名",
		"学生姓名",
		"Student Name"
	],
	[
		"学号",
		"学号",
		"Student ID"
	],
	[
		"至",
		"至",
		"to"
	],
	[
		"审批通过",
		"审批通过",
		"Approve"
	],
	[
		"已拒绝",
		"已拒绝",
		"Rejected"
	],
	[
		"操作失败",
		"操作失败",
		"Operation failed"
	],
	[
		"审批拒绝",
		"审批拒绝",
		"Reject"
	],
	[
		"传染病",
		"传染病",
		"Infectious"
	],
	[
		"备注",
		"备注",
		"Remark"
	],
	[
		"流程图",
		"流程图",
		"Process Diagram"
	],
	[
		"选择审批人",
		"选择审批人",
		"Select Approver"
	],
	[
		"请选择审批人",
		"请选择审批人",
		"Please select approver"
	],
	[
		"确定",
		"确定",
		"Confirm"
	],
	[
		"流程名称",
		"流程名称",
		"Process Name"
	],
	[
		"发起人",
		"发起人",
		"Initiator"
	],
	[
		"发起时间",
		"发起时间",
		"Initiation Time"
	],
	[
		"结束时间",
		"结束时间",
		"End Time"
	],
	[
		"实例ID",
		"实例ID",
		"Instance ID"
	],
	[
		"提示",
		"提示",
		"Tip"
	],
	[
		"已取消删除",
		"已取消删除",
		"Delete cancelled"
	],
	[
		"操作成功",
		"操作成功",
		"Operation successful"
	],
	[
		"删除",
		"删除",
		"Delete"
	],
	[
		"批量删除",
		"批量删除",
		"Batch delete"
	],
	[
		"我的待办",
		"我的待办",
		"My Todo"
	],
	[
		"我的已办",
		"我的已办",
		"My Done"
	],
	[
		"我的发起",
		"我的发起",
		"My Initiated"
	],

	[
		"学校",
		"学校",
		"School"
	],
	[
		"学号/姓名",
		"学号/姓名",
		"Student ID/Name"
	],
	[
		"新增",
		"新增",
		"Add"
	],
	[
		"学号",
		"学号",
		"Student ID"
	],
	[
		"姓名",
		"姓名",
		"Name"
	],
	[
		"年级",
		"年级",
		"Grade"
	],
	[
		"班级",
		"班级",
		"Class"
	],
	[
		"固定假",
		"固定假",
		"Fixed"
	],
	[
		"请假范围",
		"请假范围",
		"Scope"
	],
	[
		"星期",
		"星期",
		"Week"
	],
	[
		"请假时间",
		"请假时间",
		"Leave Time"
	],

	[
		"状态",
		"状态",
		"Status"
	],
	[
		"创建时间",
		"创建时间",
		"Creation Time"
	],
	[
		"待审批",
		"待审批",
		"Pending Approval"
	],
	[
		"已结束",
		"已结束",
		"Completed"
	],
	[
		"确定对[id={id}]进行部署操作?",
		"确定对[id={id}]进行部署操作?",
		"Confirm deployment operation for [id={id}]?"
	],
	[
		"确定对[id={id}]进行删除操作?",
		"确定对[id={id}]进行删除操作?",
		"Confirm deletion operation for [id={id}]?"
	],
	[
		"部署操作成功",
		"部署操作成功",
		"Deployment successful"
	],
	[
		"课程",
		"课程",
		"Course"
	],
	[
		"活动",
		"活动",
		"Activity"
	],
	[
		"其他",
		"其他",
		"Others"
	],
	[
		"病假必须上传附件",
		"病假必须上传附件",
		"Medical leave must upload attachment"
	],
	[
		"请勾选注意事项",
		"请勾选注意事项",
		"Please check the notice"
	],
	[
		"上传成功",
		"上传成功",
		"Upload successful"
	],
	[
		"更新成功",
		"更新成功",
		"Update successful"
	],
	[
		"新增成功",
		"新增成功",
		"Add successful"
	],
	[
		"撤销",
		"撤销",
		"Withdraw"
	],
	[
		"销假",
		"销假",
		"Cancel"
	],
	[
		"销假中",
		"销假中",
		"Cancel ing"
	],
	[
		"已销假",
		"已销假",
		"Canceled"
	],
	[
		"未销假",
		"未销假",
		"Not Canceled"
	],
	[
		"是否销假",
		"销假",
		"Cancel Leave"
	],
	
	[
		"休假中",
		"休假中",
		"On Leave"
	],
	[
		"待休假",
		"待休假",
		"Pending Leave"
	],
	[
		"已撤销",
		"已撤销",
		"Withdrawn"
	],
	[
		"请选择星期",
		"请选择星期",
		"Please select week days"
	],
	[
		"销假申请",
		"销假申请",
		"Cancel Leave Application"
	],
	[
		"是否需要放行条",
		"是否需要放行条",
		"Is Passport Required"
	]
	,
	[
		"放行条生成",
		"放行条生成",
		"Generate Passport"
	]
	,
	[
		"放行方式",
		"放行方式",
		"Passport Method"
	]
	,
	[
		"放行日期",
		"放行日期",
		"Passport Date"
	]
	,
	[
		"请选择放行方式",
		"请选择放行方式",
		"Please select passport method"
	]
	,
	[
		"是否住宿",
		"是否住宿",
		"Is Dormitory"
	],
	["是否坐校巴", "是否坐校巴", "School Bus"],
	,
	[
		"父母接送",
		"父母接送",
		"Parents Pickup and Dropoff"
	]
	,
	[
		"自行离开",
		"自行离开",
		"Self Leave"
	]
	,
	[
		"确认销假",
		"确认销假",
		"Confirm Cancel Leave"
	],
	[
		"已生效",
		"已生效",
		"Effective"
	],
	[
		"作废",
		"作废",
		"Invalidated"
	],
	[
		"待生成",
		"待生成",
		"Pending Generation"
	],	
	[
		"已过期",
		"已过期",
		"Expired"
	],
	[
		"已结束",
		"已结束",
		"Completed"
	],
	[
		"批量生成",
		"批量生成",
		"Batch Generate"
	],
	[
		"批量生成放行条",
		"批量生成放行条",
		"Batch Generate Passport"
	],
	[
		"请选择放行时间",
		"请选择放行时间",
		"Please select passport time"
	]
	
	,
	[
		"是否离校",
		"是否离校",
		"Is Return"
	]
	,
	[
		"返校证明",
		"返校证明",
		"Return Proof"
	],
	
	[
		"请选择返校时间",
		"请选择返校时间",
		"Please select Return Time"
	],
	[
		"请选择要生成的数据",
		"请选择要生成的数据",
		"Please select the data to generate"
	],
	[
		"放行条管理",
		"放行条管理",
		"Passport Management"
	]
	,
	[
		"以上信息属实",
		"以上信息属实",
		"Above information is accurate"
	]
	,
	[
		"请勾选以上信息属实",
		"请勾选以上信息属实",
		"Please check above information is accurate"
	]
	,
	[
		"请上传附件",
		"请上传附件",
		"Please upload attachment"
	]
	,
	[
		"只能选择状态为待生成的数据",
		"只能选择状态为待生成的数据",
		"Only select data with status Pending Generation"
	]
	,
	[
		"生成",
		"生成",
		"Generate"
	],
	[
		"请选择时段",
		"请选择时段",
		"Please select time period"
	]
	,
	[
		"审批意见",
		"审批意见",
		"Approval Opinion"
	],
	[
		"来源",
		"来源",
		"Source"
	]
	,
	[
		"出勤日期",
		"出勤日期",
		"Attendance Date"
	]
	,
	[
		"考勤时间",
		"考勤时间",
		"Attendance Time"
	]
	,
	[
		"学生每日考勤",
		"学生每日考勤",
		"Student Daily Attendance"
	]
	,
	[
		"出勤",
		"出勤",
		"Present"
	]
		,
		[
		"迟到",
		"迟到",
		"Late"
	]
		,
		[
		"请假",
		"请假",
		"Leave"
	]
		,
		[
		"缺勤",
		"缺勤",
		"Absent"
		]
		,
		
	[
		"入校",
		"入校",
		"Enter"
	]
	,	
	[
		"离校",
		"离校",
		"Exit"
	]
	,	
	[
		"闸机",
		"闸机",
		"Gate"
	]
	,	
	[
		"爱莎圈",
		"爱莎圈",
		"Community"
	]
	,	
	[
		"放行人",
		"放行人",
		"Passenger"
	]
	,	
	[
		"放行方式",
		"放行方式",
		"Passport Method"
	]
	,	
	[
		"确定撤销操作",
		"确定撤销操作",
		"Confirm Withdraw Operation"
	]
	,	
	[
		"已生效的数据不能删除",
		"已生效的数据不能删除",
		"Effective data cannot be deleted"
	]

]
export default attendance
