<template>
  <div class="whole-wrapper">
    <div class="top-wrapper">
      <div class="individual-info">
        <div class="left-info">
          <div class="avatar-wrapper">
            <div class="avatar"></div>
          </div>
          <div class="profile">
            <h2 style="color: white">👸🏻</h2>
            <small style="color: white">教师</small>
            <p style="color: white; font-size: 13px">文房四宝 理堂丁珍</p>
          </div>
        </div>
        <div class="right-info">
          <div class="individual-data">
            <div class="quest-count">
              <div class="d-title">
                发布次数
              </div>
              <div class="d-num">
                6
              </div>
            </div>
            <div class="class-count">
              <div class="d-title">
                班级数量
              </div>
              <div class="d-num">
                6
              </div>
            </div>
            <div class="learned-time">
              <div class="d-title">
                作业数量
              </div>
              <div class="d-num">
                0
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="contents">
      <div class="classes-info-wrapper">
        <div class="classes-wrapper-title">
          <div class="title-item">
            班级
          </div>
        </div>
        <div class="classes-wrapper-title">
          <div class="title-item-join" @click="openJoinClassModal" style="border-radius: 20px;">
            +创建班级
          </div>
        </div>
        <div class="classes-wrapper-contents">
          <el-scrollbar class="scrollbar-horizontal">
            <ul class="classes-list">
              <li class="cls" v-for="(classItem, index) in classes" :key="index">
                <div class="cls-img"></div>
                <div class="cls-desc">
                  <h2>{{ classItem.course_name }}</h2>
                  <h2>{{ classItem.class_id }}</h2>
                  <small>云南大学</small>
                  <p>于倩</p>
                  <h5>课程容量：{{ classItem.capacity }} 人</h5>
                  <h5>2025年1月18日结束</h5>
                </div>
              </li>
              <li class="spacer-x"></li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <!-- 弹出框 -->
    <div v-if="isModalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeJoinClassModal">&times;</span>
        <h2>创建班级</h2>
        <input type="text" v-model="classNumber1" placeholder="请输入课程名" />
        <input type="text" v-model="classNumber2" placeholder="请输入课程容量" />
        <button @click="confirmJoinClass">确认创建班级</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

interface Course {
  class_id: string;
  course_name: string;
  capacity: string;
}
interface ApiResponse {
  data: Course[];
}
// 弹出框是否显示
const isModalVisible = ref(false);
const classes = ref<Course[]>([]);

// 班级号
const classNumber1 = ref('');
const classNumber2 = ref('');
const user_id = ref('2');
const role = ref('1');

// 打开弹出框
const openJoinClassModal = () => {
  classNumber1.value = '';
  classNumber2.value = '';
  isModalVisible.value = true;
};

// 关闭弹出框
const closeJoinClassModal = () => {
  isModalVisible.value = false;
};

// 确认创建班级
const confirmJoinClass = async () => {
  if (classNumber1.value && classNumber2.value) {
    try {
      // 向后端发送POST请求，创建班级
      const response = await axios.post('http://127.0.0.1:5000/api/create_class', {
        user_id: user_id.value,
        role: role.value,
        course_name: classNumber1.value,
        capacity: classNumber2.value,
      });

      if (response.data.class_id) {
        alert(`班级创建成功，班级号为: ${response.data.class_id}`);
        closeJoinClassModal();
        fetchClasses();
      } else {
        alert('班级创建失败');
      }
    } catch (error) {
      console.error('Error creating class:', error);
      alert('网络错误，班级创建失败');
    }
  } else {
    alert('请输入课程信息');
  }
};
// 获取课程列表
const fetchClasses = async () => {
  try {
    // 请求获取课程列表
    const response = await axios.get<ApiResponse>('http://127.0.0.1:5000/api/get_classes', {
      params: { user_id: user_id.value,role: role.value }
    });

    console.log("API Response:", response.data);  // 打印返回的数据

    // 确保返回的数据是一个数组
    if (Array.isArray(response.data)) {
      classes.value = response.data.map(item => ({
        course_name: item['c.course_name'],
        class_id: item['c.class_id'],
        capacity: item['c.capacity'],
      }));
    } else {
      console.error('返回的数据格式不正确', response.data);
      alert('返回数据格式不正确');
    }
  } catch (error) {
    console.error('Error fetching classes:', error);
    alert('网络错误，获取班级信息失败');
  }
};

// 初始加载课程数据
fetchClasses();
</script>

<style lang="css" scoped>
.whole-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.top-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 13.75em;
  background: radial-gradient(circle, #ff7e5f, #feb47b);
}

