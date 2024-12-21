<template>
  <div class="wrapper">
    <header>
      <div class="nav">
        <div class="nav-item"
             v-show="role==='student' || $route.name === 'home'"
             @click="changeToLearn">
          学习
        </div>
        <div class="nav-item"
             v-show="role!='admin' || $route.name === 'home'"
             @click="changeToAIChat">
          AI问答
        </div>
        <div class="nav-item"
             v-show="role==='student' || $route.name === 'home'"
             @click="changeToStudentPersonalPage">
          个人中心
        </div>
        <!-- 由于教师和学生使用同一个系统，到时候登录操作编写应该给用户一个角色标记flag -->
        <!-- flag为student时跳转到学生主页，为teacher时跳转到教师主页 -->
        <div class="nav-item"
             v-show="role==='teacher'"
             @click="changeToTeacherPersonalPage">
          教师中心
        </div>
        <div class="nav-item"
             v-show="role==='admin'"
             @click="changeToAdministratorPersonalPage">
          教师管理
        </div>
      </div>
      <div>
        <div v-if="isHomePage" class="login-and-register">
          <el-button plain @click="loginVisible = true" style="border-color: deepskyblue">登录</el-button>
          <el-dialog
            v-model="loginVisible"
            width="33em"
            style="background-color: whitesmoke"
          >
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <h1 style="color: black; font-size: 2em">登录</h1>
              <div style="font-size: 1em; color: #868484; margin-top: 10px">
                在进入系统之前，请先输入用户名和密码进行登录
              </div>
            </div>
            <div class="input-wrapper">
              <el-form :model="login_form" :rules="login_rules" ref="formRef">
                <el-form-item prop="username">
                  <el-input v-model="login_form.username" maxlength="30" type="text" placeholder="用户名/邮箱">
                    <template #prefix>
                      <el-icon>
                        <User/>
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="login_form.password" type="password" maxlength="20" style="margin-top: 5px"
                            placeholder="密码">
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
                    <el-link @click="changeToReset">忘记密码？</el-link>
                  </el-col>
                </el-row>
              </el-form>
              <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
                <div style="margin-top: 1vw">
                  <el-button style="width: 22vw" type="success" plain @click="userLogin()">立即登录</el-button>
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
          <el-dialog
            v-model="resetVisible"
            width="33em"
            style="background-color: whitesmoke"
          >
            <div style="text-align: center">
              <div style="margin-top: 1vw">
                <el-steps :active="active" finish-status="success" align-center>
                  <el-step title="验证电子邮件"/>
                  <el-step title="重新设定密码"/>
                </el-steps>
              </div>
              <div style="margin: 0 2vw" v-if="active === 0">
                <div style="margin-top: 1vw">
                  <div style="font-size: 2em; font-weight: bold; color: black">重置密码</div>
                  <div style="font-size: 1em; color: #868484; margin-top: 10px">请输入需要重置密码的电子邮件地址</div>
                </div>
                <div style="margin-top: 1.5vw">
                  <el-form :model="reset_form" :rules="reset_rules" ref="reset_formRef">
                    <el-form-item prop="email">
                      <el-input v-model="reset_form.email" type="email" placeholder="电子邮件地址">
                        <template #prefix>
                          <el-icon>
                            <Message/>
                          </el-icon>
                        </template>
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="code">
                      <el-row :gutter="10" style="width: 100%">
                        <el-col :span="18">
                          <el-input v-model="reset_form.code" :maxlength="6" type="text" placeholder="请输入验证码">
                            <template #prefix>
                              <el-icon>
                                <EditPen/>
                              </el-icon>
                            </template>
                          </el-input>
                        </el-col>
                        <el-col :span="5">
                          <el-button @click="reset_askCode" :disabled="!reset_isEmailValid || reset_coldTime > 0"
                                     type="success">
                            {{ reset_coldTime > 0 ? `请稍后 ${reset_coldTime} 秒` : '获取验证码' }}
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
                  <el-form :model="reset_form" :rules="reset_rules" ref="reset_formRef">
                    <el-form-item prop="password">
                      <el-input v-model="reset_form.password" maxlength="20" type="password" placeholder="密码">
                        <template #prefix>
                          <el-icon>
                            <Lock/>
                          </el-icon>
                        </template>
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="password_repeat">
                      <el-input v-model="reset_form.password_repeat" maxlength="20" type="password"
                                placeholder="重复密码">
                        <template #prefix>
                          <el-icon>
                            <Lock/>
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
          <el-dialog
            v-model="registerVisible"
            width="33em"
            style="background-color: whitesmoke"
          >
            <div
              style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
              <h1 style="color: black; font-size: 2em">注册</h1>
              <div style="font-size: 1em; color: #868484; margin-top: 10px">
                欢迎注册Medi-Insight网站，请在下方填写相关信息
              </div>
            </div>
            <div class="input-wrapper">
              <el-form :model="register_form" :rules="register_rules" ref="register_formRef">
                <el-form-item prop="username">
                  <el-input v-model="register_form.username" maxlength="30" type="text" placeholder="用户名/邮箱">
                    <template #prefix>
                      <el-icon>
                        <User/>
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="register_form.password" type="password" maxlength="20" style="margin-top: 5px"
                            placeholder="密码">
                    <template #prefix>
                      <el-icon>
                        <Lock/>
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password_repeat">
                  <el-input v-model="register_form.password_repeat" type="password" maxlength="20"
                            style="margin-top: 5px" placeholder="重复密码">
                    <template #prefix>
                      <el-icon>
                        <Lock/>
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="email">
                  <el-input v-model="register_form.email" type="email" placeholder="电子邮件地址">
                    <template #prefix>
                      <el-icon>
                        <Message/>
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="code">
                  <el-row :gutter="10" style="width: 100%;">
                    <el-col :span="18">
                      <el-input v-model="register_form.code" :maxlength="6" type="text" placeholder="请输入验证码">
                        <template #prefix>
                          <el-icon>
                            <EditPen/>
                          </el-icon>
                        </template>
                      </el-input>
                    </el-col>
                    <el-col :span="5">
                      <el-button @click="askCode" :disabled="!isEmailValid || coldTime" type="success">
                        {{ coldTime > 0 ? `请稍后 ${coldTime} 秒` : '获取验证码' }}
                      </el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-form>
              <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
                <div style="margin-top: 1vw">
                  <el-button style="width: 22vw" type="warning" plain @click="register2">立即注册</el-button>
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
          <img src="@/assets/avatar.png" alt="" style="border-radius: 10em; height: 100%; width: 100%;">
          <template #dropdown>
            <el-dropdown-menu style="width: 20em;">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item style="color: red" @click="userLogout">退出登录</el-dropdown-item>
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
import {register} from 'swiper/element/bundle';

