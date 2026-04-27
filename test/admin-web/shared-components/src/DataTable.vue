<script setup>
defineProps({
  rows: { type: Number, default: 3 }
})
</script>

<template>
  <div class="sc-table">
    <div v-for="i in rows" :key="i" class="sc-table__row">共享 DataTable 行 {{ i }}</div>
  </div>
</template>

<style scoped>
.sc-table {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  font-size: 12px;
}
.sc-table__row {
  padding: 6px 10px;
  border-bottom: 1px solid #f0f0f0;
}
.sc-table__row:last-child {
  border-bottom: none;
}
</style>
