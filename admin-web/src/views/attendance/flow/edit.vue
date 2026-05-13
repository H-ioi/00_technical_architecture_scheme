<template>
  <section class="holiday-flow-design uni-list-page">
    <div class="uni-list-page__header">
      <div>
        <h1>{{ pageHeading }}</h1>
        <p class="holiday-flow-design__page-desc">
          {{ $t('attendance.holidayFlow.design.pageDescription') }}
        </p>
      </div>
      <div class="uni-list-page__header-actions holiday-flow-design__header-actions">
        <template v-if="showDesignHeaderTools">
          <el-button plain @click="showXml">
            {{ $t('attendance.holidayFlow.design.viewXml') }}
          </el-button>
          <el-button @click="importVisible = true">
            {{ $t('attendance.holidayFlow.design.importXml') }}
          </el-button>
        </template>
        <el-button type="primary" @click="submitConfig">
          {{ $t('attendance.holidayFlow.design.save') }}
        </el-button>
        <el-divider direction="vertical" class="holiday-flow-design__header-divider" />
        <el-button @click="goBack">{{ $t('attendance.holidayFlow.design.back') }}</el-button>
      </div>
    </div>
    <el-tabs v-model="activeTab" class="holiday-flow-design__tabs">
      <el-tab-pane :label="$t('attendance.holidayFlow.design.tabForm')" name="form">
        <div class="holiday-flow-design__form-pane">
          <UniForm ref="uniFormRef" v-model="formModel" mode="edit" :config="flowFormConfig" />
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-if="formModel.needApproval !== '102'"
        :label="$t('attendance.holidayFlow.design.tabBpmn')"
        name="design">
        <div class="holiday-flow-design__bpmn-shell">
          <div class="holiday-flow-design__bpmn">
            <div ref="canvasRef" class="holiday-flow-design__canvas"></div>
            <aside id="js-properties-panel-holiday" class="holiday-flow-design__panel"></aside>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      v-model="xmlVisible"
      :title="$t('attendance.holidayFlow.design.viewXml')"
      width="80%"
      destroy-on-close>
      <el-input
        v-model="xmlContent"
        type="textarea"
        :rows="18"
        readonly
        class="holiday-flow-design__xml" />
      <template #footer>
        <el-button @click="xmlVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="copyXml">{{
          $t('attendance.holidayFlow.design.copyXml')
        }}</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="importVisible"
      :title="$t('attendance.holidayFlow.design.importXml')"
      width="80%"
      destroy-on-close>
      <el-input
        v-model="importXml"
        type="textarea"
        :rows="16"
        :placeholder="$t('attendance.holidayFlow.design.importPh')" />
      <template #footer>
        <el-button @click="importVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="confirmImport">{{ $t('common.submit') }}</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
// @ts-expect-error bpmn default
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/diagram-js.css'
import BpmnModeler from 'bpmn-js/lib/Modeler'
// @ts-expect-error default export
import propertiesPanelModule from 'bpmn-js-properties-panel'
// @ts-expect-error default export
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
import { ElMessage } from 'element-plus'
import type { UniFormConfig } from 'uni-ui-lib'
import { UniForm, toUniOptions, useUniI18n } from 'uni-ui-lib'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { buildFlowEditFormConfig } from './edit.config'
import { holidayFlowDefaultXml } from './xml-str'

import { attendanceHolidayApi, membershipApi } from '@/api'
import { normalizeApiEnvelope } from '@/utils/api-response-normalize'
import type { SchoolOptionRecord } from '@/types/modules/membership'

type FlowEditFormModel = {
  id: string
  name: string
  type: string
  modelKey: string
  schools: string[]
  leaveType: string
  isFixed: string
  canRevoke: string
  needApproval: string
}

const emptyFlowForm = (): FlowEditFormModel => ({
  id: '',
  name: '',
  type: 'holiday',
  modelKey: '',
  schools: [],
  leaveType: '',
  isFixed: '',
  canRevoke: '101',
  needApproval: '101'
})

const customTranslateModule = {
  translate: ['value', (tpl: string) => tpl]
}

const { locale, t } = useUniI18n()
const route = useRoute()
const router = useRouter()

const activeTab = ref<'form' | 'design'>('form')
const canvasRef = ref<HTMLDivElement | null>(null)
const uniFormRef = ref<InstanceType<typeof UniForm> | null>(null)
const schoolList = ref<SchoolOptionRecord[]>([])

const xmlVisible = ref(false)
const xmlContent = ref('')
const importVisible = ref(false)
const importXml = ref('')

const formModel = ref<FlowEditFormModel>(emptyFlowForm())

const schoolOptions = computed(() =>
  toUniOptions(schoolList.value, {
    labelKeys:
      locale() === 'en'
        ? (['enName', 'name', 'cnName'] as Array<keyof SchoolOptionRecord>)
        : (['name', 'cnName', 'enName'] as Array<keyof SchoolOptionRecord>),
    valueKey: 'enName'
  })
)

