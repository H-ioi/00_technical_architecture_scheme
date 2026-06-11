import type {
  AttendanceFlowDefListParams,
  AttendanceHolidayListParams,
  AttendanceHolidayReturnListParams,
  AttendanceLeavePassListParams,
  AttendanceProcDefListParams
} from '@/types/modules/attendance-holiday'
import { request } from 'uni-ui-lib'

const attendanceBase = '/attendance'

/** 请假管理、流程与放行条等（旧 `api/isacommunity/holiday.js`，`baseUrl` `/attendance`）。 */
export default {
  holidayPage: {
    url: `${attendanceBase}/holiday/page`,
    name: '请假分页',
    get: async function (this: { url: string }, params: AttendanceHolidayListParams) {
      return await request.get(this.url, { params })
    }
  },
  /** 销假分页（旧 `listHolidayEnd`）。 */
  holidayReturnPage: {
    url: `${attendanceBase}/holiday-return/return-page`,
    name: '销假分页',
    get: async function (this: { url: string }, params: AttendanceHolidayReturnListParams) {
      return await request.get(this.url, { params })
    }
  },
  /** 请假详情（旧 `getHolidayInfo`）。 */
  holidayDetail: {
    name: '请假详情',
    get: async (id: string | number) => {
      return await request.get(`${attendanceBase}/holiday/${id}`)
    }
  },
  /** 撤回流程（旧 `cancelFlow(procId, id)` → GET `/holiday/back/:procId/:id`；`procId` 缺省时旧前端亦拼出字面段 `null`。 */
  holidayCancelFlow: {
    name: '撤回请假流程',
    get: async (procId: string | number, id: string | number) => {
      return await request.get(`${attendanceBase}/holiday/back/${procId}/${id}`)
    }
  },
  /** 新建请假（旧 `saveHoliday` POST `/holiday/save`）。 */
  holidaySave: {
    name: '新建请假',
    post: async (data: unknown) => {
      return await request.post(`${attendanceBase}/holiday/save`, data)
    }
  },
  /** 更新请假（旧 `updateHoliday` POST `/holiday/update`）。 */
  holidayUpdate: {
    name: '更新请假',
    post: async (data: unknown) => {
      return await request.post(`${attendanceBase}/holiday/update`, data)
    }
  },
  /** 删除请假记录（旧 `deleteHoliday(id)` DELETE `/holiday/:id`）。 */
  holidayDelete: {
    name: '删除请假',
    remove: async (id: string | number) => {
      return await request.delete(`${attendanceBase}/holiday/${id}`)
    }
  },
  /** 提交销假（旧 `saveHolidayEnd` POST `/holiday-return/save-holiday-return`）。 */
  holidayReturnSave: {
    name: '提交销假',
    post: async (data: unknown) => {
      return await request.post(`${attendanceBase}/holiday-return/save-holiday-return`, data)
    }
  },

  // —— 请假模块-通知邮箱配置（旧 `api/isacommunity/config.js`） ——
  sysConfigList: {
    name: '配置列表',
    get: async (params: { school?: string }) => {
      return await request.get(`${attendanceBase}/sys/config/list`, { params })
    }
  },
  sysConfigSave: {
    name: '新增配置',
    post: async (data: unknown) => {
      return await request.post(`${attendanceBase}/sys/config/save`, data)
    }
  },
  sysConfigUpdate: {
    name: '更新配置',
    post: async (data: unknown) => {
      return await request.post(`${attendanceBase}/sys/config/update`, data)
    }
  },
  sysConfigDelete: {
    name: '删除配置',
    remove: async (id: string | number) => {
      return await request.delete(`${attendanceBase}/sys/config/${id}`)
    }
  },

  // —— 放行条（旧 `holiday.js` `leave/pass/*`） ——
  leavePassPage: {
    name: '放行条分页',
    get: async (params: AttendanceLeavePassListParams & { current?: number; size?: number }) => {
      return await request.get(`${attendanceBase}/leave/pass/page`, { params })
    }
  },
  leavePassSave: {
    name: '新增放行条',
    post: async (data: unknown) => {
      return await request.post(`${attendanceBase}/leave/pass/save`, data)
    }
  },
  leavePassUpdate: {
    name: '更新放行条',
    post: async (data: unknown) => {
      return await request.post(`${attendanceBase}/leave/pass/update`, data)
    }
  },
  leavePassUpdateStatus: {
    name: '放行条单条状态',
    post: async (data: unknown) => {
      return await request.post(`${attendanceBase}/leave/pass/updateStatus`, data)
    }
  },
  leavePassUpdateBatchStatus: {
    name: '放行条批量状态',
    post: async (data: unknown) => {
      return await request.post(`${attendanceBase}/leave/pass/updateBatchStatus`, data)
    }
  },

  // —— 流程定义建模（旧 `flow/flwdemodel/*`） ——
  flowDefList: {
    name: '流程定义分页',
    get: async (params: AttendanceFlowDefListParams & { page?: number; limit?: number }) => {
      return await request.get(`${attendanceBase}/flow/flwdemodel/list`, { params })
    }
  },
  flowDefSave: {
    name: '保存流程定义',
    post: async (data: Record<string, unknown>) => {
      const body = { ...data }
      const raw = body.modeXml ?? body.modelXml
      body.modeXml = JSON.stringify(raw)
      if ('modelXml' in body) {
        delete body.modelXml
      }
      return await request.post(`${attendanceBase}/flow/flwdemodel/save`, body)
    }
  },
  flowDefGet: {
    name: '流程定义详情',
    get: async (id: string | number) => {
      return await request.get(`${attendanceBase}/flow/flwdemodel/${id}`)
    }
  },
  flowDefDelete: {
    name: '删除流程定义',
    remove: async (id: string | number) => {
      return await request.delete(`${attendanceBase}/flow/flwdemodel/delete/${id}`)
    }
  },
  flowDeploy: {
    name: '部署流程',
    get: async (id: string | number) => {
      return await request.get(`${attendanceBase}/flow/flwdemodel/deployFlow/${id}`)
    }
  },
  flowDeployDelete: {
    name: '删除部署',
    remove: async (deploymentId: string | number) => {
      return await request.delete(`${attendanceBase}/flow/flwdemodel/deployFlow/${deploymentId}`)
    }
  },
  flowDeployDefGet: {
    name: '部署定义表单',
    get: async (id: string | number) => {
      return await request.get(`${attendanceBase}/flow/deploy/flowDef/${id}`)
    }
  },
  procDefList: {
    name: '流程部署分页',
    get: async (params: AttendanceProcDefListParams) => {
      return await request.get(`${attendanceBase}/flow/deploy/listProcDef`, { params })
    }
  },
  flowVariableSet: {
    name: '设置流程变量',
    post: async (data: unknown) => {
      return await request.post(`${attendanceBase}/flow/instance/variable`, data)
    }
  },
  flowProcessImgDownload: {
    name: '流程定义图',
    getBlob: async (defId: string | number) => {
      return await request.get<Blob, Blob>(
        `${attendanceBase}/file/fileController/downloadFlowImg`,
        {
          params: { defId },
          responseType: 'blob'
        }
      )
    }
  },
  flowActiveImgDownload: {
    name: '流程实例活动图',
    getBlob: async (procId: string | number) => {
      return await request.get<Blob, Blob>(
        `${attendanceBase}/file/fileController/downloadFlowActiveImg`,
        {
          params: { procId },
          responseType: 'blob'
        }
      )
    }
  },

  // —— 任务实例（旧 `flow/instance/*`） ——
  flowMyTodo: {
    name: '我的待办',
    get: async (params: { page?: number; limit?: number; key?: string }) => {
      return await request.get(`${attendanceBase}/flow/instance/myTodoTaskList`, { params })
    }
  },
  flowMyStart: {
    name: '我的发起',
    get: async (params: { page?: number; limit?: number; key?: string }) => {
      return await request.get(`${attendanceBase}/flow/instance/myStartTaskList`, { params })
    }
  },
  flowMyComplete: {
    name: '我的已办',
    get: async (params: { page?: number; limit?: number; key?: string }) => {
      return await request.get(`${attendanceBase}/flow/instance/myCompleteTaskList`, { params })
    }
  },
  flowFormByProcess: {
    name: '按实例取业务表单',
    get: async (params: { processId: string | number }) => {
      return await request.get(`${attendanceBase}/flow/instance/getFormByBussId`, { params })
    }
  },
  flowHiTaskInstance: {
    name: '历史任务节点',
    get: async (processInstanceId: string | number) => {
      return await request.get(
        `${attendanceBase}/flow/instance/getHiTaskInstance/${processInstanceId}`
      )
    }
  },
  flowCompleteTask: {
    name: '审批通过',
    post: async (data: unknown) => {
      return await request.post(`${attendanceBase}/flow/instance/completeFlow`, data)
    }
  },
  flowRejectTask: {
    name: '审批拒绝',
    post: async (data: unknown) => {
      return await request.post(`${attendanceBase}/flow/instance/rejectFlow`, data)
    }
  }
}
