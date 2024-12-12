<template>
    <div style="width: 100%;">
      {{ props.cid }}
    </div>
  </template>
  <script lang="ts" setup>
  const props = defineProps({
    cid: { type: String, required: true },
  });
  </script>
  <style lang="css" scoped>
  </style>