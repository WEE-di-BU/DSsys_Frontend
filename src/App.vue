<template>
  <div class="wrapper">
    <header>
      <div class="nav">
        <div class="nav-item" v-show="role==0" @click="changeToLearn">
          学习
        </div>
        <div class="nav-item" @click="changeToAIChat">
          AI问答
        </div>
        <div class="nav-item" @click="changeToStatistics">
          个人中心
        </div>
      </div>
      <div>
        <div v-if="isHomePage" class="login-and-register">
          <el-button plain @click="loginVisible = true">登录</el-button>
          <el-dialog v-model="loginVisible" width="33em" style="background-color: whitesmoke">
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <h1 style="color: black; font-size: 2em">登录</h1>
              <div style="font-size: 1em; color: #868484; margin-top: 10px">在进入系统之前，请先输入用户名和密码进行登录</div>
            </div>
            <div class="input-wrapper">
              <el-form>
                <el-form-item prop="username">
                  <el-input maxlength="30" type="text" placeholder="用户名/邮箱">
                    <template #prefix>
                      <el-icon>
                        <User />
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input type="password" maxlength="20" style="margin-top: 5px" placeholder="密码">
                    <template #prefix>
                      <el-icon>
                        <Lock />
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-row style="margin-top: 5px">
                  <el-col :span="12" style="text-align: left">
                    <el-form-item prop="remember">
                      <el-checkbox label="记住我" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" style="text-align: right">
                    <el-link @click="changeToReset">忘记密码？</el-link>
                  </el-col>
                </el-row>
              </el-form>
              <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
                <div style="margin-top: 1vw">
                  <el-button style="width: 22vw" type="success" plain @click="changeToLearn2">立即登录</el-button>
                </div>
                <el-divider>
                  <span style="color: grey; font-size: 0.9em;">没有账号</span>
                </el-divider>
                <div style="margin-bottom: 1vw">
                  <el-button style="width: 22vw" type="warning" plain @click="changeToRegister">注册账号</el-button>
                </div>
              </div>
            </div>
          </el-dialog>
          <el-dialog v-model="resetVisible" width="33em" style="background-color: whitesmoke">
            <div style="text-align: center">
              <div style="margin-top: 1vw">
                <el-steps :active="active" finish-status="success" align-center>
                  <el-step title="验证电子邮件" />
                  <el-step title="重新设定密码" />
                </el-steps>
              </div>
              <div style="margin: 0 2vw" v-if="active === 0">
                <div style="margin-top: 1vw">
                  <div style="font-size: 2em; font-weight: bold; color: black">重置密码</div>
                  <div style="font-size: 1em; color: #868484; margin-top: 10px">请输入需要重置密码的电子邮件地址</div>
                </div>
                <div style="margin-top: 1.5vw">
                  <el-form>
                    <el-form-item prop="email">
                      <el-input type="email" placeholder="电子邮件地址">
                        <template #prefix>
                          <el-icon>
                            <Message />
                          </el-icon>
                        </template>
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="code">
                      <el-row :gutter="10" style="width: 100%">
                        <el-col :span="18">
                          <el-input maxlength="6" type="text" placeholder="请输入验证码">
                            <template #prefix>
                              <el-icon>
                                <EditPen />
                              </el-icon>
                            </template>
                          </el-input>
                        </el-col>
                        <el-col :span="5">
                          <el-button type="success">
                            获取验证码
                          </el-button>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-form>
                </div>
                <div style="margin: 2.5vw 0">
                  <el-button @click="confirmReset" style="width: 22vw" type="warning" plain>开始重置密码</el-button>
                </div>
              </div>
              <div style="margin: 0 2vw" v-if="active === 1">
                <div style="margin-top: 1vw">
                  <div style="font-size: 2em; font-weight: bold; color: black">重置密码</div>
                  <div style="font-size: 1em; color: #868484; margin-top: 10px">请填写你的新密码，并牢记防止丢失</div>
                </div>
                <div style="margin-top: 1.5vw">
                  <el-form>
                    <el-form-item prop="password">
                      <el-input maxlength="20" type="password" placeholder="密码">
                        <template #prefix>
                          <el-icon>
                            <Lock />
                          </el-icon>
                        </template>
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="password_repeat">
                      <el-input maxlength="20" type="password" placeholder="重复密码">
                        <template #prefix>
                          <el-icon>
                            <Lock />
                          </el-icon>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-form>
                </div>
                <div style="margin: 2.5vw 0">
                  <el-button @click="doReset" style="width: 22vw" type="danger" plain>立即重置密码</el-button>
                </div>
              </div>
            </div>
          </el-dialog>

          <el-button type="primary" @click="registerVisible = true">注册</el-button>
          <el-dialog v-model="registerVisible" width="33em" style="background-color: whitesmoke">
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <h1 style="color: black; font-size: 2em">注册</h1>
              <div style="font-size: 1em; color: #868484; margin-top: 10px">欢迎注册我们的学习平台，请在下方填写相关信息</div>
            </div>
            <div class="input-wrapper">
              <el-form>
                <el-form-item prop="username">
                  <el-input maxlength="30" type="text" placeholder="用户名/邮箱">
                    <template #prefix>
                      <el-icon>
                        <User />
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input type="password" maxlength="20" style="margin-top: 5px" placeholder="密码">
                    <template #prefix>
                      <el-icon>
                        <Lock />
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password_repeat">
                  <el-input type="password" maxlength="20" style="margin-top: 5px" placeholder="重复密码">
                    <template #prefix>
                      <el-icon>
                        <Lock />
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="email">
                  <el-input type="email" placeholder="电子邮件地址">
                    <template #prefix>
                      <el-icon>
                        <Message />
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="code">
                  <el-row :gutter="10" style="width: 100%;">
                    <el-col :span="18">
                      <el-input maxlength="6" type="text" placeholder="请输入验证码">
                        <template #prefix>
                          <el-icon>
                            <EditPen />
                          </el-icon>
                        </template>
                      </el-input>
                    </el-col>
                    <el-col :span="5">
                      <el-button type="success">
                        获取验证码
                      </el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-form>
              <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
                <div style="margin-top: 1vw">
                  <el-button style="width: 22vw" type="warning" plain @click="changeToLogin">立即注册</el-button>
                </div>
                <div style="margin: 1vw 0">
                  <span style="font-size: 1em; line-height: 15px; color: grey">已有账号?&nbsp;&nbsp;&nbsp;</span>
                  <el-link type="primary" style="translate: 0 -2.5px" @click="changeToLogin2">立即登录</el-link>
                </div>
              </div>
            </div>
          </el-dialog>
        </div>
        <el-dropdown v-else class="avatar" placement="bottom-end">
          <img src="./assets/avatae.png" alt="" style="border-radius: 10em; height: 100%; width: 100%;">
          <template #dropdown>
            <el-dropdown-menu style="width: 20em;">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item style="color: red">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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
