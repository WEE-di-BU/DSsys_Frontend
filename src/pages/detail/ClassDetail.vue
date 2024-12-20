<template>
  <div class="container">
    <div class="list">
      <h1 class="title">班级学生列表</h1>
      <div class="student-list-wrapper">
        <div class="student-list">
          <!-- 表头 -->
          <div class="table-header">
            <span class="header-item">序号</span>
            <span class="header-item">学生姓名</span>
            <span class="header-item">学习进度</span>
          </div>
          <!-- 学生列表 -->
          <div v-for="(student, index) in students" :key="index" class="student-item">
            <span class="student-index">{{ index + 1 }}</span>
            <span class="student-name">{{ student.stu_name }}</span>
            <div class="progress-wrapper">
              <el-progress
                :text-inside="true"
                :stroke-width="22"
                :percentage="student.click_num"
                :status="getProgressStatus(student.click_num)"
              ></el-progress>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 接收组件传递的班级ID
const props = defineProps({
  cid: { type: String, required: true },
});

// 定义存储学生数据的响应式变量
const students = ref([]);

// 根据学习进度返回不同的进度条状态
const getProgressStatus = (percentage: number) => {
  if (percentage < 30) {
    return 'exception'; // 红色
  } else if (percentage < 70) {
    return 'warning'; // 橙色
  } else {
    return 'success'; // 绿色
  }
};

// 请求后端API，获取学生列表数据
const fetchStudents = async () => {
  try {
    const response = await axios.get(`/api/class/${props.cid}`);
    students.value = response.data; // 将获取到的数据赋值给 students
  } catch (error) {
    console.error('获取学生列表失败:', error);
  }
};

// 页面加载时获取学生数据
onMounted(() => {
  fetchStudents();
});
</script>

<style lang="css" scoped>
/* 页面整体布局 */
.container {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, #ff7e5f, #feb47b); /* 橙色渐变背景 */
}

.list {
  width: 60%;
  height: 95vh;
  background: black;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 标题样式 */
.title {
  text-align: center;
  font-size: 2.5rem;
  margin-top: 20px;
  margin-bottom: 20px;
  color: #ff7f50; /* 橙色标题 */
}

/* 学生列表容器 */
.student-list-wrapper {
  width: 100%;
  max-width: 800px;
  max-height: 75vh; /* 设置最大高度，超出部分触发滚动 */
  background-color: #1a1a1a; /* 黑色背景 */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow-y: auto; /* 超出容器时显示垂直滚动条 */
  overflow-x: hidden; /* 隐藏水平滚动条（如果内容水平宽度不足） */
}

.student-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 表头样式 */
.table-header {
  display: flex;
  align-items: center;
  background-color: #444; /* 深灰色背景 */
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
}

.header-item {
  font-size: 1.2rem;
  color: #ff7f50; /* 橙色表头文字 */
  flex: 1;
  text-align: center;
}

/* 学生列表项样式 */
.student-item {
  display: flex;
  align-items: center;
  background-color: #333; /* 灰色背景 */
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.student-item:hover {
  transform: translateY(-5px); /* 鼠标悬停时上移效果 */
}

/* 序号样式 */
.student-index,
.student-name {
  flex: 1;
  font-size: 1.2rem;
  color: white; /* 白色文本 */
  text-align: center;
}

/* 进度条容器样式 */
.progress-wrapper {
  flex: 2; /* 调整进度条列宽度比例 */
  max-width: 250px; /* 最大宽度限制 */
  overflow: hidden; /* 防止溢出 */
}

/* 覆盖 el-progress 的背景底色 */
::v-deep(.el-progress-bar__outer) {
  background-color: #676666; /* 深灰色作为底色，与整体页面风格一致 */
}

::v-deep(.el-progress-bar__inner) {
  border-radius: 4px; /* 优化进度条内侧的圆角 */
}
</style>


