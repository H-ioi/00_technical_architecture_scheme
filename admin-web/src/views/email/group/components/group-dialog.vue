<template>
  <el-drawer
    v-model="innerVisible"
    :title="title"
    direction="rtl"
    size="min(880px, 96vw)"
    destroy-on-close
    class="email-group-drawer"
    append-to-body
  >
    <div class="email-group-drawer__body">
      <div class="email-group-drawer__sheet">
        <!-- 顶部：类邮件元数据 -->
        <div class="email-group-drawer__mail-rows">
          <div class="email-group-drawer__mail-row">
            <span class="email-group-drawer__mail-label">
              <span class="email-group-drawer__mail-required" aria-hidden="true">*</span>
              {{ $t('email.group.colName') }}
            </span>
            <div class="email-group-drawer__mail-field">
              <el-input v-model="form.name" clearable :placeholder="$t('email.group.ruleName')" />
            </div>
          </div>
          <div class="email-group-drawer__mail-row">
            <span class="email-group-drawer__mail-label">{{ $t('email.group.colMailTypes') }}</span>
            <div class="email-group-drawer__mail-field">
              <el-checkbox-group v-model="mailTypeCheck" class="email-group-drawer__checks">
                <el-checkbox label="student">{{ $t('email.group.studentEmail') }}</el-checkbox>
                <el-checkbox label="parent">{{ $t('email.group.parentEmail') }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="email-group-drawer__mail-row email-group-drawer__mail-row--last">
            <span class="email-group-drawer__mail-label">{{ $t('email.status') }}</span>
            <div class="email-group-drawer__mail-field">
              <el-radio-group v-model="form.status" class="email-group-drawer__status-radios">
                <el-radio label="1">{{ $t('email.statusActive') }}</el-radio>
                <el-radio label="0">{{ $t('email.statusArchived') }}</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>

        <!-- 按学号搜索 -->
        <div class="email-group-drawer__section">
          <h3 class="email-group-drawer__section-title">{{ $t('email.group.addStudents') }}</h3>
          <div class="email-group-drawer__search-row">
            <el-select
              v-model="form.schoolName"
              clearable
              filterable
              :placeholder="$t('email.group.selectSchool')"
              class="email-group-drawer__field email-group-drawer__field--school"
            >
              <el-option
                v-for="s in schoolList"
                :key="String(s.enName)"
                :label="String(s.enName ?? s.name)"
                :value="String(s.enName ?? s.name)"
              />
            </el-select>
            <el-input
              v-model="form.admissionNo"
              clearable
              :placeholder="$t('email.group.nameOrNoPlaceholder')"
              class="email-group-drawer__field email-group-drawer__field--grow"
              @keyup.enter="searchStudent"
            />
            <el-button
              type="primary"
              class="email-group-drawer__search-btn"
              :loading="searchLoading"
              @click="searchStudent"
            >
              {{ $t('email.group.searchStudent') }}
            </el-button>
          </div>

          <div v-if="searchResults.length" class="email-group-drawer__results">
            <div class="email-group-drawer__results-caption">
              {{ $t('email.group.searchResults') }}
            </div>
            <el-table
              :data="searchResults"
              border
              size="small"
              class="email-group-drawer__table"
              max-height="240"
            >
              <el-table-column
                prop="schoolName"
                :label="$t('email.group.colSchool')"
                min-width="120"
              />
              <el-table-column
                prop="admissionNo"
                :label="$t('email.group.colAdmission')"
                width="100"
              />
              <el-table-column
                prop="studentShowName"
                :label="$t('email.group.colStudentName')"
                min-width="100"
              />
              <el-table-column prop="grade" :label="$t('email.group.colGrade')" width="88" />
              <el-table-column :label="$t('email.add')" width="88" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link @click="addToGroup(row as Loose)">
                    {{ $t('email.group.addMember') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div class="email-group-drawer__section">
          <h3 class="email-group-drawer__section-title">{{ $t('email.group.addScope') }}</h3>
          <div class="email-group-drawer__range-grid">
            <el-select
              v-model="form.subSchoolName"
              clearable
              filterable
              :placeholder="$t('email.group.selectSchool')"
              class="email-group-drawer__grid-item"
              @change="(v: string) => handleSchoolChange(v)"
            >
              <el-option
                v-for="s in schoolList"
                :key="String(s.enName)"
                :label="String(s.enName ?? s.name)"
                :value="String(s.enName ?? s.name)"
              />
            </el-select>
            <el-select
              v-model="form.rangeGrade"
              multiple
              clearable
              filterable
              collapse-tags
              collapse-tags-tooltip
              :placeholder="$t('email.group.selectGrade')"
              class="email-group-drawer__grid-item"
            >
              <el-option
                v-for="g in gradeList"
                :key="JSON.stringify(g)"
                :label="gradeOption(g).label"
                :value="gradeOption(g).value"
              />
            </el-select>
            <el-select
              v-if="divisionList.length"
              v-model="form.rangeDivision"
              clearable
              filterable
              :placeholder="$t('email.group.selectDivision')"
              class="email-group-drawer__grid-item"
            >
              <el-option v-for="d in divisionList" :key="d" :label="d" :value="d" />
            </el-select>
            <el-select
              v-if="boardingHouseList.length"
              v-model="form.rangeCollege"
              clearable
              filterable
              :placeholder="$t('email.group.selectCollege')"
              class="email-group-drawer__grid-item"
            >
              <el-option v-for="c in boardingHouseList" :key="c" :label="c" :value="c" />
            </el-select>
            <el-select
              v-model="form.rangeBus"
              clearable
              :placeholder="$t('email.group.takeBus')"
              class="email-group-drawer__grid-item"
            >
              <el-option :label="$t('email.yes')" value="yes" />
              <el-option :label="$t('email.no')" value="no" />
            </el-select>
            <el-select
              v-model="form.rangeDorm"
              clearable
              :placeholder="$t('email.group.dorm')"
              class="email-group-drawer__grid-item"
            >
              <el-option :label="$t('email.yes')" value="yes" />
              <el-option :label="$t('email.no')" value="no" />
            </el-select>
            <el-date-picker
              v-model="form.rangeDate"
              type="daterange"
              :range-separator="'—'"
              :start-placeholder="$t('email.group.dateStart')"
              :end-placeholder="$t('email.group.dateEnd')"
              class="email-group-drawer__grid-item email-group-drawer__grid-item--span"
            />
          </div>
          <div class="email-group-drawer__range-actions">
            <el-button type="primary" @click="addRange">{{ $t('email.group.addRange') }}</el-button>
            <el-button @click="resetRange">{{ $t('email.group.resetRange') }}</el-button>
          </div>
        </div>

        <div class="email-group-drawer__section email-group-drawer__section--members">
          <div class="email-group-drawer__members-head">
            <h3 class="email-group-drawer__section-title email-group-drawer__section-title--flat">
              {{ $t('email.group.memberList') }}
            </h3>
            <span class="email-group-drawer__count">{{ groupMembers.length }}</span>
          </div>
          <div class="email-group-drawer__tags">
            <template v-if="labels.length === 0">
              <div class="email-group-drawer__empty">{{ $t('email.group.memberEmpty') }}</div>
            </template>
            <el-tag
              v-for="(lb, idx) in labels"
              :key="idx"
              class="email-group-drawer__tag"
              type="info"
              effect="plain"
              closable
              :title="lb"
              @close="removeAt(idx)"
            >
              <span class="email-group-drawer__tag-text">{{ lb }}</span>
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="email-group-drawer__footer">
        <el-button @click="innerVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submit">{{ $t('common.submit') }}</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'

import { attendanceStudentApi, bulkEmailApi } from '@/api'
import { useUniI18n } from 'uni-ui-lib'

import { normalizeEnvelope } from '@/utils/api-response-normalize'
import { formatMailGroupScopeDisplay } from '@/utils/mail-page-utils'

type Loose = Record<string, unknown>
type SchoolRow = { enName?: string; name?: string }

const props = defineProps<{
  modelValue: boolean
  mode: 'add' | 'edit'
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
  success: []
}>()

const { t } = useUniI18n()
const searchLoading = ref(false)
const searchResults = ref<Loose[]>([])
const schoolList = ref<SchoolRow[]>([])
const gradeList = ref<unknown[]>([])
const divisionList = ref<string[]>([])
const boardingHouseList = ref<string[]>([])
const groupMembers = ref<string[]>([])

const innerVisible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const title = computed(() =>
  props.mode === 'add' ? t('email.group.dialogAdd') : t('email.group.dialogEdit')
)

const labels = computed(() => groupMembers.value.map(formatMailGroupScopeDisplay))

/** 学生/家长邮箱与 `el-checkbox-group` 同步，避免两个孤立勾选项难扫读 */
const mailTypeCheck = computed({
  get: () => {
    const v: string[] = []
    if (form.studentEmail) {
      v.push('student')
    }
    if (form.parentEmail) {
      v.push('parent')
    }
    return v
  },
  set: (arr: string[]) => {
    form.studentEmail = arr.includes('student')
    form.parentEmail = arr.includes('parent')
  }
})

const form = reactive({
  id: '' as string,
  name: '',
  studentEmail: false,
  parentEmail: false,
  status: '1',
  schoolName: '',
  admissionNo: '',
  subSchoolName: '' as string,
  rangeGrade: [] as string[],
  rangeDivision: '',
  rangeCollege: '',
  rangeBus: '' as '' | 'yes' | 'no',
  rangeDorm: '' as '' | 'yes' | 'no',
  rangeDate: null as [Date, Date] | null
})

const loadSchools = async () => {
  const raw = await bulkEmailApi.commonOldSchoolList.get()
  const env = normalizeEnvelope(raw)
  const list = Array.isArray(env)
    ? env
    : Array.isArray((env as Loose).data)
      ? ((env as Loose).data as unknown[])
      : []
  schoolList.value = list as SchoolRow[]
}

const loadGrades = async () => {
  const raw = await attendanceStudentApi.gradeList.get()
  const env = normalizeEnvelope(raw)
  const list = Array.isArray(env)
    ? env
    : Array.isArray((env as Loose).data)
      ? ((env as Loose).data as unknown[])
      : []
  gradeList.value = list
}

const resetForm = () => {
  form.id = ''
  form.name = ''
  form.studentEmail = false
  form.parentEmail = false
  form.status = '1'
  form.schoolName = ''
  form.admissionNo = ''
  form.subSchoolName = ''
  form.rangeGrade = []
  form.rangeDivision = ''
  form.rangeCollege = ''
  form.rangeBus = ''
  form.rangeDorm = ''
  form.rangeDate = null
  searchResults.value = []
  divisionList.value = []
  boardingHouseList.value = []
  groupMembers.value = []
}

watch(innerVisible, (v) => {
  if (v) {
    void loadSchools()
    void loadGrades()
  } else {
    resetForm()
  }
})

const openAdd = () => {
  resetForm()
}

const openEdit = (row: Loose) => {
  resetForm()
  form.id = String(row.id ?? '')
  form.name = String(row.name ?? '')
  form.studentEmail = Boolean(row.includeStudentMails)
  form.parentEmail = Boolean(row.includeParentMails)
  form.status = String(row.status ?? '1')
  const sc = row.scopes
  if (typeof sc === 'string' && sc.trim()) {
    groupMembers.value = sc.split(';').filter((x) => x.trim())
  }
}

defineExpose({ openAdd, openEdit })

const searchStudent = async () => {
  if (!form.admissionNo.trim()) {
    return
  }
  searchLoading.value = true
  try {
    const raw = await bulkEmailApi.commonStudentList.post({
      schoolName: form.schoolName || undefined,
      admissionNo: form.admissionNo
    })
    const env = normalizeEnvelope(raw)
    const list = Array.isArray(env)
      ? env
      : Array.isArray((env as Loose).data)
        ? ((env as Loose).data as Loose[])
        : []
    searchResults.value = list
  } finally {
    searchLoading.value = false
  }
}

const addToGroup = (member: Loose) => {
  const admissionNo = String(member.admissionNo ?? '')
  const exists = groupMembers.value.some((item) => item.includes(admissionNo) && admissionNo !== '')
  const line = `${String(member.schoolName ?? '-')},All,${String(member.grade ?? '-')},All,All,All,All,All,${admissionNo || '-'}`
  if (exists) {
    ElMessage.warning(t('email.group.memberDuplicate'))
    return
  }
  groupMembers.value.push(line)
}

const removeAt = (index: number) => {
  groupMembers.value.splice(index, 1)
}

const handleSchoolChange = async (schoolName: string) => {
  divisionList.value = []
  boardingHouseList.value = []
  if (!schoolName) {
    return
  }
  const [bh, div] = await Promise.all([
    bulkEmailApi.commonBoardingHouseList.post({ schoolName }),
    bulkEmailApi.commonDivisionNameList.post({ schoolName })
  ])
  const bhEnv = normalizeEnvelope(bh)
  const bhData = Array.isArray(bhEnv)
    ? bhEnv
    : Array.isArray((bhEnv as Loose).data)
      ? ((bhEnv as Loose).data as string[])
      : []
  boardingHouseList.value = bhData as string[]
  const divEnv = normalizeEnvelope(div)
  const divRaw = Array.isArray(divEnv)
    ? divEnv
    : Array.isArray((divEnv as Loose).data)
      ? ((divEnv as Loose).data as string[])
      : []
  divisionList.value = divRaw.map((x) =>
    String(x)
      .replace(/[\u4e00-\u9fa5]/g, '')
      .trim()
  )
}

const addRange = () => {
  const { subSchoolName, rangeGrade, rangeCollege, rangeBus, rangeDorm, rangeDate, rangeDivision } =
    form
  const grades = Array.isArray(rangeGrade) ? rangeGrade : rangeGrade ? [String(rangeGrade)] : []

  const combos: { school: string; grade: string }[] = []
  if (subSchoolName && grades.length) {
    for (const g of grades) {
      combos.push({ school: subSchoolName, grade: g })
    }
  } else if (subSchoolName) {
    combos.push({ school: subSchoolName, grade: '' })
  } else {
    for (const g of grades) {
      combos.push({ school: '', grade: g })
    }
  }

  for (const combo of combos) {
    let rangeString = combo.school || ''
    if (rangeDivision && divisionList.value.length > 0) {
      rangeString += `,${rangeDivision}`
    } else {
      rangeString += ',All'
    }
    if (combo.grade) {
      rangeString += `,${combo.grade}`
    } else {
      rangeString += ',All'
    }
    if (rangeCollege && boardingHouseList.value.length > 0) {
      rangeString += `,${rangeCollege}`
    } else {
      rangeString += ',All'
    }
    if (rangeBus) {
      rangeString += `,${rangeBus === 'yes'}`
    } else {
      rangeString += ',All'
    }
    if (rangeDorm) {
      rangeString += `,${rangeDorm === 'yes'}`
    } else {
      rangeString += ',All'
    }
    if (rangeDate && rangeDate.length === 2) {
      rangeString += `,${dayjs(rangeDate[0]).format('YYYY-MM-DD')},${dayjs(rangeDate[1]).format('YYYY-MM-DD')}`
    } else {
      rangeString += ',All,All'
    }
    rangeString += ',All'
    rangeString = rangeString.trim()
    if (rangeString && !groupMembers.value.includes(rangeString)) {
      groupMembers.value.push(rangeString)
    }
  }
}

const resetRange = () => {
  form.subSchoolName = ''
  form.rangeGrade = []
  form.rangeCollege = ''
  form.rangeBus = ''
  form.rangeDorm = ''
  form.rangeDivision = ''
  form.rangeDate = null
  boardingHouseList.value = []
  divisionList.value = []
}

const submit = async () => {
  if (!form.name.trim()) {
    ElMessage.error(t('email.group.ruleName'))
    return
  }
  if (groupMembers.value.length === 0) {
    ElMessage.error(t('email.group.ruleMembers'))
    return
  }
  if (!form.studentEmail && !form.parentEmail) {
    ElMessage.error(t('email.group.ruleMailType'))
    return
  }
  const body = {
    name: form.name,
    scopes: groupMembers.value.join(';'),
    includeParentMails: form.parentEmail ? 1 : 0,
    includeStudentMails: form.studentEmail ? 1 : 0,
    status: form.status,
    id: form.id
  }
  try {
    if (form.id) {
      await bulkEmailApi.groupUpdate.post(body)
    } else {
      await bulkEmailApi.groupCreate.post(body)
    }
    ElMessage.success(t('email.opOk'))
    innerVisible.value = false
    emit('success')
  } catch {
    ElMessage.error(t('email.opFail'))
  }
}

const gradeOption = (g: unknown) => {
  if (g != null && typeof g === 'object' && 'label' in (g as Loose)) {
    const o = g as { label?: string; value?: string }
    return { label: String(o.label ?? o.value ?? ''), value: String(o.value ?? o.label ?? '') }
  }
  const s = String(g)
  return { label: s, value: s }
}
</script>

<style scoped lang="scss">
.email-group-drawer {
  &__body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  &__sheet {
    border: 1px solid var(--el-border-color-lighter);
    border-radius: var(--el-border-radius-base);
    background: var(--el-bg-color);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    overflow: hidden;
  }

  &__mail-rows {
    background: var(--el-fill-color-blank);
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  &__mail-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--el-border-color-extra-light);

    &--last {
      border-bottom: none;
    }
  }

  &__mail-label {
    flex: 0 0 80px;
    font-size: 13px;
    line-height: var(--el-component-size-default);
    color: var(--el-text-color-secondary);
    text-align: right;
  }

  &__mail-required {
    color: var(--el-color-danger);
    margin-right: 2px;
  }

  &__mail-field {
    flex: 1;
    min-width: 0;
  }

  &__status-radios {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 16px;
  }

  &__checks {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 20px;
  }

  &__section {
    padding: 18px 16px 20px;
    border-top: 1px solid var(--el-border-color-extra-light);
    background: var(--el-bg-color);

    &--members {
      padding-bottom: 16px;
      background: var(--el-fill-color-blank);
    }
  }

  &__section-title {
    position: relative;
    margin: 0 0 14px;
    padding-left: 12px;
    font-size: 14px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    letter-spacing: 0.01em;
    line-height: 1.35;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 14px;
      border-radius: 2px;
      background: var(--el-color-primary);
      opacity: 0.85;
    }

    &--flat {
      margin-bottom: 0;
      padding-left: 12px;

      &::before {
        top: 0.35em;
        transform: none;
      }
    }
  }

  &__members-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }

  &__count {
    flex-shrink: 0;
    min-width: 1.75rem;
    padding: 2px 10px;
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    line-height: 1.5;
    text-align: center;
    color: var(--el-text-color-secondary);
    border-radius: 10px;
    background: var(--el-fill-color-light);
  }

  &__search-row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 12px;
  }

  &__field {
    min-width: 0;
  }

  &__field--school {
    flex: 0 1 220px;
    width: 100%;
  }

  &__field--grow {
    flex: 1 1 200px;
    min-width: 160px;
  }

  &__search-btn {
    flex-shrink: 0;
  }

  &__results {
    margin-top: 16px;
    padding: 12px;
    border-radius: var(--el-border-radius-base);
    background: var(--el-fill-color-lighter);
    border: 1px solid var(--el-border-color-extra-light);
  }

  &__results-caption {
    font-size: 12px;
    font-weight: 600;
    color: var(--el-text-color-regular);
    margin-bottom: 10px;
  }

  &__table {
    width: 100%;

    :deep(.el-table__header th) {
      background: var(--el-fill-color-blank);
    }
  }

  &__range-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    align-items: start;
  }

  &__grid-item {
    width: 100%;
  }

  &__grid-item--span {
    grid-column: 1 / -1;
  }

  &__range-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    margin-top: 16px;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-content: flex-start;
    max-height: min(280px, 36vh);
    overflow-y: auto;
    padding: 12px;
    min-height: 80px;
    border-radius: var(--el-border-radius-base);
    border: 1px dashed var(--el-border-color);
    background: var(--el-bg-color);
  }

  &__empty {
    width: 100%;
    text-align: center;
    padding: 24px 12px;
    font-size: 13px;
    color: var(--el-text-color-placeholder);
  }

  &__tag {
    max-width: 100%;

    :deep(.el-tag__content) {
      min-width: 0;
    }
  }

  &__tag-text {
    display: inline-block;
    max-width: min(420px, 52vw);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    width: 100%;
  }
}
</style>
