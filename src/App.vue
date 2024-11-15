<template>
  <div class="wrapper">
    <header>
      <div class="nav">
        <div class="nav-item" @click="changeToLearn">
          学习
        </div>
        <div class="nav-item" @click="changeToAIChat">
          AI问答
        </div>
        <div class="nav-item" @click="changeToStatistics">
          分析
        </div>
      </div>
      <div>
        <div v-if="isHomePage" class="login-and-register">
          <el-button plain @click="loginVisible = true">登录</el-button>
          <el-dialog
            v-model="loginVisible"
            width="33em"
            style="background-color: whitesmoke"
          >
            <div
              style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <h1 style="color: black; font-size: 2em">登录</h1>
              <div style="font-size: 1em; color: #868484; margin-top: 10px">在进入系统之前，请先输入用户名和密码进行登录</div>
            </div>
            <div class="input-wrapper">
              <el-form>
                <el-form-item prop="username">
                  <el-input maxlength="30" type="text" placeholder="用户名/邮箱">
                    <template #prefix>
                      <el-icon>
                        <User/>
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input type="password" maxlength="20" style="margin-top: 5px" placeholder="密码">
                    <template #prefix>
                      <el-icon>
                        <Lock/>
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-row style="margin-top: 5px">
                  <el-col :span="12" style="text-align: left">
                    <el-form-item prop="remember">
                      <el-checkbox label="记住我"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" style="text-align: right">
                    <el-link>忘记密码？</el-link>
                  </el-col>
                </el-row>
              </el-form>
              <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
                <div style="margin-top: 1vw">
                  <el-button style="width: 22vw" type="success" plain>立即登录</el-button>
                </div>
                <el-divider>
                  <span style="color: grey; font-size: 0.9em;">没有账号</span>
                </el-divider>
                <div style="margin-bottom: 1vw">
                  <el-button style="width: 22vw" type="warning" plain>注册账号</el-button>
                </div>
              </div>
            </div>
          </el-dialog>
          <el-button type="primary">注册</el-button>
        </div>
        <div v-else class="avatar">
          <img src="./assets/avatae.png" alt="" style="border-radius: 10em; height: 100%; width: 100%;">
        </div>
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
import { useRouter, useRoute } from 'vue-router';
import { computed } from "vue";
import { ref } from 'vue'
import {User, Lock} from '@element-plus/icons-vue'

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
const changeToLearn = ()=>{
  router.push({
    name: 'learn'
  })
}

const route = useRoute();
const isHomePage = computed(() => route.path === '/home')

const loginVisible = ref(false)

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
  background-color: #1a1a1a;
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

.login-and-register {
  width: 10vw;
  height: 3vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 1em;
}

:deep(.el-divider__text) {
  background-color: whitesmoke;
}

.input-wrapper {
  margin-top: 1.5vw;
  padding: 0 3vw;
}
</style>