const flowFormConfig = computed<UniFormConfig>(() =>
  buildFlowEditFormConfig(t, schoolOptions.value)
)

const isCreateFlow = computed(() => {
  const id = route.params.id as string | undefined
  return id === undefined || id === ''
})

const pageHeading = computed(() =>
  isCreateFlow.value
    ? t('attendance.holidayFlow.design.pageTitleCreate')
    : t('attendance.holidayFlow.design.pageTitleEdit', { id: String(route.params.id) })
)

/** 仅在「流程设计」子 Tab 展示 XML 工具，与设计区操作一致且避免在「流程配置」误点 */
const showDesignHeaderTools = computed(
  () => formModel.value.needApproval !== '102' && activeTab.value === 'design'
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let bpmnModeler: any = null

const initDiagram = async () => {
  await nextTick()
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }
  bpmnModeler = new BpmnModeler({
    container: canvas,
    propertiesPanel: {
      parent: '#js-properties-panel-holiday'
    },
    additionalModules: [propertiesPanelModule, propertiesProviderModule, customTranslateModule],
    moddleExtensions: {
      camunda: camundaModdleDescriptor
    }
  })
  bpmnModeler.importXML(holidayFlowDefaultXml, () => {})
}

const loadDetail = async (id: string) => {
  const raw = await attendanceHolidayApi.flowDefGet.get(id)
  const res = normalizeApiEnvelope(raw)
  if (!res || Object.keys(res).length === 0) {
    return
  }
  formModel.value.id = String(res.id ?? '')
  formModel.value.name = String(res.name ?? '')
  formModel.value.type = String(res.type ?? 'holiday')
  formModel.value.modelKey = String(res.modelKey ?? '')
  formModel.value.schools = Array.isArray(res.schools) ? (res.schools as string[]) : []
  formModel.value.leaveType = String(res.leaveType ?? '')
  formModel.value.isFixed = res.isFixed != null ? String(res.isFixed) : ''
  formModel.value.canRevoke = String(res.canRevoke ?? '101')
  formModel.value.needApproval = String(res.needApproval ?? '101')
  const xmlRaw = String(res.modelXml ?? '')
  const xml = (() => {
    try {
      return decodeURIComponent(xmlRaw)
    } catch {
      return xmlRaw
    }
  })()
  if (bpmnModeler && xml) {
    bpmnModeler.importXML(xml, (err: Error | null) => {
      if (err) {
        ElMessage.error(err.message)
      }
    })
  }
}

onMounted(async () => {
  schoolList.value = await membershipApi.school.get()
  await initDiagram()
  const id = route.params.id as string | undefined
  if (id && id !== 'create') {
    await loadDetail(id)
  }
})

onBeforeUnmount(() => {
  bpmnModeler?.destroy?.()
  bpmnModeler = null
})

const showXml = () => {
  if (!bpmnModeler) {
    return
  }
  bpmnModeler.saveXML({ format: true }, (err: Error | null, xml?: string) => {
    if (err || !xml) {
      ElMessage.error(err?.message ?? 'XML')
      return
    }
    xmlContent.value = xml
    xmlVisible.value = true
  })
}

const copyXml = async () => {
  try {
    await navigator.clipboard.writeText(xmlContent.value)
    ElMessage.success(t('attendance.holidayFlow.design.copyOk'))
  } catch {
    ElMessage.error('Clipboard')
  }
}

const confirmImport = () => {
  if (!importXml.value.trim()) {
    ElMessage.error(t('attendance.holidayFlow.design.importEmpty'))
    return
  }
  if (!bpmnModeler) {
    return
  }
  bpmnModeler.importXML(importXml.value, (err: Error | null) => {
    if (err) {
      ElMessage.error(err.message)
    } else {
      ElMessage.success('OK')
      importVisible.value = false
    }
  })
}

const goBack = () => {
  void router.push({ path: '/attendance/flow' })
}

const submitConfig = async () => {
  try {
    await uniFormRef.value?.validate()
  } catch {
    return
  }
  if (!bpmnModeler) {
    return
  }
  bpmnModeler.saveXML({ format: true }, async (err: Error | null, xml?: string) => {
    if (err || !xml) {
      ElMessage.error(err?.message ?? 'XML')
      return
    }
    const payload = {
      ...formModel.value,
      modelXml: encodeURIComponent(xml)
    }
    await attendanceHolidayApi.flowDefSave.post(payload as Record<string, unknown>)
    ElMessage.success(t('attendance.holidayFlow.design.saveOk'))
    setTimeout(() => goBack(), 400)
  })
}
</script>

<style scoped lang="scss">
$holidays-flow-stage-h: calc(100vh - 296px);

.holiday-flow-design__tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 12px;
  }

  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
    background-color: var(--el-border-color-lighter);
  }
}

