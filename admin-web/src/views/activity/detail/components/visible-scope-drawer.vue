<template>
  <el-drawer
    v-model="visible"
    :title="$t('activity.visibleScopeDrawerTitle')"
    direction="rtl"
    size="640px"
    append-to-body
    destroy-on-close
    @open="handleOpen"
  >
    <div class="visible-scope-drawer">
      <el-table v-loading="loading" :data="rows" border style="width: 100%">
        <el-table-column
          type="index"
          :label="$t('activity.visibleScopeColIndex')"
          width="60"
          align="center"
        />
        <el-table-column
          prop="mobile"
          :label="$t('activity.visibleScopeMobile')"
          min-width="160"
          show-overflow-tooltip
        />
        <el-table-column
          prop="createTime"
          :label="$t('activity.colCreateTime')"
          min-width="170"
          show-overflow-tooltip
        />
      </el-table>
      <el-pagination
        v-if="total > 0"
        class="visible-scope-drawer__footer"
        background
        layout="total, prev, pager, next"
        :current-page="current"
        :page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
      />
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { useUniI18n } from 'uni-ui-lib'
import { ElMessage } from 'element-plus'
import { ref, watch } from 'vue'

import { activityApi } from '@/api'
import { normalizePaged } from '@/utils/api-response-normalize'

type VisibleScopeRow = {
  mobile?: string
  createTime?: string
}

const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  fileId?: string | number
}>()

const { t } = useUniI18n()
const loading = ref(false)
const rows = ref<VisibleScopeRow[]>([])
const current = ref(1)
const pageSize = 10
const total = ref(0)

const loadRows = async () => {
  const fileId = props.fileId
  if (fileId == null || fileId === '') {
    rows.value = []
    total.value = 0
    return
  }
  loading.value = true
  try {
    const raw = await activityApi.visibleScopeListByFile.get({
      fileId,
      current: current.value,
      size: pageSize
    })
    const page = normalizePaged<VisibleScopeRow>(raw)
    rows.value = page.list
    total.value = page.total
  } catch {
    rows.value = []
    total.value = 0
    ElMessage.error(t('activity.visibleScopeLoadFail'))
  } finally {
    loading.value = false
  }
}

const handleOpen = () => {
  current.value = 1
  void loadRows()
}

const handlePageChange = (page: number) => {
  current.value = page
  void loadRows()
}

watch(
  () => props.fileId,
  () => {
    if (!visible.value) {
      return
    }
    current.value = 1
    void loadRows()
  }
)
</script>

<style scoped lang="scss">
.visible-scope-drawer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 200px;

  &__footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
