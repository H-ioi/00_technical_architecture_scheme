<template>
  <Dict :dict-type="BASE_DICT_TYPE_GRADE" locale-scope="grade" />
</template>

<script setup lang="ts">

import { BASE_DICT_TYPE_GRADE } from '@/types/modules/base-dict'

import Dict from '../components/dict.vue'</script>