register();
import {useRouter, useRoute} from 'vue-router';
import {computed, reactive, onMounted, onUnmounted} from "vue";
import {ref} from 'vue'
import {EditPen, Lock, Message, User} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {login, get, post, logout} from "@/net/index.js";
import axios from 'axios'

const router = useRouter()

const changeToAIChat = () => {
  router.push({
    name: 'aichat'
  })
}
const changeToStudentPersonalPage = () => {
  router.push({
    name: 'studentpersonalpage'
  })
}

const changeToTeacherPersonalPage = () => {
  router.push({
    name: 'teacherpersonalpage'
  })
}

const changeToAdministratorPersonalPage = () => {
  router.push({
    name: 'administratorpage'
  })
}

const changeToLearn = () => {
  router.push({
    name: 'learn'
  })
}

const route = useRoute();
const isHomePage = computed(() => route.path === '/home')

// ==============登录==================
const formRef = ref()
const login_form = reactive({
  username: '',
  password: '',
  remember: false,
})

const login_rules = {
  username: [
    {required: true, message: '请输入用户名'}
  ],
  password: [
    {required: true, message: '请输入密码'}
  ]
}

const userLogin = () => {
  formRef.value.validate((isValid) => {
    if (isValid) {
      login(login_form.username, login_form.password, login_form.remember, (data) => {
        retrieveAuthData()

        if (data.role === 'student') {
          router.push({name: 'learn'})
        } else if (data.role === 'teacher') {
          router.push({name: 'teacherpersonalpage'})
        } else {
          router.push({name: 'administratorpage'})
        }
      })
    }
  });
}

// ==============注册==================
const register_formRef = ref()
const coldTime = ref(0)

const register_form = reactive({
  username: '',
  password: '',
  password_repeat: '',
  email: '',
  code: ''
})

const validateUsername = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入用户名'))
  } else if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)) {
    callback(new Error('用户名不能包含特殊字符，只能是中文/英文'))
  } else {
    callback()
  }
}

const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== register_form.password) {
    callback(new Error("两次输入的密码不一致"))
  } else {
    callback()
  }
}

const register_rules = {
  username: [
    {validator: validateUsername, trigger: ['blur', 'change']},
    {min: 1, max: 30, message: '用户名的长度必须在1-30个字符之间', trigger: ['blur', 'change']},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 20, message: '密码的长度必须在6-20个字符之间', trigger: ['blur', 'change']}
  ],
  password_repeat: [
    {validator: validatePassword, trigger: ['blur', 'change']},
  ],
  email: [
    {required: true, message: '请输入邮件地址', trigger: 'blur'},
    {type: 'email', message: '请输入合法的电子邮件地址', trigger: ['blur', 'change']}
  ],
  code: [
    {required: true, message: '请输入获取的验证码', trigger: 'blur'},
  ]
}

const askCode = () => {
  if (isEmailValid) {
    coldTime.value = 60
    get(`http://localhost:8088/auth/ask-code?email=${register_form.email}&type=register`, () => {
      ElMessage.success(`验证码已发送到邮箱: ${register_form.email}，请注意查收`)
      const handle = setInterval(() => {
        coldTime.value--
        if (coldTime.value === 0) {
          clearInterval(handle)
        }
      }, 1000)
    }, (message) => {
      ElMessage.warning(message)
      coldTime.value = 0
    })
  } else {
    ElMessage.warning("请输入正确的电子邮件！")
  }
}