.holiday-flow-design__form-pane {
  padding: 12px 0;
  background: var(--el-bg-color);
}

.holiday-flow-design__page-desc {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.holiday-flow-design__header-actions {
  align-items: center;
}

.holiday-flow-design__header-divider {
  margin: 0 4px;
  height: 1.25em;
  border-color: var(--el-border-color);
}

/** BPMN：双栏 flex + 卡片外框，替换原「画布全宽 + 悬浮侧栏」叠层 */
.holiday-flow-design__bpmn-shell {
  padding: 0 0 4px;
}

.holiday-flow-design__bpmn {
  display: flex;
  align-items: stretch;
  height: $holidays-flow-stage-h;
  min-height: 420px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-light, var(--el-box-shadow, 0 1px 4px rgb(0 0 0 / 6%)));
  background: var(--el-bg-color);
  overflow: hidden;
}

.holiday-flow-design__canvas {
  flex: 1;
  min-width: 0;
  position: relative;
  background: var(--el-fill-color-lighter);

  :deep(.djs-container) {
    background: var(--el-bg-color);
  }
}

.holiday-flow-design__panel {
  width: min(360px, 40vw);
  min-width: 280px;
  flex-shrink: 0;
  overflow-x: hidden;
  overflow-y: auto;
  border-left: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);

  scrollbar-width: thin;
  scrollbar-color: var(--el-border-color-darker) transparent;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--el-border-color);
    border-radius: 4px;
  }

  /** bpmn-js-properties-panel：对齐 Element 表单观感 */
  :deep(.bpp-properties-panel) {
    background-color: var(--el-bg-color);
    padding: 14px 14px 28px;
    font-size: var(--el-font-size-small);
    font-family: inherit;
    line-height: 1.5;
    color: var(--el-text-color-primary);
  }

  :deep(.bpp-properties-header) {
    padding: 4px 0 12px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    margin-bottom: 10px;
  }

  :deep(.bpp-properties-header > .label) {
    font-size: 15px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    word-break: break-all;
  }

  :deep(.bpp-properties-panel label),
  :deep(.bpp-properties-panel .group-label) {
    font-weight: 500;
    color: var(--el-text-color-regular);
  }

  :deep(.bpp-properties-panel .entry-label) {
    font-style: normal;
    font-size: var(--el-font-size-small);
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  :deep(.bpp-properties-panel .entry-label.divider) {
    border-top-color: var(--el-border-color-lighter);
    margin-top: 14px;
    padding-top: 10px;
  }

  :deep(.bpp-properties-panel input),
  :deep(.bpp-properties-panel textarea),
  :deep(.bpp-properties-panel select),
  :deep(.bpp-properties-panel [contenteditable]) {
    border-radius: var(--el-border-radius-base);
    border-color: var(--el-border-color);
    background-color: var(--el-fill-color-blank);
    transition:
      border-color 0.15s,
      box-shadow 0.15s;
  }

  :deep(.bpp-properties-panel input:focus),
  :deep(.bpp-properties-panel textarea:focus),
  :deep(.bpp-properties-panel select:focus),
  :deep(.bpp-properties-panel [contenteditable]:focus),
  :deep(.bpp-properties-panel button:focus) {
    outline: none;
    border-color: var(--el-color-primary);
    box-shadow: 0 0 0 1px var(--el-color-primary-light-7);
  }

  :deep(.bpp-properties-panel button) {
    border-radius: var(--el-border-radius-small);
    background-color: var(--el-fill-color-blank);
    border-color: var(--el-border-color);
  }

  :deep(.bpp-properties-panel button:hover) {
    border-color: var(--el-color-primary-light-5);
    color: var(--el-color-primary);
  }

  :deep(.bpp-entry-link) {
    color: var(--el-color-primary);
  }

  :deep(.bpp-field-description) {
    color: var(--el-text-color-secondary);
  }

  :deep(.bpp-properties-static) {
    border-color: var(--el-border-color);
    background: var(--el-fill-color-blank);
    border-radius: var(--el-border-radius-small);
    font-family: inherit;
    font-size: var(--el-font-size-extra-small);
    color: var(--el-text-color-regular);
  }

  :deep(.bpp-properties-group + .bpp-properties-group) {
    border-top-color: var(--el-border-color-extra-light);
  }

  :deep(.bpp-properties-group > .group-toggle:hover) {
    background-color: var(--el-color-primary-light-7);
  }

  :deep(.bpp-properties-group:hover > .group-toggle:hover) {
    background-color: var(--el-color-primary-light-5);
  }

  :deep(.bpp-properties-group.group-closed) {
    background-color: var(--el-fill-color-light);
  }

  :deep(.bpp-properties-group.group-closed:hover > .group-label) {
    color: var(--el-color-primary);
  }

  :deep(.bpp-error-message) {
    color: var(--el-color-danger);
  }
}

.holiday-flow-design__xml :deep(textarea) {
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
</style>
