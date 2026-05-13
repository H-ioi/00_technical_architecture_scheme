<template>
  <div class="route-form-modal">
    <el-dialog
      v-model="showModal"
      class="route-form-modal__dialog"
      width="1040px"
      align-center
      :close-on-click-modal="false"
      destroy-on-close
      :title="routeDialogTitle">
      <div
        v-if="showModal"
        v-loading="detailLoading"
        class="route-form-modal__body"
        :element-loading-text="$t('common.loading')">
        <UniForm ref="uniFormRef" v-model="ruleForm" mode="edit" :config="mainFormConfig">
          <template #field-routeStopsEditor>
            <div class="route-form-modal__stops">
              <el-divider
                content-position="left"
                border-style="solid"
                class="route-form-modal__split">
                <span class="route-form-modal__split-title">{{
                  $t('schoolBus.routePlan.form.routeScheduleSection')
                }}</span>
              </el-divider>
              <div class="route-form-modal__schedule">
                <div class="route-form-modal__scroll">
                  <el-collapse
                    v-model="activeSchedulePanel"
                    accordion
                    class="route-form-modal__collapse">
                    <el-collapse-item
                      v-for="(item, index) in weekDays"
                      :key="`schedule-${index}`"
                      :name="String(index)">
                      <template #title>
                        <div class="route-form-modal__collapse-title">
                          <span class="route-form-modal__collapse-title-text">{{
                            $t('schoolBus.routePlan.form.scheduleBlockTitle', { n: index + 1 })
                          }}</span>
                          <el-button
                            v-if="weekDays.length > 1"
                            type="danger"
                            link
                            size="small"
                            class="route-form-modal__remove-group-btn"
                            @click.stop="delWeekDays(index)">
                            {{ $t('schoolBus.routePlan.form.removeWeekRow') }}
                          </el-button>
                        </div>
                      </template>
                      <div class="route-form-modal__block-body">
                        <div class="route-form-modal__toolbar-row">
                          <label
                            class="route-form-modal__field-label route-form-modal__field-label--inline"
                            >{{ $t('schoolBus.routePlan.form.routeWeekdays') }}</label
                          >
                          <el-select
                            v-model="item.weekDays"
                            class="route-form-modal__weekday-select"
                            multiple
                            collapse-tags
                            collapse-tags-tooltip
                            :placeholder="$t('schoolBus.routeOperation.pleaseSelect')">
                            <el-option
                              v-for="(d, k) in consts.WeeklyDays"
                              :key="k"
                              :label="d.label"
                              :value="d.value"
                              :disabled="isOptionDisabled(d.value, index)" />
                          </el-select>
                          <el-button
                            type="primary"
                            class="route-form-modal__add-stop-btn"
                            @click="addStation(index)">
                            {{ $t('schoolBus.routePlan.form.bindAddStop') }}
                          </el-button>
                        </div>

                        <el-table
                          class="route-form-modal__station-table"
                          :data="item.stationPrices"
                          border
                          stripe
                          size="small"
                          :header-cell-style="stationTableHeaderStyle"
                          :empty-text="$t('schoolBus.routePlan.form.stationTableEmpty')">
                          <el-table-column
                            v-for="col in bindStationCols"
                            :key="col.prop"
                            :prop="col.prop"
                            :label="$t(col.labelKey)"
                            :width="col.width"
                            :min-width="col.minWidth"
                            show-overflow-tooltip />
                          <el-table-column
                            fixed="right"
                            class-name="route-form-modal__col-actions"
                            :label="$t('schoolBus.routePlan.form.actionsColumn')"
                            width="132"
                            align="center">
                            <template #default="scope">
                              <div class="route-form-modal__row-actions">
                                <el-button
                                  type="primary"
                                  link
                                  size="small"
                                  @click="editCurrentStation(scope.row, scope.$index, index)">
                                  {{ $t('schoolBus.driver.actions.edit') }}
                                </el-button>
                                <el-button
                                  type="danger"
                                  link
                                  size="small"
                                  @click="delCurrentStation(scope.$index, index)">
                                  {{ $t('schoolBus.driver.actions.delete') }}
                                </el-button>
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
                <el-button
                  class="route-form-modal__add-group-btn"
                  plain
                  :disabled="!canAdd"
                  @click="addWeekDays">
                  {{ $t('schoolBus.routePlan.form.addScheduleGroup') }}
                </el-button>
              </div>
            </div>
          </template>
        </UniForm>
        <div class="route-form-modal__footer-actions">
          <el-button size="large" @click="closeModal">
            {{ $t('schoolBus.driver.actions.cancel') }}
          </el-button>
          <el-button type="primary" size="large" @click="submitForm">
            {{ $t('schoolBus.driver.actions.submit') }}
          </el-button>
        </div>
      </div>

      <el-dialog
        v-model="showAddStationModal"
        :title="stationDialogTitle"
        width="380px"
        destroy-on-close
        append-to-body
        :close-on-click-modal="false">
        <UniForm
          ref="nestedUniFormRef"
          v-model="addStationForm"
          mode="edit"
          :config="nestedStationFormConfig" />
        <div class="route-form-modal__nested-footer">
          <el-button size="small" @click="closeAddStationModal">
            {{ $t('schoolBus.driver.actions.cancel') }}
          </el-button>
          <el-button type="primary" size="small" @click="submitAddStationForm">
            {{ $t('schoolBus.driver.actions.submit') }}
          </el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UniFormConfig, UniOption } from 'uni-ui-lib'