.individual-info {
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-info {
  height: 100%;
  width: 70%;
  display: flex;
  justify-content: space-between;
}

.avatar-wrapper {
  height: 100%;
  width: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar {
  width: 5em;
  height: 5em;
  border: solid 2px #fff;
  border-radius: 2.5em;
  background: url("@/assets/avatar.png");
}

.profile {
  width: 85%;
  padding: 4.5em 1em;
  display: flex;
  flex-direction: column;
  justify-content: left;
}

.right-info {
  height: 100%;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.individual-data {
  width: 95%;
  height: 50%;
  background-color: #0000001A;
  margin-top: 0.75vw;
  border-radius: 1em;
  display: flex;
  align-items: center;
}

.quest-count {
  width: 33.3%;
  height: 90%;
  padding: 0.25em 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.class-count {
  width: 33.4%;
  height: 90%;
  padding: 0.25em 0;
  border-left: solid 0.025em;
  border-right: solid 0.025em;
  border-image: linear-gradient(to bottom, #0000001A, #f1f1f1, #0000001A) 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.learned-time {
  width: 33.3%;
  height: 90%;
  padding: 0.25em 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.d-title {
  height: 50%;
  width: 95%;
  margin-top: 0.25em;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: small;
  font-weight: 300;
}

.d-num {
  height: 50%;
  width: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: small;
  font-weight: 700;
  color: #dadada;
}

.contents {
  width: 78%;
  height: 30em;
  margin-top: 2em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.classes-info-wrapper {
  width: 68%;
  height: 100%;
  border-radius: 0.5em;
}

.classes-wrapper-title {
  display: inline-block;
  height: 7%;
  width: 15%;
  border-bottom: solid 0.025em;
  border-image: linear-gradient(to right, #0000001A, #f1f1f1, #0000001A) 1;
}

.title-item {
  width: 100%;
  font-size: 1em;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.title-item-join{
  width: 100%;
  font-size: 1em;
  color: black;
  background-color: #feb47b;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.title-item:hover {
  background-color: gray;
  transition: 0.25s;
}


.classes-wrapper-contents {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.scrollbar-horizontal {
  width: 100%;
  height: 100%;
  white-space: nowrap;
  overflow-x: auto;
}

.scrollbar-horizontal::-webkit-scrollbar {
  display: none;
}

.scrollbar-horizontal::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.5); /* 自定义滚动条样式 */
}

.classes-list {
  width: 95%;
  height: 23.5em !important;
  display: flex;
  padding-left: 1em;
  padding-right: 1em;
  position: relative;
  z-index: 998;
}

.cls {
  flex-shrink: 0;
  width: 15em;
  list-style-type: none;
  margin-right: 1em;
  display: flex;
  flex-direction: column;
  background-color: #282828;
  color: #cccccc;
  border-radius: 1em;
}

.cls-img {
  height: 30%;
  width: 100%;
}

.cls-desc {
  margin: 1em 1em;

  h2 {
    font-size: 20px;
  }

  p {
    font-size: 15px;
    margin: 1em 0;
  }

  h5 {
    position: relative;
    bottom: -100px;
  }
}

.spacer-x {
  flex-shrink: 0; /* 防止被压缩 */
  width: 1em; /* 空白宽度 */
  background: transparent; /* 没有背景色 */
}

.collections-wrapper {
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.collections-info {
  height: 60%;
  width: 100%;
  background-color: #282828;
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: center;
}

.collections-title {
  width: 90%;
  height: 13%;
  margin-left: 1em;
  margin-right: 1em;
  margin-top: 0.5em;
  font-size: 1em;
  color: white;
  display: flex;
  justify-content: left;
  align-items: center;
}

.scrollbar-vertical {
  width: 100%;
  height: 100%;
  white-space: nowrap;
  overflow-y: auto;
  overflow-x: hidden !important;
}

.scrollbar-vertical::-webkit-scrollbar {
  display: none;
}

.scrollbar-vertical::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.5); /* 自定义滚动条样式 */
}

.collections-list {
  width: 90%;
  height: 2em !important;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin-left: 2em;
  margin-right: 1em;
  padding: 0;
  position: relative;
  z-index: 998;
  white-space: normal;
}

.clt {
  flex-shrink: 0;
  width: 95%;
  list-style-type: none;
  color: #cccccc;
  border-radius: 1em;
  border-bottom: solid 0.025em;
  border-image: linear-gradient(to right, #f1f1f1, #0000001A) 1;
  margin-bottom: 0.5em;
}

.spacer-y {
  flex-shrink: 0; /* 防止被压缩 */
  height: 0.1em; /* 空白宽度 */
  background: transparent; /* 没有背景色 */
  list-style-type: none;
}

.other {
  height: 30%;
  width: 100%;
  background-color: #282828;
  border-radius: 0.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

/* 弹出框样式 */
.modal {
  display: block; /* 显示弹出框 */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.9); /* 深色半透明背景 */
  width: 350px;
  padding: 30px;
  border-radius: 15px;
  z-index: 1000; /* 确保弹出框在最上层 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); /* 弹出框阴影效果 */
  transition: transform 0.3s ease, opacity 0.3s ease; /* 平滑过渡效果 */
}

/* 弹出框内容 */
.modal-content {
  background-color: #1a1a1a; /* 深灰色背景 */
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
  color: #ff8c00; /* 橙色 */
  cursor: pointer;
  transition: color 0.3s ease;
}

.close:hover {
  color: #ff4500; /* 浅橙色 */
}

/* 输入框样式 */
input {
  padding: 12px;
  margin: 15px 0;
  width: 90%;
  border-radius: 8px;
  border: 2px solid #ff8c00; /* 橙色边框 */
  background-color: #333333; /* 暗灰色背景 */
  color: white;
  font-size: 16px;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

input:focus {
  border-color: #ff4500; /* 聚焦时浅橙色 */
  background-color: #444444; /* 聚焦时更深的灰色 */
  outline: none;
}

/* 按钮样式 */
button {
  padding: 12px 25px;
  background-color: #ff8c00; /* 橙色 */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #ff4500; /* 鼠标悬停时变为浅橙色 */
}

/* 增加输入框和按钮的间距 */
button, input {
  margin-top: 20px;
}

</style>
