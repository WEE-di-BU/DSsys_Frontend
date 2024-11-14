<template>
  <div class="wrapper">
    <header>
      <div class="nav">
        <div class="nav-item" @click="changeToAIChat">
          AI问答
        </div>
        <div class="nav-item">
          个性化推荐
        </div>
        <div class="nav-item" @click="changeToStatistics">
          学习成果分析
        </div>
      </div>
      <div class="avatar"> 
        <img src="./assets/avatae.png" alt="" style="border-radius: 10em; height: 100%; width: 100%;">
      </div>
    </header>
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { register } from 'swiper/element/bundle';
register();
import { useRouter } from 'vue-router';
const router = useRouter()
const changeToAIChat = ()=>{
  router.push({
    name:'aichat'
  })
}
const changeToStatistics = ()=>{
  router.push({
    name: 'statistics'
  })
}
</script>

<style scoped>
.wrapper {
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
}

header {
  height: 4em;
  background-color: #282828;
  border-bottom: 1px solid black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.main-content {
  width: 100%;
  box-sizing: border-box;
  height: calc(100vh - 4em);
}

.avatar{
  height: 3em;
  width: 3em;
  border-radius: 10em;
  background-color: transparent;
  margin-right: 3em;
}

.nav{
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 20%;
  margin-left: 3em;
  height: 100%;
  color: #eee;
}

.nav-item{
  width: 100%;
  font-size: 0.9em;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.nav-item:hover{
  background-color: gray;
  transition: 0.25s;
}
</style>