import { EditPen, Lock, Message, User } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useAccountStore } from './store/accountStore';
const router = useRouter()
const accountStore = useAccountStore()
const role = accountStore.role
const changeToAIChat = () => {
  router.push({
    name: 'aichat'
  })
}
const changeToStatistics = () => {
  router.push({
    name: 'statistics'
  })
}
const changeToLearn = () => {
  router.push({
    name: 'learn'
  })
}
const changeToLearn2 = () => {
  if(role == 0){
    router.push({
      name: 'learn'
    })
  }else{
    router.push({
      name: 'aichat'
    })
  }
  ElMessage.success('登录成功，欢迎回来~')
}

const route = useRoute();
const isHomePage = computed(() => route.path === '/home')

const loginVisible = ref(false)
const registerVisible = ref(false)
const resetVisible = ref(false)
const changeToLogin = () => {
  registerVisible.value = false
  loginVisible.value = true
  ElMessage.success('注册成功，请登录进入学习平台')
}
const changeToLogin2 = () => {
  registerVisible.value = false
  loginVisible.value = true
}
const changeToRegister = () => {
  loginVisible.value = false
  registerVisible.value = true
}
const changeToReset = () => {
  loginVisible.value = false
  resetVisible.value = true
}

const active = ref(0)
const confirmReset = () => {
  active.value++
}
const doReset = () => {
  active.value--
  resetVisible.value = false
  loginVisible.value = true
  ElMessage.success('密码重置成功，请重新登录')
}

</script>

<style scoped>
.wrapper {
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  background-color: #1a1a1a;
}

header {
  height: 3.5em;
  background-color: #282828;
  border-bottom: 1px solid black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
}

.main-content {
  width: 100%;
  box-sizing: border-box;
  background-color: #1a1a1a;
  height: calc(100vh - 3.55em);
}

.avatar {
  height: 3em;
  width: 3em;
  border-radius: 10em;
  background-color: transparent;
  margin-right: 3em;
}

.nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 20%;
  margin-left: 3em;
  height: 100%;
  color: #eee;
}

.nav-item {
  width: 100%;
  font-size: 0.9em;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.nav-item:hover {
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
