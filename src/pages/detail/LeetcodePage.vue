<template>
  <div class="container">
    <div class="black-box" style="flex: 2;">
      <div class="top-section" style="height: 4.5vw">
        <h2>学习情况分析</h2>
      </div>
      <div class="bottom-section" style="height:24.7vw;">
        <h3 style="margin-bottom: 2vw">据学习点击率，如下列排序：</h3>
        <div v-for="(concept, index) in top5Concepts" :key="index" class="concept-item" :style="'margin-bottom:1vw'">
          <span class="concept-number">{{ index + 1 }}.</span>
          <span class="concept-name">{{ concept.concept_name }}</span>
        </div>
        <h3 style="margin-bottom: 1vw; margin-top: 2vw;">推荐符合你学习情况的习题，请点击：</h3>
        <div class="matched-cname-container">
          <div v-for="(matchedCName, index) in matchedCNames" :key="index" class="matched-cname-item">
            <span class="matched-cname" @click="selectTag(matchedCName['Matched CNames'])">
            {{ matchedCName['Matched CNames'] }}
            </span>
          </div>
        </div>
      </div>
      <div class="pagination" style="height:2.4vw;">
      </div>
    </div>
    <div class="black-box" style="flex: 8">
      <!-- 上面的小块 -->
      <div class="top-section">
        <!-- 标签下拉菜单 -->
        <div class="dropdown tags-dropdown">
          <label>标签：</label>
          <div class="tags-button" @click="toggleTagsDropdown">
            {{ selectedTag || "请选择标签" }}
          </div>

          <div v-if="showTags" class="tags-menu">
            <input
              type="text"
              v-model="filterText"
              placeholder="筛选标签"
              class="search-box"
            />
            <div
              v-for="(section, sectionKey) in filteredTags"
              :key="sectionKey"
              class="tag-section"
            >
              <div class="section-title">{{ sectionKey }}</div>
              <div class="tags-list">
                <span
                  v-for="tag in section"
                  :key="tag"
                  class="tag-item"
                  @click="selectTag(tag)"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 难度选择 -->
        <div class="difficulty-dropdown">
          <label>难度：</label>
          <div class="difficulty-button" @click="toggleDifficultyDropdown">
            {{ selectedDifficulty || "请选择难度" }}
          </div>

          <div v-if="showDifficulty" class="difficulty-menu">
            <div
              class="difficulty-option easy"
              @click="selectDifficulty('简单')"
            >
              · 简单
            </div>
            <div
              class="difficulty-option medium"
              @click="selectDifficulty('中等')"
            >
              · 中等
            </div>
            <div
              class="difficulty-option hard"
              @click="selectDifficulty('困难')"
            >
              · 困难
            </div>
            <div
              class="difficulty-option all"
              @click="selectDifficulty('全部')"
            >
              · 全部
            </div>
          </div>
        </div>

        <!-- 搜索栏 -->
        <div class="search-section">
          <label>搜索：</label>
          <input
            type="text"
            v-model="searchText"
            placeholder="输入内容搜索"
            class="search-input"
            @keyup.enter="handleSearch"
            ref="searchInput"
          />
        </div>
      </div>

      <!-- 题目显示区域 -->
      <div class="bottom-section">
        <div v-for="(problem, index) in paginatedProblems" :key="index" class="problem-item">
          <!-- 序号和题目靠左对齐 -->
          <div class="problem-left">
            <span class="problem-number">{{ (currentPage - 1) * pageSize + index + 1 }}.</span>
            <a :href="problem.url" target="_blank" class="problem-text">{{ problem.text }}</a>
          </div>
          <!-- 难度靠右对齐 -->
          <span :class="getLevelClass(problem.level)" class="problem-level">{{ getLevelText(problem.level) }}</span>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
          &lt;
        </button>
        <template v-for="page in visiblePages" :key="page">
          <button
            :class="{ active: currentPage === page }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <span v-if="page === '...'">...</span>
        </template>
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
          &gt;
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BlackBox",
  data() {
    return {
      // 标签相关
      selectedTag: "",
      showTags: false,
      filterText: "",
      top5Concepts: [],
      matchedCNames: [],
      tagSections: {
        全部: ["全部"],
        基本: ["数组", "字符串", "排序", "矩阵", "模拟", "枚举", "字符串匹配","计数排序","桶排序","基数排序"],
        算法: ["动态规划", "贪心", "深度优先搜索", "二分查找","广度优先搜索", "回溯", "递归", "分治", "记忆化搜索", "归并排序", "快速选择"],
        基础数据结构: ["哈希表", "树", "二叉树", "堆（优先队列）", "栈", "图", "链表", "单调栈", "有序集合", "队列", "二叉搜索树", "拓扑排序", "最短路", "单调队列", "双向链表", "最小生成树", "强连通分量", "欧拉回路", "双连通分量"],
        高级数据结构: [ "并查集", "字典树", "线段树","树状数组","后缀数组"],
        技巧: ["位运算", "双指针", "前缀和", "计数", "滑动窗口", "状态压缩", "哈希函数","滚动哈希","扫描线"],
        数学: ["数学", "数论", "几何", "组合数学", "博弈", "随机化", "概率与统计","水塘抽样","拒绝采样"],
        其他: ["数据库", "设计", "数据流", "交互", "脑筋急转弯", "迭代器", "多线程","Shell"],
      },

      // 难度相关
      selectedDifficulty: "",
      showDifficulty: false,

      // 搜索栏
      searchText: "",

      // 题目数据
      problems: [], // 当前显示的题目列表
      cachedProblems: [], // 缓存的初始题目列表
      currentPage: 1,
      pageSize: 7,
    };
  },
  computed: {
    filteredTags() {
      const filterText = this.filterText.trim().toLowerCase();
      if (!filterText) return this.tagSections;

      const filtered = {};
      for (const [section, tags] of Object.entries(this.tagSections)) {
        const matchedTags = tags.filter((tag) =>
          tag.toLowerCase().includes(filterText)
        );
        if (matchedTags.length) {
          filtered[section] = matchedTags;
        }
      }
      return filtered;
    },

    // 分页计算
    paginatedProblems() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.problems.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.problems.length / this.pageSize);
    },

    // 动态计算可见页码
    visiblePages() {
      const total = this.totalPages;
      const current = this.currentPage;
      const visibleRange = 5; // 显示的页码范围
      const pages = [];

      // 如果总页数小于等于 10，直接显示所有页码
      if (total <= visibleRange * 2) {
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
        return pages;
      }

      // 如果当前页在前五页范围内，显示前五页、省略号、最后两页
      if (current <= visibleRange) {
        for (let i = 1; i <= visibleRange; i++) {
          pages.push(i);
        }
        pages.push("...");
        for (let i = total - 1; i <= total; i++) {
          pages.push(i);
        }
        return pages;
      }

      // 如果当前页在最后五页范围内，显示前两页、省略号、最后五页
      if (current >= total - visibleRange + 1) {
        for (let i = 1; i <= 2; i++) {
          pages.push(i);
        }
        pages.push("...");
        for (let i = total - visibleRange + 1; i <= total; i++) {
          pages.push(i);
        }
        return pages;
      }

      // 如果当前页在中间，显示前两页、省略号、当前页附近的页码、省略号、最后两页
      for (let i = 1; i <= 2; i++) {
        pages.push(i);
      }
      pages.push("...");
      for (let i = current - 2; i <= current + 2; i++) {
        pages.push(i);
      }
      pages.push("...");
      for (let i = total - 1; i <= total; i++) {
        pages.push(i);
      }

      return pages;
    },
  },
  methods: {
    toggleTagsDropdown() {
      this.showTags = !this.showTags;
    },
    async fetchTop5Concepts() {
      try {
        // 调用后端接口
        const response = await fetch('http://127.0.0.1:5000/top5_concepts');
        if (!response.ok) {
          throw new Error('网络响应失败');
        }
        // 解析返回的数据
        const data = await response.json();
        // 将数据存储到 top5Concepts
        this.top5Concepts = data;
      } catch (error) {
        console.error('获取数据失败:', error);
      }
    },
    async fetchMatchedCNames() {
      try {
        // 调用后端接口
        const response = await fetch('http://127.0.0.1:5000/process_data');
        if (!response.ok) {
          throw new Error('网络响应失败');
        }
        // 解析返回的数据
        const data = await response.json();
        // 将数据存储到 matchedCNames
        this.matchedCNames = data;
      } catch (error) {
        console.error('获取 Matched CNames 失败:', error);
      }
    },
    async selectTag(tag) {
      this.selectedTag = tag;
      this.showTags = false;
      this.selectedDifficulty = "";
      this.showDifficulty = false;

      if (tag === "全部") {
        // 如果点击的是“全部”标签，恢复缓存的题目列表
        this.problems = [...this.cachedProblems];
        this.currentPage = 1; // 重置当前页为第一页
        return;
      }

      // 向后端发送请求，获取与标签相关的题目
      try {
        const response = await fetch("http://127.0.0.1:5000/get_tag_exercises", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ CName: tag }),
        });
        const data = await response.json();
        this.problems = data.exercises || [];
        this.currentPage = 1;
      } catch (error) {
        console.error("Error fetching tag exercises:", error);
      }
    },
    toggleDifficultyDropdown() {
      this.showDifficulty = !this.showDifficulty;
    },
    selectDifficulty(difficulty) {
      this.selectedDifficulty = difficulty;
      this.showDifficulty = false;

      if (difficulty === "全部") {
        // 如果选择的是“全部”难度，恢复到当前显示的题目列表
        return;
      }

      // 根据难度筛选当前显示的题目列表
      const difficultyMap = {
        简单: 0,
        中等: 1,
        困难: 2,
      };
      const level = difficultyMap[difficulty];
      this.problems = this.problems.filter((problem) => problem.level === level);
      this.currentPage = 1; // 重置当前页为第一页
    },

    // 获取题目难度文本
    getLevelText(level) {
      switch (level) {
        case 0:
          return "简单";
        case 1:
          return "中等";
        case 2:
          return "困难";
        case 3:
          return "全部";
        default:
          return "";
      }
    },

    // 获取题目难度样式
    getLevelClass(level) {
      switch (level) {
        case 0:
          return "easy";
        case 1:
          return "medium";
        case 2:
          return "hard";
        case 3:
          return "all";
        default:
          return "";
      }
    },

    // 从后端获取题目数据
    async fetchProblems() {
      try {
        const response = await fetch("http://127.0.0.1:5000/get_all_exercises", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        this.problems = data; // 更新当前题目列表
        this.cachedProblems = [...data]; // 缓存初始题目列表
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    },

    // 跳转到指定页码
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    async handleSearch() {
      console.log("handleSearch triggered");

      // 重置标签栏和难度栏
      this.selectedTag = "";
      this.selectedDifficulty = "";
      this.showTags = false;
      this.showDifficulty = false;

      if (this.searchText.trim() === "") {
        // 如果搜索栏为空，显示全部题目
        this.problems = [...this.cachedProblems];
        this.currentPage = 1;
        return;
      }

      // 向后端发送请求，获取符合条件的题目
      try {
        const response = await fetch("http://127.0.0.1:5000/search_exercises", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ search_text: this.searchText.trim() }), // 确保格式为 {"search_text": "两数"}
        });

        // 检查响应状态
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
          console.error("Error fetching exercises:", data.error);
          this.problems = [];
        } else {
          this.problems = data.exercises || [];
        }
        this.currentPage = 1; // 重置当前页为第一页
      } catch (error) {
        console.error("Error fetching exercises:", error);
        this.problems = [];
      }
    },
  },

  // 处理搜索栏回车事件
  mounted() {
    this.fetchProblems();
    this.$refs.searchInput.focus();
    this.fetchTop5Concepts();
    this.fetchMatchedCNames();
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.black-box {
  width: 100%;
  background-color: #333;
  color: white;
  border-radius: 1vw;
  box-shadow: 0 0.5vw 1.25vw rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.top-section {
  padding: 2vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
}

.dropdown {
  position: relative;
  margin: 1vw;
}

.tags-button {
  padding: 0.6vw 1.2vw;
  background-color: #444;
  border-radius: 0.5vw;
  cursor: pointer;
  color: white;
  display: inline-block;
  width: 12vw;
}

.tags-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #444;
  color: white;
  border: 0.1vw solid #555;
  box-shadow: 0 0.5vw 1.25vw rgba(0, 0, 0, 0.5);
  border-radius: 1vw;
  width: 20vw;
  z-index: 1000;
  margin-top: 0.5vw;
  max-height: 25vw;
  overflow-y: auto;
}

.search-box {
  width: 80%;
  margin: 1vw auto;
  display: block;
  padding: 0.8vw;
  border: 0.1vw solid #ff6600;
  border-radius: 0.5vw;
  background-color: #555;
  color: white;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0.5vw 0.5vw;
}

.tag-item {
  background-color: #666;
  color: white;
  padding: 0.2vw 0.6vw;
  margin: 0.3vw;
  border-radius: 0.5vw;
  cursor: pointer;
  font-size: 0.8vw;
}

.tag-item:hover {
  background-color: #ff6600;
}

.section-title {
  font-size: 1vw;
  font-weight: bold;
  margin: 1vw 0 0.5vw 1vw;
  color: #ff6600;
}

/* 难度选择样式 */
.difficulty-dropdown {
  margin: 1vw;
  position: relative;
}

.difficulty-button {
  padding: 0.6vw 1.2vw;
  background-color: #444;
  border-radius: 0.5vw;
  cursor: pointer;
  color: white;
  display: inline-block;
  width: 12vw;
}

.difficulty-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #444; /* 深灰色背景 */
  color: white;
  border: 0.1vw solid #555;
  box-shadow: 0 0.5vw 1.25vw rgba(0, 0, 0, 0.5);
  border-radius: 1vw;
  width: 5vw;
  z-index: 1000;
  margin-top: 0.5vw;
  margin-left: 3vw;
}