import { UniForm, toUniOptions } from 'uni-ui-lib'
import type { PropType } from 'vue'

import { schoolBusCommonApi, schoolBusLineApi } from '@/api'
import type { SchoolOptionRecord } from '@/types/modules/membership'
import { normalizeApiArrayBody, normalizeSchoolBusDetailBody } from '@/utils/api-response-normalize'

import {
  BIND_STATION_TABLE_COLS,
  ROUTE_FORM_CONSTS,
  routePlanMainFormConfig,
  routePlanNestedStationFormConfig
} from '../tab.config'

type Loose = Record<string, unknown>

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

async function fetchSectionList(params: Record<string, unknown>) {
  return normalizeApiArrayBody(await schoolBusCommonApi.sectionList.get(params)) as Loose[]
}

async function fetchStationList(params: Record<string, unknown>) {
  return normalizeApiArrayBody(await schoolBusCommonApi.stationList.get(params)) as Loose[]
}

async function fetchCarinfoList(params: Record<string, unknown>) {
  return normalizeApiArrayBody(await schoolBusCommonApi.carinfoList.get(params)) as Loose[]
}

export default {
  name: 'RouteFormModal',

  components: {
    UniForm
  },

  props: {
    schoolRecords: {
      type: Array as PropType<SchoolOptionRecord[]>,
      default: () => []
    },
    locale: {
      type: String,
      default: 'zh-CN'
    }
  },

  emits: ['saved'],

  data() {
    return {
      consts: ROUTE_FORM_CONSTS,
      bindStationCols: BIND_STATION_TABLE_COLS,
      modalType: 'add' as 'add' | 'edit',
      showModal: false,
      ruleForm: {} as Loose,
      selectSectionList: [] as Loose[],
      selectStationList: [] as Loose[],
      carList: [] as Loose[],
      weekDays: [{ weekDays: [] as string[], stationPrices: [] as Loose[] }],
      canAdd: true,
      showAddStationModal: false,
      addStationForm: {} as Loose,
      stationModalType: 'add' as 'add' | 'edit',
      currentWeekDayIndex: -1,
      currentStationIndex: -1,
      /** `el-collapse` 手风琴当前展开项（name 与 weekDays 下标对应） */
      activeSchedulePanel: '0',
      /** 编辑态拉取路线详情时遮罩表单区 */
      detailLoading: false
    }
  },

  computed: {
    dictionary(): { school: SchoolOptionRecord[] } {
      return { school: this.schoolRecords ?? [] }
    },

    i18nlocel(): string {
      return this.locale === 'en' ? 'en' : 'zh-CN'
    },

    routeDialogTitle(): string {
      return this.modalType === 'add'
        ? this.$t('schoolBus.routePlan.actions.addRoute')
        : this.$t('schoolBus.routePlan.actions.editRoute')
    },

    stationDialogTitle(): string {
      return this.stationModalType === 'edit'
        ? this.$t('schoolBus.routePlan.form.modalEdit')
        : this.$t('schoolBus.routePlan.form.modalAdd')
    },

    stationTableHeaderStyle(): Record<string, string | number> {
      return {
        background: 'var(--el-fill-color-light)',
        color: 'var(--el-text-color-primary)',
        fontWeight: '600',
        fontSize: '13px',
        height: '40px'
      }
    },

    mainFormConfig(): UniFormConfig {
      const t = this.$t
      const schoolOptions = toUniOptions(this.schoolRecords ?? [], {
        labelKeys: this.i18nlocel === 'en' ? ['enName', 'name'] : ['name', 'cnName', 'enName'],
        valueKey: 'id'
      })

      const sectionOptions: UniOption[] = this.selectSectionList.map((i) => ({
        value: i.id as string | number,
        label: String(this.i18nlocel === 'en' ? i.enName : i.cnName)
      }))

      const carOptions: UniOption[] = this.carList.map((i) => ({
        value: i.id as string | number,
        label: String(i.carNumber ?? i.id)
      }))

      const routeTypeOptions: UniOption[] = ROUTE_FORM_CONSTS.routeType.map((o) => ({
        value: o.value,
        label: t(o.labelKey)
      }))

      const visibleOptions: UniOption[] = ROUTE_FORM_CONSTS.visibleType.map((o) => ({
        value: o.value,
        label: t(o.labelKey)
      }))

      return routePlanMainFormConfig(
        t,
        {
          showSchoolSelect: this.dictionary.school.length > 1,
          schoolOptions,
          sectionOptions,
          carOptions,
          routeTypeOptions,
          visibleOptions,
          onSchoolIdsChange: (ids) => this.changeSchool(ids as Array<string | number>)
        },
        this.dictionary.school.length > 1
      )
    },

    nestedStationFormConfig(): UniFormConfig {
      const base = routePlanNestedStationFormConfig(this.$t)
      const opts: UniOption[] = this.selectStationList.map((i) => ({
        value: i.id as string | number,
        label: String(this.i18nlocel === 'en' ? i.enName : i.cnName)
      }))

      return {
        ...base,
        schema: (base.schema ?? []).map((f) => {
          if (f.field === 'stationId') {
            return {
              ...f,
              options: opts,
              onChange: (ctx: { model: Loose }) => {
                this.changeStation(ctx.model.stationId as string | number)
              }
            }
          }

          return f
        })
      }
    }
  },

  watch: {
    weekDays: {
      handler(newVal: typeof this.weekDays) {
        this.checkAllDaysSelected(newVal)
      },
      deep: true
    }
  },

  methods: {
    async showForm(type: 'add' | 'edit' = 'add', item: Loose = {}) {
      this.modalType = type
      this.showModal = true
      this.activeSchedulePanel = '0'
      this.weekDays = [{ weekDays: [], stationPrices: [] }]
      this.ruleForm = { routeStopsEditor: '' }

      if (type !== 'add') {
        this.detailLoading = true
        try {
          await this.getDetail(item.id as string | number)
        } finally {
          this.detailLoading = false
        }
        return
      }

      if (this.dictionary.school.length === 1) {
        const schoolId = this.dictionary.school[0].id
        this.ruleForm = {
          ...this.ruleForm,
          schoolIds: [schoolId]
        }
        this.selectSectionList = await fetchSectionList({ schoolIds: [schoolId] })
        this.selectStationList = await fetchStationList({ schoolIds: [schoolId] })
        this.carList = await fetchCarinfoList({ schoolIds: [schoolId], isAll: 0 })
      }
    },

    async addData(data: Loose) {
      await schoolBusLineApi.add.post(data)
      ElMessage.success(this.$t('schoolBus.driver.messages.saveSuccess'))
      this.$emit('saved')
      this.closeModal()
    },

    async editData(data: Loose) {
      await schoolBusLineApi.edit.post(data)
      ElMessage.success(this.$t('schoolBus.driver.messages.saveSuccess'))
      this.$emit('saved')
      this.closeModal()
    },

    async getDetail(id: string | number) {
      const raw = await schoolBusLineApi.detail.get(id)
      const body = normalizeSchoolBusDetailBody(raw)

      if (!body) {
        return
      }

      const { schoolIds, sectionId, cnName, enName, lineType, visible, carIdList, weekDays } = body

      const carIds = Array.isArray(carIdList) ? carIdList : []
      const sid = schoolIds as Array<string | number>

      this.selectSectionList = await fetchSectionList({ schoolIds: sid })
      this.selectStationList = await fetchStationList({ schoolIds: sid })
      this.carList = await fetchCarinfoList({
        schoolIds: sid,
        isAll: 0,
        carId: carIds
      })

      this.$nextTick(() => {
        this.ruleForm = {
          routeStopsEditor: '',
          lineId: id,
          schoolIds,
          sectionId,
          cnName,
          enName,
          lineType: String(lineType),
          visible,
          carIdList: carIds
        }

        const clone = weekDays ? deepClone(weekDays) : [{ weekDays: [], stationPrices: [] }]

        if (!Array.isArray(clone) || clone.length === 0) {
          this.weekDays = [{ weekDays: [], stationPrices: [] }]
          this.activeSchedulePanel = '0'

          return
        }

        this.weekDays = clone.map((item: Loose) => {
          const row = { ...item }
          delete row.lineId

          const wd = row.weekDays

          if (typeof wd === 'string') {
            row.weekDays = String(wd)
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          } else if (Array.isArray(wd)) {
            row.weekDays = [...wd]
          } else {
            row.weekDays = []
          }

          if (row.stationPrices && Array.isArray(row.stationPrices)) {
            row.stationPrices = row.stationPrices.map((sp: Loose) => {
              const busStation = (sp.busStationDTO ?? {}) as Loose
              const stationName = this.i18nlocel === 'en' ? busStation.enName : busStation.cnName

              const goTime = sp.goTime as string | undefined
              const backTime = sp.backTime as string | undefined

              return {
                ...sp,
                stationName,
                showGoTime: goTime ? goTime.slice(0, 5) : '',
                showBackTime: backTime ? backTime.slice(0, 5) : ''
              }
            })
          } else {
            row.stationPrices = []
          }

          return row
        })

        this.activeSchedulePanel = '0'
      })
    },

    async submitForm() {
      const form = this.$refs.uniFormRef as
        | { validate: () => Promise<boolean | undefined> }
        | undefined

      if (!form?.validate) {
        return
      }

      const ok = await form.validate().catch(() => false)

      if (!ok) {
        return
      }

      if (this.isAllWeekDaysEmpty()) {
        ElMessage.error(this.$t('schoolBus.routePlan.messages.needWeekdaysAndStops'))

        return
      }

      const payload: Loose = {
        schoolIds: this.ruleForm.schoolIds,
        sectionId: this.ruleForm.sectionId,
        cnName: this.ruleForm.cnName,
        enName: this.ruleForm.enName,
        lineType: this.ruleForm.lineType,
        visible: this.ruleForm.visible,
        carIdList: this.ruleForm.carIdList,
        weekDays: deepClone(this.weekDays)
      }

      payload.weekDays = (payload.weekDays as Loose[]).map((item) => {
        const row = { ...item } as Loose
        row.weekDays = String(row.weekDays)

        if (Array.isArray(row.stationPrices)) {
          row.stationPrices = row.stationPrices.map((sp: Loose) => {
            const x = { ...sp }
            delete x.stationName
            delete x.showGoTime
            delete x.showBackTime

            return x
          })
        }

        return row
      })

      if (this.modalType === 'add') {
        await this.addData(payload)
      } else {
        payload.id = this.ruleForm.lineId
        await this.editData(payload)
      }
    },

    isAllWeekDaysEmpty(): boolean {
      return this.weekDays.some(
        (item) => item.weekDays.length === 0 || item.stationPrices.length === 0
      )
    },

    closeModal() {
      this.showModal = false
      this.activeSchedulePanel = '0'
      this.weekDays = [{ weekDays: [], stationPrices: [] }]
      const form = this.$refs.uniFormRef as { resetFields?: () => void } | undefined
      form?.resetFields?.()

      this.addStationForm = {}
    },

    addWeekDays() {
      this.weekDays.push({ weekDays: [], stationPrices: [] })
      this.$nextTick(() => {
        this.activeSchedulePanel = String(this.weekDays.length - 1)
      })
    },

    delWeekDays(index: number) {
      if (this.weekDays.length <= 1) {
        return
      }

      const prev = Number(this.activeSchedulePanel)
      const removed = index

      this.weekDays = this.weekDays.filter((_, i) => i !== index)

      this.$nextTick(() => {
        let next = prev

        if (removed === prev) {
          next = Math.min(prev, this.weekDays.length - 1)
        } else if (removed < prev) {
          next = prev - 1
        }

        this.activeSchedulePanel = String(Math.max(0, Math.min(next, this.weekDays.length - 1)))
      })
    },

    resetWeekDays() {
      this.weekDays = [{ weekDays: [], stationPrices: [] }]
      this.activeSchedulePanel = '0'
    },

    async changeSchool(e: Array<string | number>) {
      this.ruleForm.schoolIds = e
      this.resetWeekDays()
      delete this.ruleForm.sectionId
      delete this.ruleForm.carIdList
      this.selectSectionList = await fetchSectionList({ schoolIds: e })
      this.selectStationList = await fetchStationList({ schoolIds: e })
      this.carList = await fetchCarinfoList({ schoolIds: e, isAll: 0 })
    },

    isOptionDisabled(value: string, currentIndex: number) {
      for (let i = 0; i < this.weekDays.length; i++) {
        if (i !== currentIndex && this.weekDays[i].weekDays.includes(value)) {
          return true
        }
      }

      return false
    },

    checkAllDaysSelected(weekDays: Array<{ weekDays: string[]; stationPrices: Loose[] }>) {
      const allDays = new Set(ROUTE_FORM_CONSTS.WeeklyDays.map((d) => d.value))
      const selectedDays = new Set<string>()

      weekDays.forEach((item) => {
        item.weekDays.forEach((day) => {
          selectedDays.add(day)
        })
      })

      let allSelected = true

      allDays.forEach((day) => {
        if (!selectedDays.has(day)) {
          allSelected = false
        }
      })

      this.canAdd = !allSelected
    },

    addStation(weekDayIndex: number) {
      this.stationModalType = 'add'
      this.currentWeekDayIndex = weekDayIndex
      this.currentStationIndex = -1
      this.showAddStationModal = true
      this.addStationForm = {}
      this.$nextTick(() => {
        const f = this.$refs.nestedUniFormRef as { resetFields?: () => void } | undefined
        f?.resetFields?.()
      })
    },

    editCurrentStation(station: Loose, stationIndex: number, weekDayIndex: number) {
      this.stationModalType = 'edit'
      this.currentWeekDayIndex = weekDayIndex
      this.currentStationIndex = stationIndex
      this.showAddStationModal = true
      this.addStationForm = { ...station }
    },

    async delCurrentStation(stationIndex: number, weekDayIndex: number) {
      try {
        await ElMessageBox.confirm(
          this.$t('schoolBus.routePlan.form.confirmDeleteStop'),
          this.$t('schoolBus.driver.actions.delete'),
          {
            type: 'warning',
            confirmButtonText: this.$t('schoolBus.driver.actions.submit'),
            cancelButtonText: this.$t('schoolBus.driver.actions.cancel')
          }
        )
      } catch {
        return
      }

      this.weekDays[weekDayIndex].stationPrices.splice(stationIndex, 1)
    },

    closeAddStationModal() {
      this.currentWeekDayIndex = -1
      this.showAddStationModal = false
      this.addStationForm = {}
      const f = this.$refs.nestedUniFormRef as { resetFields?: () => void } | undefined
      f?.resetFields?.()
    },

    changeStation(id: string | number) {
      this.selectStationList.forEach((i) => {
        if (String(i.id) === String(id)) {
          this.addStationForm = {
            ...this.addStationForm,
            stationName: this.i18nlocel === 'en' ? i.enName : i.cnName
          }
        }
      })
    },

    async submitAddStationForm() {
      const form = this.$refs.nestedUniFormRef as
        | { validate: () => Promise<boolean | undefined> }
        | undefined

      if (!form?.validate) {
        return
      }

      const ok = await form.validate().catch(() => false)

      if (!ok) {
        return
      }

      let pass = true

      if (!this.addStationForm.goTime && !this.addStationForm.backTime) {
        pass = false
        ElMessage.warning(this.$t('schoolBus.routePlan.form.pickGoOrBackTime'))
      }

      if (!pass) {
        return
      }

      if (this.currentWeekDayIndex === -1) {
        return
      }

      const newStation = {
        ...this.addStationForm,
        showGoTime: this.addStationForm.goTime
          ? String(this.addStationForm.goTime).slice(0, 5)
          : '',
        showBackTime: this.addStationForm.backTime
          ? String(this.addStationForm.backTime).slice(0, 5)
          : ''
      }

      const stationPrices = this.weekDays[this.currentWeekDayIndex].stationPrices

      if (this.currentStationIndex !== -1) {
        stationPrices.splice(this.currentStationIndex, 1, newStation)
        this.currentStationIndex = -1
      } else {
        stationPrices.push(newStation)
      }

      this.closeAddStationModal()
    }
  }
}
</script>

