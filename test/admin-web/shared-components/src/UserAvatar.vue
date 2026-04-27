<script setup>
defineProps({
  name: { type: String, default: '共享 UserAvatar' }
})
</script>

<template>
  <span class="sc-user">{{ name }}</span>
</template>

<style scoped>
.sc-user {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  background: #e6f4ff;
  color: #1677ff;
  font-size: 12px;
}
</style>
