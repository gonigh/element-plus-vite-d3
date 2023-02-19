<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import * as d3 from 'd3'

const state = reactive<{
    startValue: number,
    endValue: number,
    color: string[],
    value: number
}>({
    startValue: 0,
    endValue: 180,
    color: ['red', 'yellow', 'green'],
    value: 180
});

const startAngle = -Math.PI * 2 / 3;
const endAngle = Math.PI * 2 / 3;
const width = 400;
const height = 400;
const radius = 180;

let fillColor;
// 定义比例尺
const colorRate = d3.scaleLinear()
    .domain(state.color.map((d, i) => {
        // 把每个颜色在数值范围内均匀分布
        let diff = state.endValue - state.startValue;
        let rate = i * diff / (state.color.length - 1);
        return state.startValue + rate as number;
    }))
    .range(state.color);
// 数值-弧度转换比例尺
const radianScale = d3.scaleLinear()
    .domain([state.startValue, state.endValue])
    .range([startAngle, endAngle]);

// 数值-角度转换比例尺
const angleScale = d3.scaleLinear()
    .domain([state.startValue, state.endValue])
    .range([startAngle / Math.PI * 180, endAngle / Math.PI * 180]);

// 绘制外圈圆弧
const createOutArc = function (svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>) {
    const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);
    // 创建外圈圆弧生成器
    const outArc = d3.arc()
        .innerRadius(radius - 2)
        .outerRadius(radius)
        .startAngle(startAngle)
        .endAngle(endAngle)
    g.append('path')
        .attr('d', outArc)
        .attr('fill', 'url(#gradient)')
}

const createInnerArc = function (svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>) {
    const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    // 内圆弧路径
    const innerArc = d3.arc()
        .innerRadius(radius - 16)
        .outerRadius(radius)
        .startAngle(startAngle)

    // 创建展示部分的剪切路径
    svg.select('defs').append('clipPath')
        .attr('id', 'innerArcClip')
        .append('path')
        .attr('d', innerArc.endAngle(radianScale(state.value)))

    g.append('path')
        .attr('d', innerArc.endAngle(endAngle))
        .attr('fill', 'url(#gradient)')
        .attr('clip-path', 'url(#innerArcClip)')

}

// 绘制指针
const createNeeder = function (svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>) {
    const g = svg.append('g')

    const currentColor = colorRate(state.value);

    const r = 20
    // 绘制圆环
    const outArc = d3.arc()
        .innerRadius(r)
        .outerRadius(r + 2)
        .startAngle(0)
        .endAngle(Math.PI * 2);
    g.append('path')
        .attr('d', outArc)
        .attr('fill', currentColor)

    /**
     * 指针可以用一个等腰三角形除去圆形部分得到,
     * 定义三角形高为h，底边长为2*w，以圆心为坐标原点可
     * 得，其中一条斜线方程为：y = (h*x/w) + h;
     * 而且已知圆形方程为：x*x + y*y = r*r;
     * 联立两个方程后得到一个如a*x*x+b*x+c=0形式的一元二次方程式，
     * 根据计算公式x = (-b +- sqrt(b*b-4*a*c))/(2*a);
     * 可得交点坐标。
     * 如下函数即为计算交点坐标。
     */
    const getIntersection = function (h: number, w: number, r: number) {
        // 三角形高必须大于圆半径，而底边的一半必须小于半径
        if (h <= r || w >= r) return { x: 0, y: 0 };
        // 根据计算公式得出参数
        let a = 1 + (h * h) / (w * w);
        let b = 2 * h * h / w;
        let c = h * h - r * r;
        let x1 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
        let x2 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);

        // 直线与圆有两个交点，我们需要较小的绝对值，
        let x = Math.min(Math.abs(x1), Math.abs(x2));

        // 根据直线方程得出y
        let y = -(h * x / w) + h;
        return { x: x, y: y };
    }

    const h = 120;
    const w = 4;
    const point: { x: number, y: number } = getIntersection(h, w, r);
    const points = [
        [point?.x, -point?.y],
        [0, -h],
        [-point?.x, -point?.y],
    ]
    // 绘制三角形
    g.selectAll('#trangle')
        .data([points])
        .enter()
        .append('path')
        .attr('d', d3.line())
        .attr('stroke', currentColor)
        .attr('fill', currentColor);

    // 旋转角度，弧度和角度需要转换
    let rotate = angleScale(state.value);
    console.log(rotate);
    g.attr('transform', `translate(${width / 2},${height / 2}) rotate(${rotate})`)

    // 添加中间文字
    svg.append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .append('text')
        .text('稳')
        .attr('dy', 5)
        .attr('text-anchor', 'middle')
        .attr('fill', currentColor)
}

// 绘制刻度
const createScale = function (svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>) {
    const g = svg.append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

    const valueInc = (state.endValue - state.startValue) / 30;
    g.selectAll('rect')
        .data(new Array(31))
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', (d, i) => i % 5 == 0 ? -2 : -1)
        .attr('width', (d, i) => i % 5 == 0 ? 20 : 10)
        .attr('height', (d, i) => i % 5 == 0 ? 4 : 2)
        .attr('fill', (d, i) => colorRate(i * valueInc))
        .attr('transform', (d, i) => `rotate(${angleScale(i * valueInc) - 90}) translate(${radius - (i % 5 == 0 ? 20 : 10)},0)`)

    const scaleInc = (state.endValue - state.startValue) / 6;
    g.selectAll('text')
        .data(new Array(7))
        .enter()
        .append('text')
        .text((d, i) => i * scaleInc)
        .attr('text-anchor', 'middle')
        .attr('transform', (d, i) => `rotate(${angleScale(i * scaleInc) - 90}) translate(${radius + 4},0) rotate(90)`)
}

onMounted(() => {
    // 定义SVG容器
    const svg = d3.select("#dashboard")
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // 创建渐进色
    fillColor = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'gradient')
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

    fillColor.selectAll('stop')
        .data(state.color)
        .enter()
        .append('stop')
        .attr('offset', (d, i) => (100 * i / (state.color.length - 1)).toFixed(0) + '%')
        .attr('stop-color', (d) => d);

    createOutArc(svg);
    createNeeder(svg);
    createScale(svg);
    createInnerArc(svg);

})
</script>
<template>
    <div class="dashboard-container" id="dashboard"></div>
</template>

<style scoped>
.dashboard-container {
    width: 400px;
    height: 400px;
    border: 1px solid black;
}
</style>