<style scoped lang="scss">
.route-form-modal__dialog {
  :deep(.el-dialog__header) {
    padding-bottom: 8px;
    margin-right: 0;
  }

  :deep(.el-dialog__body) {
    padding-top: 8px;
  }
}

.route-form-modal__body {
  padding-bottom: 0;
}

.route-form-modal__footer-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.route-form-modal__nested-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

.route-form-modal__split {
  margin: 8px 0 16px;

  :deep(.el-divider__text) {
    background-color: var(--el-bg-color);
  }
}

.route-form-modal__stops {
  width: 100%;
  box-sizing: border-box;
}

.route-form-modal__split-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.route-form-modal__schedule {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

.route-form-modal__scroll {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-height: min(56vh, 520px);
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 4px;
}

.route-form-modal__collapse {
  width: 100%;
  border: none;
  --el-collapse-border-color: transparent;

  :deep(.el-collapse-item) {
    margin-bottom: 12px;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
    overflow: hidden;
    background: var(--el-fill-color-blank);
  }

  :deep(.el-collapse-item__header) {
    height: auto;
    min-height: 48px;
    padding: 10px 14px;
    background: var(--el-fill-color-light);
    font-weight: 600;
    line-height: 1.4;
  }

  :deep(.el-collapse-item__arrow) {
    margin-right: 8px;
  }

  :deep(.el-collapse-item__wrap) {
    border-bottom: none;
  }

  :deep(.el-collapse-item__content) {
    padding: 16px;
    background: var(--el-fill-color-blank);
  }
}

.route-form-modal__collapse-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding-right: 4px;
  box-sizing: border-box;
}

