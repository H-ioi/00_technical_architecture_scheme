<script setup>
defineProps({
  title: { type: String, default: '共享 CommonDialog' }
})
</script>

<template>
  <div class="sc-dialog">{{ title }}</div>
</template>

<style scoped>
.sc-dialog {
  padding: 8px 12px;
  border: 1px dashed #faad14;
  border-radius: 6px;
  font-size: 12px;
  color: #ad6800;
  background: #fffbe6;
}
</style>