const isEmailValid = computed(() => /^[\w.-]+@[\w.-]+\.\w+$/.test(register_form.email))

const register2 = () => {
  register_formRef.value.validate((isValid) => {
    if (isValid) {
      post('http://localhost:8088/auth/register', {...register_form}, () => {
        ElMessage('注册成功，欢迎加入我们')
        registerVisible.value = false
        loginVisible.value = true
      })
    } else {
      ElMessage.warning('请完整填写注册表单内容')
    }
  })
}

// ==============重置密码==================
const reset_form = reactive({
  email: '',
  code: '',
  password: '',
  password_repeat: ''
})

const reset_formRef = ref()
const reset_coldTime = ref(0)
const active = ref(0)
const reset_isEmailValid = computed(() => /^[\w.-]+@[\w.-]+\.\w+$/.test(reset_form.email))

const reset_validatePassword = (rules, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== reset_form.password) {
    callback(new Error("两次输入的密码不一致"))
  } else {
    callback()
  }
}

const reset_rules = {
  email: [
    {required: true, message: '请输入邮件地址', trigger: 'blur'},
    {type: 'email', message: '请输入合法的电子邮件地址', trigger: ['blur', 'change']}
  ],
  code: [
    {required: true, message: '请输入获取的验证码', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 20, message: '密码的长度必须在6-20个字符之间', trigger: ['blur']}
  ],
  password_repeat: [
    {validator: reset_validatePassword, trigger: ['blur', 'change']},
  ],
}

const reset_askCode = () => {
  if (reset_isEmailValid) {
    reset_coldTime.value = 60
    get(`http://localhost:8088/auth/ask-code?email=${reset_form.email}&type=reset`, () => {
      ElMessage.success(`验证码已发送到邮箱: ${reset_form.email}，请注意查收`)
      const handle = setInterval(() => {
        reset_coldTime.value--
        if (reset_coldTime.value === 0) {
          clearInterval(handle)
        }
      }, 1000)
    }, (message) => {
      ElMessage.warning(message)
      reset_coldTime.value = 0
    })
  } else {
    ElMessage.warning("请输入正确的电子邮件！")
  }
}

const confirmReset = () => {
  reset_formRef.value.validate((isValid) => {
    if (isValid) {
      post('http://localhost:8088/auth/reset-confirm', {
        email: reset_form.email,
        code: reset_form.code
      }, () => active.value++)
    }
  })
}

const doReset = () => {
  reset_formRef.value.validate((isValid) => {
    if (isValid) {
      post('http://localhost:8088/auth/reset-password', {...reset_form}, () => {
        ElMessage.success('密码重置成功，请重新登录')
        registerVisible.value = false
        loginVisible.value = true
      })
    }
  })
}

const loginVisible = ref(false)
const registerVisible = ref(false)
const resetVisible = ref(false)
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

const userLogout = () => {
  role = ''
  logout(() => router.push('/home'))
};

// ==================取data========================
const authItemName = 'access_token'

interface AuthData {
  token: string
  expire: string
  username: string
  id: string
  role: string
}

const authData = ref<AuthData | null>(null)
let role = null

const retrieveAuthData = async () => {
  let storedData = localStorage.getItem(authItemName)
  if (!storedData) {
    storedData = sessionStorage.getItem(authItemName)
  }

  if (storedData) {
    try {
      const parsedData: AuthData = JSON.parse(storedData)
      authData.value = parsedData
      console.log('用户ID:', parsedData.id)
      console.log('用户名:', parsedData.username)
      console.log('角色:', parsedData.role)
      role = parsedData.role

      // POST 请求到后端
      try {
        const response = await axios.post('http://127.0.0.1:5000/create_user_node', {
          id: parsedData.id,
          username: parsedData.username,
          role: parsedData.role,
        }, {
          headers: {
            'Content-Type': 'application/json',
            // 如果需要授权头，可以在这里添加
            // 'Authorization': `Bearer ${parsedData.token}`
          }
        })

        // 处理成功响应
        console.log('用户节点创建成功:', response.data.message)
        // ElMessage.success('用户节点创建成功')

      } catch (error: any) {
        if (error.response) {
          console.error('服务器错误:', error.response.data.error)
          ElMessage.error(`服务器错误: ${error.response.data.error}`)
        } else if (error.request) {
          console.error('无响应:', error.request)
          ElMessage.error('无响应，请检查网络连接。')
        } else {
          console.error('请求错误:', error.message)
          ElMessage.error(`请求错误: ${error.message}`)
        }
      }

    } catch (error) {
      console.error('解析认证数据失败:', error)
      ElMessage.error('解析认证数据失败')
      authData.value = null
    }
  } else {
    authData.value = null
  }
}

onMounted(() => {
  retrieveAuthData()
  window.addEventListener('user-logged-in', userLogin)
})

onUnmounted(() => {
  window.removeEventListener('user-logged-in', userLogout)
})

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