.route-form-modal__collapse-title-text {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  text-align: left;
}

.route-form-modal__remove-group-btn {
  flex-shrink: 0;
}

.route-form-modal__add-group-btn {
  width: 100%;
  margin-top: 4px;
  padding-top: 12px;
  padding-bottom: 12px;
  font-size: 14px;
  border-style: dashed;
  border-width: 1px;
  background: transparent;
  color: var(--el-color-primary);

  &:hover {
    color: var(--el-color-primary-light-3);
    border-color: var(--el-color-primary-light-5);
    background: var(--el-color-primary-light-9);
  }

  &.is-disabled {
    color: var(--el-text-color-disabled);
    border-color: var(--el-border-color-light);
    background: transparent;
  }
}

.route-form-modal__block-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
}

.route-form-modal__toolbar-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  row-gap: 10px;
  width: 100%;
  box-sizing: border-box;
}

.route-form-modal__field-label--inline {
  flex: 0 0 auto;
  margin: 0;
  padding-top: 0;
  line-height: 32px;
  white-space: nowrap;
}

.route-form-modal__weekday-select {
  flex: 0 1 280px;
  width: 280px;
  max-width: 100%;
  min-width: 200px;

  :deep(.el-select__wrapper) {
    width: 100%;
  }
}

.route-form-modal__add-stop-btn {
  flex: 0 0 auto;
  margin-left: auto;
  min-height: 36px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
}

.route-form-modal__field-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--el-text-color-regular);
  line-height: 1.4;
}

.route-form-modal__station-table {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;

  :deep(.el-table__inner-wrapper::before) {
    display: none;
  }

  :deep(.el-table__cell) {
    padding: 8px 10px;
  }
}

.route-form-modal__row-actions {
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 4px;
  white-space: nowrap;
}

:deep(.route-plan-main-form__stops-slot) {
  margin-bottom: 0;

  .el-form-item__content {
    margin-left: 0 !important;
    width: 100%;
    max-width: 100%;
  }
}
</style>
