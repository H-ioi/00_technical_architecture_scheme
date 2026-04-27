<template>
    <div>
        消息详情
    </div>
</template>
  
<script>
import { mapGetters } from "vuex";
import Pagination from "@/components/common/Pagination.vue";
import PaginationInfo from "@/components/common/PaginationInfo.vue";
import Table from "@/components/common/Table.vue";
export default {
    name: "detail",
    components: {
        Pagination,
        PaginationInfo,
        Table,
    },
    data() {
        return {

        };
    },
    created() {
    },

    mounted() { },
    activated() { },
    computed: {
        ...mapGetters([
            "dictionary",
            "tagList",
            "tag",
            "permissions",
            "currentstatus",
        ]),
    },
    methods: {

    },
};
</script>
  
<style lang="scss" scoped></style>
  