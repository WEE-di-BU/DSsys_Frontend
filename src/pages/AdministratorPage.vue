<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface Teacher {
  username: string;
  email: string;
}

interface ApiResponse {
  data: Teacher[];
}

const teachers = ref<Teacher[]>([]);
const username = ref('');
const email = ref('');
// 弹出框是否显示
const isModalVisible = ref(false);

// 打开弹出框
const openAddTeacherModal = () => {
  username.value = '';
  email.value = '';
  isModalVisible.value = true;
};

// 关闭弹出框
const closeAddTeacherModal = () => {
  isModalVisible.value = false;
};

// 获取所有教师信息
const showTeachers = async () => {
  try {
    const response = await axios.get<ApiResponse>('http://127.0.0.1:5000/api/admin/get-teachers');
    console.log("API Response:", response.data);  // 打印返回的数据

    // 确保返回的数据是一个数组
    if (Array.isArray(response.data)) {
      teachers.value = response.data.map(item => ({
        username: item['t.username'],
        email: item['t.email'],
      }));
    } else {
      console.error('返回的数据格式不正确', response.data);
      alert('返回数据格式不正确');
    }
  } catch (error) {
    console.error('Error fetching teachers:', error);
    alert('网络错误，获取教师信息失败');
  }
}

// 添加新教师
const confirmAddTeacher = async () => {
  if (username.value && email.value) {
    try {
      // 向后端发送POST请求，添加教师
      await axios.post('http://127.0.0.1:5000/api/admin/add-teacher', {
        username: username.value,
        email: email.value,
      });

      // 新增教师后，刷新教师列表
      showTeachers();  // 重新获取并渲染教师列表
      username.value = ''; // 清空输入框
      email.value = '';    // 清空输入框
    } catch (error) {
      console.error('Error creating class:', error);
      alert('网络错误，教师添加失败');
    }
  } else {
    alert('请输入教师信息');
  }
};

// 页面加载时获取所有教师信息
onMounted(() => {
  showTeachers();
});
</script>

<template>
  <div class="contents">
    <!-- 教师信息列表 -->
    <div class="title-line">
      <h3 style="margin-bottom: 10px;">教师列表</h3>
      <button class="title-item-join" @click="openAddTeacherModal">+添加教师</button>
    </div>
    <table border="1" cellpadding="5" cellspacing="0" style="width: 60%; margin-bottom: 20px;">
      <thead>
      <tr>
        <th>用户名</th>
        <th>邮箱</th>
      </tr>
      </thead>
      <tbody>
      <!-- 表格样式  -->
      <tr>
        <td>111</td>
        <td>123@com</td>
      </tr>
      <tr v-for="(teacher, index) in teachers" :key="index">
        <td>{{ teacher.username }}</td>
        <td>{{ teacher.email }}</td>
      </tr>
      </tbody>
    </table>
  </div>

  <!-- 弹出框 -->
  <div v-if="isModalVisible" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeAddTeacherModal">&times;</span>
      <h2>添加老师</h2>
      <input type="text" id="username" v-model="username" placeholder="请输入用户名" />
      <input type="email" id="email" v-model="email" placeholder="请输入邮箱" />
      <button @click="confirmAddTeacher">确认添加老师</button>
    </div>
  </div>
</template>

<style scoped>
.contents {
  color: white;
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 10px;
  margin-top: 10px;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  padding: 8px;
  text-align: left;
}

form {
  margin-top: 20px;
}

label {
  margin-right: 10px;
}

.title-line{
  width: 60%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}

.title-item-join {
  width: 16%;
  font-size: 1em;
  color: black;
  background-color: #feb47b;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 10px 0;
}

.title-item:hover {
  background-color: gray;
  transition: 0.25s;
}

/* 弹出框样式 */
.modal {
  display: block;
  /* 显示弹出框 */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.9);
  /* 深色半透明背景 */
  width: 350px;
  padding: 30px;
  border-radius: 15px;
  z-index: 1000;
  /* 确保弹出框在最上层 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  /* 弹出框阴影效果 */
  transition: transform 0.3s ease, opacity 0.3s ease;
  /* 平滑过渡效果 */
}

/* 弹出框内容 */
.modal-content {
  background-color: #1a1a1a;
  /* 深灰色背景 */
  color: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  position: relative;
}

/* 关闭按钮样式 */
.close {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 24px;
  color: #ff8c00;
  /* 橙色 */
  cursor: pointer;
  transition: color 0.3s ease;
}

.close:hover {
  color: #ff4500;
  /* 浅橙色 */
}

/* 输入框样式 */
input {
  padding: 12px;
  margin: 15px 0;
  width: 90%;
  border-radius: 8px;
  border: 2px solid #ff8c00;
  /* 橙色边框 */
  background-color: #333333;
  /* 暗灰色背景 */
  color: white;
  font-size: 16px;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

input:focus {
  border-color: #ff4500;
  /* 聚焦时浅橙色 */
  background-color: #444444;
  /* 聚焦时更深的灰色 */
  outline: none;
}

/* 按钮样式 */
button {
  padding: 12px 25px;
  background-color: #ff8c00;
  /* 橙色 */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #ff4500;
  /* 鼠标悬停时变为浅橙色 */
}

/* 增加输入框和按钮的间距 */
button,
input {
  margin-top: 20px;
}
</style>
