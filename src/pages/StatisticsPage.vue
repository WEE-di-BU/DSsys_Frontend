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
        <div id="ub" class="charts">

        </div>
        <div class="contents-card">
            <el-card class="card" v-for="item in cardsInfo" :key="item.name" shadow="hover">
                <div class="upper">
                    <div class="title">

                    </div>
                </div>
                {{ item.name }}
            </el-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as echarts from "echarts";
import axios from 'axios';
let dsConcepts = [{}]
const cardsInfo = ref([
    {
        name: '123'
    },
    {
        name: '123'
    },
    {
        name: '1423'
    }
])
onMounted(async () => {
    const ubchart = document.getElementById("ub")
    if (ubchart) {
        ubchart.removeAttribute('_echarts_instance_');
    }
    await initChart1()
})
const getDatastructures = async () => {
    await axios.get('http://127.0.0.1:5000/api/algos').then((resp) => {
        dsConcepts = resp.data
        console.log(dsConcepts)
    })
}
async function initChart1() {
    await getDatastructures()
    const chart = echarts.init(document.getElementById("ub"), "light");
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
                    repulsion: 200,
                    edgeLength: [120, 100]
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
                        // 标签位置:'top''left''right''bottom''inside''insideLeft''insideRight''insideTop''insideBottom''insideTopLeft''insideBottomLeft''insideTopRight''insideBottomRight'
                        position: "inside",
                        // 文本样式
                        textStyle: {
                            fontSize: 16,
                            color: 'white'
                        }
                    }
                },
                // 连接两个关系对象的线上的标签
                edgeLabel: {
                    normal: {
                        show: true,
                        textStyle: {
                            // fontSize: 14
                        },
                        // 标签内容
                        formatter: function (param) {
                            return param.data.category;
                        }
                    }
                },
                data: dsConcepts,
                // 节点分类的类目，可选。如果节点有分类的话可以通过 data[i].category 指定每个节点的类目，类目的样式会被应用到节点样式上。图例也可以基于categories名字展现和筛选。
                categories: [{
                    // 类目名称，用于和 legend 对应以及格式化 tooltip 的内容。
                    name: "企业分析"
                }, {
                    name: "入驻"
                }, {
                    name: "培育"
                }, {
                    name: "申报"
                }, {
                    name: "产教融合"
                }],
                // 节点间的关系数据
                links: [{
                    target: "",
                    source: "总企业",
                    // 关系对象连接线上的标签内容
                    category: "入驻"
                }, {
                    target: "企业2",
                    source: "总企业",
                    category: "培育"
                }, {
                    target: "企业3",
                    source: "总企业",
                    category: "申报"
                }, {
                    target: "企业4",
                    source: "总企业",
                    category: "产教融合"
                }]
            }
        ]
    });
    window.onresize = function () {
        chart.resize();
    };
}
</script>

<style scoped>
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
    border: 1px solid black;
    height: 15em;
    border-radius: 4px;
    margin: 0 1em;
}

.card:hover {
    scale: 1.05;
    transition: 0.25s;
}

.search {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
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
</style>