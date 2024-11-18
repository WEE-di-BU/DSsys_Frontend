<template>
  <div style="width: 100%; display: flex;justify-content: center;background: radial-gradient(circle, #ff7e5f, #feb47b)">
    <div style="width: 65%; background-color: #282828;border: none; box-sizing: border-box; padding: 2em 2em">
        <h1 style="margin-bottom: 0.5em; color: white; font-size: 2.5em;">{{ detail.name }}</h1>
        <h3 style="margin-bottom: 1em; color: white; font-style: italic;">Description</h3>
        <MdPreview :editorId="wid" :modelValue="detail.detailed_desc" theme="dark" preview-theme="github" style="border-radius: 1em;"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  id: { type: String, required: true },
  name: { type: String, default: 'Guest' }
});
import {  onMounted, ref } from 'vue';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import axios from 'axios';
const wid = 'preview-only';
const detail = ref(props.id)
onMounted(async()=>{
    await getCorrDetail()
})
const getCorrDetail =async ()=>{
    await axios.get('http://127.0.0.1:5000/api/concepts/'+props.id).then((resp)=>{
        detail.value = resp.data
        console.log(detail.value)
    })
}
</script>
<style lang="css" scoped>
</style>