.difficulty-option {
  padding: 1vw;
  cursor: pointer;
  background-color: #666;
  color: white;
}

.difficulty-option:hover {
  background-color: #ff6600;
}

.easy {
  color: #78b903;
}

.medium {
  color: #d9c846;
}

.hard {
  color: #d73a2f;
}

.all{
  color: #0f0f11;
}

/* 搜索栏样式 */
.search-section {
  display: flex;
  align-items: center;
  margin: 1vw;
}

.search-input {
  padding: 0.6vw 1vw;
  border: 0.1vw solid #ff6600;
  border-radius: 0.5vw;
  margin-left: 0.5vw;
  width: 15vw;
  background-color: #555;
  color: white;
}

/* 题目显示区域样式 */
.bottom-section {
  padding: 2vw;
  background-color: #444;
}

.problem-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1vw 0;
  border-bottom: 0.1vw solid #666;
}

.problem-left {
  display: flex;
  align-items: center;
}

.problem-number {
  color: white;
  font-size: 1vw;
  margin-right: 1vw;
}

.problem-text {
  color: white;
  text-decoration: none;
  font-size: 1.1vw;
}

.problem-text:hover {
  text-decoration: underline;
}

.problem-level {
  font-size: 1vw;
  font-weight: bold;
  margin-left: auto;
}

