<template>
  <div style="width: 100%;height: 100%;">
    <MdPreview :editorId="id" :modelValue="markdownContent" theme="dark" preview-theme="github"/>
  </div>
</template>
<script setup lang="ts">
import {  ref } from 'vue';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
const id = 'preview-only';
const markdownContent = ref(`# Markdown 示例
这是普通文本。

**加粗文字**

这是一个列表：
- 项目 1
- 项目 2
- 项目 3

$a_i$ 
> 引用块

[链接示例](https://vuejs.org)
`);
</script>
<style lang="css" scoped>
</style>