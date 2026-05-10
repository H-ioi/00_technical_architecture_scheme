<template>
  <Dict :dict-type="BASE_DICT_TYPE_SCHOOL" locale-scope="school" />
</template>

<script setup lang="ts">
import { BASE_DICT_TYPE_SCHOOL } from '@/types/modules/base-dict'

import Dict from '../components/dict.vue'
</script>