.easy {
  color: #78b903;
}

.medium {
  color: #d9c846;
}

.hard {
  color: #d73a2f;
}

.all {
  color: #eeeeee;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  padding: 1vw;
  overflow-x: auto;
  white-space: nowrap;
  border-top: 0.1vw solid #666;
}

.pagination button {
  margin: 0 0.2vw;
  padding: 0.5vw 1vw;
  background-color: #666;
  color: white;
  border: none;
  border-radius: 0.5vw;
  cursor: pointer;
  font-size: 1vw;
}

.pagination button.active {
  background-color: #333;
}

.pagination button:hover {
  background-color: #555;
}

.pagination span {
  margin: 0 0.2vw;
  padding: 0.5vw 1vw;
  color: white;
  font-size: 1vw;
}

.concept-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.concept-number {
  font-weight: bold;
  margin-right: 10px;
}

.concept-name {
  font-size: 16px;
}

.matched-cname-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1vw;
}

.matched-cname-item {
  display: inline-flex;
  align-items: center;
}

.matched-cname {
  background-color: #ff6600;
  color: white;
  padding: 0.1vw 1vw;
  border-radius: 0.5vw;
  cursor: pointer;
  font-size: 0.8vw;
  font-weight: bold;
  transition: background-color 0.3s ease;
}


</style>
