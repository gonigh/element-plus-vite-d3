<script lang="ts" setup>
import * as d3 from 'd3';
import { onMounted, reactive } from 'vue';

const state = reactive({
    color: ['green', 'yellow', 'red'],
    symbol: ['巨出', '大出', '小出', '小入', '大入', '巨入'],
    value: 3
})

const lineWidth = 4;
const r = 12
const width = 400;

onMounted(() => {
    const svg = d3.select('#seg').append('svg')
        .attr('width', 400)
        .attr('height', 200)
        .attr('fill', '#aaa')
    const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'gradient')
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");
    gradient.selectAll('stop')
        .data(state.color)
        .enter()
        .append('stop')
        .attr('offset', (d, i) => (i * 100 / (state.color.length - 1)).toFixed(0) + '%')
        .attr('stop-color', (d, i) => state.color[i])

    /**
     * 获取圆的位置函数
     * @param value 第几个圆，从1开始
     */
    const getCenterX = function (value: number) {
        return value * (width - r) / state.symbol.length
    }

    /**
     * 创建剪切图像
     * @param value 圆的数量
     * @param clipPath 要操作的clipPath对象
     */
    const createSharp = function (value: number, clipPath: d3.Selection<SVGClipPathElement, unknown, HTMLElement, any>) {

        // 剪切一条线
        clipPath.append('rect')
            .attr('x', 0)
            .attr('y', r - lineWidth / 2)
            .attr('width', getCenterX(value))
            .attr('height', lineWidth)
            .attr('ry', lineWidth / 2)
            .attr("fill", "white")

        // 剪切多个圆
        clipPath.selectAll('circle')
            .data(new Array(value))
            .enter()
            .append('circle')
            .attr('cx', (d, i) => getCenterX(i + 1))
            .attr('cy', r)
            .attr('r', r)
    }

    // 剪切背景图形
    const sharpBack = svg.select('defs')
        .append('clipPath')
        .attr('id', 'sharpBack');
    createSharp(state.symbol.length, sharpBack);

    // 添加灰色矩形背景
    svg.append('rect')
        .attr('height', r * 2)
        .attr('width', width)
        .attr('clip-path', 'url(#sharpBack)')

    // 剪切彩色图形
    const sharpValue = svg.select('defs')
        .append('clipPath')
        .attr('id', 'sharpValue');
    createSharp(state.value, sharpValue);

    // 添加彩色填充值
    svg.append('rect')
        .attr('height', r * 2)
        .attr('width', width)
        .attr('fill', 'url(#gradient)')
        .attr('clip-path', 'url(#sharpValue)')

    // 添加下标文字
    svg.append('g')
        .selectAll('text')
        .data(state.symbol)
        .enter()
        .append('text')
        .text((d, i) => d)
        .attr('x', (d, i) => getCenterX(i + 1))
        .attr('y', r * 3)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', 12)
        .attr('opacity', (d, i) => i + 1 == state.value ? 1 : .6)

})
</script>
<template>
    <div id="seg"></div>
</template>

<style scoped>
#seg {
    width: 400px;
    height: 400px;
    background-color: #222;
}
</style>