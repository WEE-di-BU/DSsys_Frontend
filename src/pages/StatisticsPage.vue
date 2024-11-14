<template>
    <div>
        <div class="search">
            <div class="search-main">
                <el-input placeholder="Search Algo and DS">
                    <template #append>
                        <el-button>Search</el-button>
                    </template>
                </el-input>
            </div>
        </div>
        <div class="ub-outer">
            <div class="left">
                <div class="selection" @click="changeToAlgos">ALGO</div>
                <div class="selection" @click="changeToDS">DS</div>
            </div>
            <div id="ub" class="charts">
    
            </div>
        </div>
        <div class="bottom">
            <div class="mid">
                <h2 style="font-weight: lighter;">与你类似的同学都在看</h2>
            </div>
            <div class="contents-card">
                <el-card class="card" v-for="item in recommendlist" :key="item" shadow="hover" @click="addClick(item)">
                    <div class="upper">
                        <div class="title">
    
                        </div>
                    </div>
                    {{ item }}
                </el-card>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as echarts from "echarts";
import axios from 'axios';
let dsConcepts = [{}]
const recommendlist = ref([])
onMounted(async () => {
    await getAlgorithims();  
    const ubchart = document.getElementById("ub")
    if (ubchart) {
        ubchart.removeAttribute('_echarts_instance_');
    }
    await initChart1()
    await getRecommend()
})
const getDatastructures = async () => {
    await axios.get('http://127.0.0.1:5000/api/ds').then((resp) => {
        dsConcepts = resp.data
        console.log(dsConcepts)
    })
}

const getAlgorithims = async()=>{
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
                    repulsion: 150,
                    edgeLength: [100, 80]
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


const getRecommend = async()=>{
    await axios.get('http://127.0.0.1:5000/api/recommends',{
        params:{
            id:1
        }
    }).then((resp)=>{
        recommendlist.value=resp.data
        console.log(resp.data)
    })
}
const addClick = async(item:string)=>{
    console.log(item)
    await axios.post('http://127.0.0.1:5000/api/addclick',{id:1,concept:item}).then((resp)=>{
        console.log(resp.data)
    })
}

const changeToAlgos = async()=>{
    await getAlgorithims()
    await initChart1()
}

const changeToDS = async()=>{
    await getDatastructures()
    await initChart1()
}
</script>

<style scoped>
.ub-outer{
    display: flex;
    align-items: center;
    width: 100%;
    height: 30em;
    background-color: #2a2a2a;
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

.bottom{
    background-color: #1a1a1a;
}

.mid{
    width: 100%;
    height: 5em;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
}

.left{
    position: absolute;
    left: 0;
    height: 100%;
    width: 8em;
    z-index: 1
}

.selection{
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
}

.selection:hover{
    background-color: #1a1a1a;
    transition: 0.25s;
}
</style>