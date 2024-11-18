<template>
  <div style="width: 100%;height: 100%;">
    <MdPreview :editorId="id" :modelValue="markdownContent" theme="dark" preview-theme="github"/>
  </div>
</template>
<script setup lang="ts">
import {  ref } from 'vue';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
const id = 'preview-only';
const markdownContent = ref('在计算机科学中，复杂度通常用来描述算法在执行过程中的效率和性能，主要分为时间复杂度和空间复杂度。\n\n### 时间复杂度\n\n**时间复杂度**是指一个算法在输入规模为$n$的情况下，所需执行的基本操作次数。常用符号表示时间复杂度的增长率，例如$O(n)$，$O(\\log n)$，以及$O(n^2)$等等，这些符号都表示的是**渐进上界**。也就是说，当$n$足够大时，算法的运行时间不会超过这个渐进上界。\n\n- **常数时间复杂度**：$O(1)$，算法运行时间不随输入规模的增大而增大，例如数组的访问。\n- **对数时间复杂度**：$O(\\log n)$，典型的例子是二分查找。\n- **线性时间复杂度**：$O(n)$，例如一次遍历一个长度为$n$的列表。\n- **线性对数时间复杂度**：$O(n \\log n)$，常见于高效排序算法，如归并排序、快速排序。\n- **平方时间复杂度**：$O(n^2)$，常见于简单排序算法，如插入排序、选择排序。\n- 更高的时间复杂度还有$O(n^3)$、$O(2^n)$等等。\n\n### 空间复杂度\n\n**空间复杂度**描述了算法在运行过程中所需的存储空间大小。类似于时间复杂度，空间复杂度也用$O$符号表示。一个算法的空间复杂度通常由两个部分组成：\n\n1. 固定部分：该部分与输入规模无关，例如用于存储程序代码、常量以及简单变量的空间。\n2. 可变部分：该部分与输入规模相关，例如用于动态分配的数组、对象等数据结构的空间。\n\n评估一个算法时，通常需要权衡时间复杂度和空间复杂度。一些问题可以通过增加空间消耗来减少时间消耗，反之亦然。这种权衡通常称为“时间-空间权衡”（Time-Space Trade-off）。\n\n下面是一个简单的例子来说明时间复杂度：\n\n```c\nint sum(int n) {\n    int result = 0;\n    for (int i = 1; i <= n; i++) {\n        result += i;\n    }\n    return result;\n}\n```\n\n对于上述计算从$1$到$n$的和的算法，其时间复杂度为$O(n)$，因为主要操作是一个对$n$规模线性的循环。\n\n总之，复杂度分析是理解算法效率的基础，它帮助我们在设计和选择算法时作出明智的决策。');
</script>
<style lang="css" scoped>
</style>