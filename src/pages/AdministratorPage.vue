<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from "element-plus";
import axios from 'axios';

const username = ref('');
const email = ref('');
const isModalVisible = ref(false);

const openAddTeacherModal = () => {
  username.value = '';
  email.value = '';
  isModalVisible.value = true;
};

const closeAddTeacherModal = () => {
  isModalVisible.value = false;
};

interface TeacherInfo {
  id: number
  username: string
  email: string
  registerTime: string
}

let teacherLists = ref<TeacherInfo[]>([]);

const getAllTeachers = async () => {
  try {
    const token = JSON.parse(sessionStorage.getItem('access_token')).token;
    const { data } = await axios.get<TeacherInfo[]>("http://localhost:8088/api/admin/get-teachers", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    teacherLists.value = data;
    console.log("token为：", token);
    console.log("教师列表数据：", teacherLists.value);
  } catch (e) {
    console.error("获取教师列表失败：", e);
    ElMessage.error("获取教师列表失败！");
  }
};

onMounted(() => {
  getAllTeachers();
})

const confirmAddTeacher = async () => {
  if (username.value && email.value) {
    try {
      const token = JSON.parse(sessionStorage.getItem('access_token')).token;
      await axios.post('http://localhost:8088/api/admin/add-teacher', {
        username: username.value,
        email: email.value,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await getAllTeachers();
      username.value = '';
      email.value = '';
      ElMessage.success('教师添加成功！');
    } catch (error) {
      console.error('教师添加失败:', error);
      ElMessage.error('教师添加失败');
    }
  } else {
    ElMessage.warning('请输入教师信息');
  }
};
</script>

<template>
  <div style="width: 100%; display: flex;justify-content: center;background: radial-gradient(circle, #ff7e5f, #feb47b)">
    <div style="width: 65%; background-color: #282828;border: none; box-sizing: border-box; padding: 2em 2em">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin-bottom: 10px; color: #eeeeee">教师列表</h3>
        <el-button type="warning" @click="openAddTeacherModal">+ 添加老师</el-button>
      </div>
      <el-table :data="teacherLists" style="width: 100%" height="550"
                :header-cell-style="{ backgroundColor: '#282828', color: '#fff' }"
                :cell-style="{ backgroundColor: '#282828', color: '#fff' }"
                :row-style="{ height: '60px' }"
      >
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="username" label="Name" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="registerTime" label="Register Time" />
      </el-table>
    </div>
  </div>
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
.el-table {
  background-color: #282828;
}
.el-table__body-wrapper {
  background-color: #282828;
}
.el-table__empty-block {
  background-color: #282828;
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
