<template>
    <div>
        <div class="search">
            <div class="search-main">
                <el-autocomplete v-model="searchText" :fetch-suggestions="fetchSuggestions"
                    placeholder="Search Algorithm and DataStructure">
                    <template #append>
                        <el-button @click="addClick(searchText)">Search</el-button>
                    </template>
                </el-autocomplete>
            </div>
        </div>
        <div class="ub-outer">
            <div class="left">
                <div class="selection" @click="changeToAlgos">ALGORITHM</div>
                <div class="selection" @click="changeToDS">DATASTRUCTURE</div>
            </div>
            <div id="ub" class="charts"></div>
        </div>
        <div class="bottom">
            <div class="mid">
                <h3 style="font-weight: 500;">与你类似的同学都在看</h3>
            </div>
            <div class="contents-card">
                <el-card class="card" v-for="item in recommendlist" :key="item.name" shadow="hover"
                    @click="addClick(item.name)">
                    <div style="width: 100%;height: 100%; display: flex;">
                        <div class="c-left">
                            <img src="">
                        </div>
                        <div class="c-right">
                            <div class="title">
                                <h3 style="font-weight: 800; margin-bottom: 1em">{{ item.name }}</h3>
                            </div>
                            <div class="desc">
                                {{ item.desc }}
                            </div>
                        </div>
                    </div>
                </el-card>
            </div>
            <div class="rec-execise">
                <h3 style="font-weight: 500;margin-bottom: 2vw"> 推荐练习 </h3>
                <div>
                  <LeetcodePage />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as echarts from "echarts";
import axios from 'axios';
import { useRouter } from 'vue-router';
import LeetcodePage from "@/pages/detail/LeetcodePage.vue";

let dsConcepts = [{}]
const recommendlist = ref([])
const searchText = ref('')
const all_concepts = ref([])
const inv = new Map()
const router = useRouter()

onMounted(async () => {
    await getAlgorithims();
    const ubchart = document.getElementById("ub")
    if (ubchart) {
        ubchart.removeAttribute('_echarts_instance_');
    }
    await initChart1()
    await getRecommend()
    await getAllConcepts()
})
const getDatastructures = async () => {
    await axios.get('http://127.0.0.1:5000/api/ds').then((resp) => {
        dsConcepts = resp.data
        console.log(dsConcepts)
    })
}

const getAlgorithims = async () => {
    await axios.get('http://127.0.0.1:5000/api/algos').then((resp) => {
        dsConcepts = resp.data
        console.log(dsConcepts)
    })
}

async function initChart1() {
    const chart = echarts.init(document.getElementById("ub"), "light");
    // 动态生成不同的颜色和大小
    const getNodeStyle = (index) => {
        // 这里可以根据节点索引或数据值来设定不同的大小和颜色
        const colorList = ['#FF4081', '#00BCD4', '#FFEB3B', '#8BC34A', '#FF5722', '#9C27B0', '#FF9800'];
        const sizeList = [30, 40, 50, 60];

        return {
            itemStyle: {
                color: colorList[index % colorList.length],  // 循环使用颜色
                shadowBlur: 10,
                shadowColor: '#282828'
            },
            symbolSize: sizeList[index % sizeList.length]  // 循环使用大小
        };
    };

    chart.setOption({
        xAxis: {
            show: false
        },
        tooltip: {
            show: true
        },
        yAxis: {
            show: false
        },
        series: [
            {
                type: "graph",
                focusNodeAdjacency: true,
                force: {
                    repulsion: 100, // 调小斥力，减少扩散范围
                    gravity: 0.1,   // 增加引力，使节点更紧凑
                    edgeLength: [50, 100] // 调整边的长度范围
                },
                layout: "force",
                symbol: 'circle',
                normal: {
                    lineStyle: {
                        color: '#fff',
                        width: 1,
                        type: 'solid',
                        opacity: 0.5,
                        curveness: 0.5
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: "inside", // 标签位置
                        textStyle: {
                            fontSize: 10,
                            color: 'white'
                        }
                    }
                },
                edgeLabel: {
                    normal: {
                        show: true,
                        textStyle: {
                            fontSize: 14
                        },
                        formatter: function (param) {
                            return param.data.category;
                        }
                    }
                },
                data: dsConcepts.map((item, index) => {
                    const nodeStyle = getNodeStyle(index);  // 获取每个节点的样式
                    return {
                        ...item,  // 保留原数据
                        ...nodeStyle,
                        label: {
                            show: true,
                            formatter: function () {
                                return item || "-";  // 确保显示 name 字段
                            }
                        }// 合并样式
                    };
                })
            }
        ]
    });

    window.onresize = function () {
        chart.resize();
    };
}

const id_ = JSON.parse(sessionStorage.getItem('access_token')).id;

const getRecommend = async () => {
    await axios.get('http://127.0.0.1:5000/api/recommends', {
        params: {
            id: id_
        }
    }).then((resp) => {
        recommendlist.value = resp.data
        console.log(resp.data)
    })
}

const addClick = async (item: string) => {
    console.log(item)
    await axios.post('http://127.0.0.1:5000/api/addclick', { id: id_, concept: item }).then((resp) => {
        console.log(resp.data)
    })
    await getConcept(item)
}

const changeToAlgos = async () => {
    await getAlgorithims()
    await initChart1()
}

const changeToDS = async () => {
    await getDatastructures()
    await initChart1()
}

const fetchSuggestions = (query, callback) => {
    const suggestions = all_concepts.value;
    const results = query
        ? suggestions.filter((item) => item.value.includes(query))
        : [];
    callback(results);
}

const getConcept = async (searchText) => {
    const corrId = inv.get(searchText)
    console.log(corrId)
    router.push({ name: 'detail', params: { id: corrId } });
};

const getAllConcepts = async()=>{
    await axios.get('http://127.0.0.1:5000/api/concepts').then((resp)=>{
        all_concepts.value = resp.data
        all_concepts.value.forEach((item)=>{
            // console.log(name,id)
            inv.set(item.value,item.id)
        })
        console.log(all_concepts.value)
        console.log(inv)
    })
}
</script>

<style scoped>
.ub-outer {
    display: flex;
    align-items: center;
    width: 100%;
    height: 30em;
    background: radial-gradient(circle, #ff7e5f, #feb47b);
    /* background-color: #2a2a2a; */
    position: relative;
}

.charts {
    width: 100%;
    height: 25em;
}

.contents-card {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    padding: 0 2em;
    padding-bottom: 1em;
}

.card {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 33.3%;
    height: 12em;
    border-radius: 4px;
    margin: 0 1em;
    background-color: #282828;
    border: none;
    color: white;
}

.card:hover {
    scale: 1.05;
    transition: 0.25s;
}

.search {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #2a2a2a;
    height: 4em;
}

.search-main {
    width: 30%;
    background-color: transparent;
    height: 70%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.bottom {
    background-color: #1a1a1a;
}

.mid {
    width: 100%;
    height: 5em;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: white;
    box-sizing: border-box;
    padding-left: 3em;
    font-size: 1em;
}

.left {
    position: absolute;
    top: 0;
    width: 100%;
    height: 10%;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.selection {
    width: 14em;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    border-radius: 3em;
}

.selection:hover {
    background-color: #feb47b;
    transition: 0.25s;
}

.rec-execise {
    color: white;
    box-sizing: border-box;
    padding: 0 3em;
}

.desc {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    /* 限制为两行 */
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
}

/* .c-left {
    width: 3em;
} */

:deep(.el-input-group__append:hover) {
    color: #ff7e5f;
    transition: 0.25s;
}
</style>
