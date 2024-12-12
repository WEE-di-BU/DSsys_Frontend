<template>
    <div style="width: 100%;display: flex;align-items: center;flex-direction: column; height: 100%; ">
        <vuetyped :strings="['欢迎回来，需要我帮您做什么？']" :smart-backspace="true"
            style="width: 100%; box-sizing: border-box;padding: 1em 0; background-color: #0f0f11;">
            <div class="typing" style="width: 100%; font-size: 2em; color: white;text-align: center;" />
        </vuetyped>
        <div style="width: 100%; height: 100%; display: flex;justify-content: center; background-color: #0f0f11;">
            <iframe src="http://127.0.0.1:7860/?__theme=dark" frameborder="0"
                style="width: 80%; height: 100%;border-radius: 0.4em;"></iframe>
        </div>
    </div>
</template>

<script lang="ts" setup>

</script>

<style scoped></style>