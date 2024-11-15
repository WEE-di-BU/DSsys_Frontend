<template>
    <div class="wrapper-home">
        <div class="swiper-outer">
        <swiper-container class="swiper" scrollbar="true" :autoplay="{
          delay: 2500,
          disableOnInteraction: false,
        }">
          <swiper-slide><img src="@/assets/pag1.jpg" alt="" style="width: 100%; "></swiper-slide>
          <swiper-slide><img src="@/assets/pag2.jpg" alt="" style="width: 100%;"></swiper-slide>
          <swiper-slide><img src="@/assets/pag3.jpg" alt="" style="width: 100%;"></swiper-slide>
        </swiper-container>
      </div>
      <div class="bottom">
        <div class="up-title">
          基于GraphRag的问答系统
        </div>
        <div class="pages">
          <div class="item">
            AI知识问答
          </div>
          <div class="item">
            个性化推荐
          </div>
          <div class="item">
            学习成果分析
          </div>
        </div>
        <div class="bottom-content">

        </div>
      </div>
    </div>
</template>
<script lang="ts" setup>
import { register } from 'swiper/element/bundle';
register();
</script>
<style scoped>
.wrapper-home{
    width: 100%;
}
.bottom {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: white;
}

.up-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 4em;
  font-size: 1.8em;
}

.pages {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 0 10em;
}

.item {
  border: 1px solid #24292f;
  border-radius: 3em;
  height: 2.5em;
  width: 10em;
  display: flex;
  align-items: center;
  justify-content: center;
}
.swiper{
  height: 30em;
}
</style>