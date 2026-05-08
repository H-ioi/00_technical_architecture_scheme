import type { Sort } from "element-plus";
import { computed, onMounted, reactive, ref, watch } from "vue";

import type {
  Recordable,
  UniPaginationConfig,
  UniTableRequest,
  UniTableRequestResult,
} from "@/types/shared";

interface UseDataOptions {
  getData: () => Recordable[];
  getLoading: () => boolean | undefined;
  getPagination: () => UniPaginationConfig | false | undefined;
  getRequest: () => UniTableRequest | undefined;
  getFilters?: () => Recordable | undefined;
  emitLoadSuccess: (result: UniTableRequestResult) => void;
  emitRequestError: (error: unknown) => void;
  emitUpdatePageNo: (value: number) => void;
  emitUpdatePageSize: (value: number) => void;
}

export function useData(options: UseDataOptions) {
  const innerLoading = ref(false);
  const tableData = ref<Recordable[]>([]);
  const sortState = ref<Sort>();
  const paginationState = reactive({
    pageNo: 1,
    pageSize: 10,
    total: 0,
  });

  const paginationConfig = computed(() => {
    const pagination = options.getPagination();

    if (pagination === false) {
      return false;
    }

    return {
      enabled: true,
      background: true,
      layout: "total, sizes, prev, pager, next, jumper",
      pageSizes: [10, 20, 50, 100],
      position: "right" as const,
      ...pagination,
    };
  });

  const actualLoading = computed(
    () => options.getLoading() || innerLoading.value,
  );
  const actualData = computed(() => {
    const request = options.getRequest();
    const data = options.getData();

    if (request) {
      return tableData.value;
    }

    if (paginationConfig.value && paginationConfig.value.enabled !== false) {
      const start = (paginationState.pageNo - 1) * paginationState.pageSize;

      return data.slice(start, start + paginationState.pageSize);
    }

    return data;
  });
  const configuredTotal = computed(() =>
    paginationConfig.value ? paginationConfig.value.total : undefined,
  );
  const actualTotal = computed(() =>
    options.getRequest()
      ? (configuredTotal.value ?? paginationState.total)
      : (configuredTotal.value ?? options.getData().length),
  );

  const loadData = async () => {
    const request = options.getRequest();

    if (!request) {
      return;
    }

    innerLoading.value = true;

    try {
      const result = await request({
        pageNo: paginationState.pageNo,
        pageSize: paginationState.pageSize,
        sort: sortState.value,
        filters: options.getFilters?.(),
      });
      tableData.value = result.data ?? result.records ?? [];
      paginationState.total = result.total;
      options.emitLoadSuccess(result);
    } catch (error) {
      options.emitRequestError(error);
    } finally {
      innerLoading.value = false;
    }
  };

  const handleCurrentChange = (pageNo: number) => {
    paginationState.pageNo = pageNo;
    options.emitUpdatePageNo(pageNo);
    loadData();
  };

  const handleSizeChange = (pageSize: number) => {
    paginationState.pageSize = pageSize;
    paginationState.pageNo = 1;
    options.emitUpdatePageSize(pageSize);
    loadData();
  };

  const setSort = (sort: Sort) => {
    sortState.value = sort;
    loadData();
  };

  watch(
    () => options.getPagination(),
    (pagination) => {
      if (pagination && typeof pagination === "object") {
        paginationState.pageNo = pagination.pageNo ?? paginationState.pageNo;
        paginationState.pageSize =
          pagination.pageSize ?? paginationState.pageSize;
        paginationState.total = pagination.total ?? paginationState.total;
      }
    },
    { immediate: true, deep: true },
  );

  onMounted(loadData);

  return {
    actualData,
    actualLoading,
    actualTotal,
    loadData,
    paginationConfig,
    paginationState,
    setSort,
    handleCurrentChange,
    handleSizeChange,
  };
}
