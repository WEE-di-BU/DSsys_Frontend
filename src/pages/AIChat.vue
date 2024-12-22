<template>
    <div style="width: 100%;display: flex;align-items: center;flex-direction: column; height: 100%; ">
        <!-- <vuetyped :strings="['欢迎回
         g: border-box;padding: 1em 0; background-color: #0f0f11;">
            <div class="typing" style="width: 100%; font-size: 2em; color: white;text-align: center;" />
        </vuetyped> -->
        <div style="width: 100%; height: 100%; display: flex;justify-content: center; background-color: #0f0f11;">
            <!-- <iframe src="http://127.0.0.1:7860/?__theme=dark" frameborder="0"
                style="width: 80%; height: 100%;border-radius: 0.4em;"></iframe> -->

            <iframe ref="iframe" :src="iframeSrc" style="width: 100%; height: 100%;border-radius: 0.4em;" frameborder="0"
                @load="onIframeLoad"></iframe>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// iframe的源地址
const iframeSrc = ref('http://127.0.0.1:7860/?__theme=dark');

// 获取iframe元素的引用
const iframe = ref<HTMLIFrameElement | null>(null);

// 当iframe加载完成时执行的函数
const onIframeLoad = () => {
  if (!iframe.value) return;

  // 获取iframe中的文档
  const iframeDoc = iframe.value.contentDocument || iframe.value.contentWindow?.document;
  if (!iframeDoc) return;

  // 设置iframe的滚动位置，滚动到距离顶部200px的位置
  iframe.value.contentWindow.scrollTo(0, 200);
};
</script>

<style scoped></style>
