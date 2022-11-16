<script lang="ts" setup>
import * as d3 from 'd3'
import { select } from 'd3';
import { onMounted, reactive } from 'vue';

interface Point {
    x: number,
    y: number
}

const svgHeight = 300;
const svgWidth = 350;
const contentWidth = 300;
const contentHeight = 250;
const dotColor = 'var(--ep-menu-active-color)'
const state = reactive({
    curve2: [
        {
            x: 20,
            y: 20
        },
        {
            x: contentWidth - 20,
            y: 20
        },
        {
            x: contentWidth - 20,
            y: contentHeight - 20
        }],
    curve3: [
        {
            x: 20,
            y: 20
        },
        {
            x: contentWidth - 20,
            y: 20
        },
        {
            x: 20,
            y: contentHeight - 20
        },
        {
            x: contentWidth - 20,
            y: contentHeight - 20
        }]
})

function createCurve2(points: Point[]): void {
    const svg = d3.select('#curve2').append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr('fill', 'black');

    const title = svg.append('g')
        .attr('transform', `translate(${svgWidth / 2},20)`)
        .append('text')
        .attr('text-anchor', 'middle')
        .text('二次贝塞尔曲线')
        .attr('fill','var(--ep-menu-text-color)')

    const rect = svg.append('g')
        .attr('transform', 'translate(25,30)')
        .append('rect')
        .attr('width', contentWidth)
        .attr('height', contentHeight)
        .attr('stroke', 'var(--ep-menu-text-color)')
        .attr('fill', 'none')

    const line = svg.append('g')
        .attr('transform', 'translate(25,30)')
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', dotColor)
        .attr('stroke-width', 1)
        .attr('opacity', '.6')
    const curve = svg.append('g')
        .attr('transform', 'translate(25,30)')
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', dotColor)
        .attr('stroke-width', 3)
        .attr('opacity', '.6')
    const drawCurve = function (points: Point[]): void {
        const path1 = d3.path();
        path1.moveTo(points[0].x, points[0].y);
        path1.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y)
        curve.attr('d', path1.toString());

        const path2 = d3.line<Point>()
            .x(d => d.x)
            .y(d => d.y)
        line.datum(points)
            .attr('d', path2)
    }
    drawCurve(points);
    const dots = svg.append('g')
        .attr('transform', 'translate(25,30)')
        .selectAll('circle')
        .data(points)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 6)
        .attr('fill', dotColor)
        .attr('opacity', '.6')
        .attr('cursor', 'pointer')
        .on('mouseover', function (d) {
            select(this).attr('opacity', '1')
        })
        .on('mouseout', function (d) {
            select(this).attr('opacity', '.6')
        })

    const drag = d3.drag().on('drag', function (e, d) {
        let i = points.indexOf(d as Point);
        const dot = d3.select(this);
        if (e.x >= 0 && e.x <= contentWidth) {
            dot.attr('cx', e.x);
            points[i].x = e.x;
        }
        if (e.y >= 0 && e.y <= contentHeight) {
            dot.attr('cy', e.y);
            points[i].y = e.y;
        }
        drawCurve(points)
    })
    dots.call(drag)
}

function createCurve3(points: Point[]): void {
    const svg = d3.select('#curve3').append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)

    const title = svg.append('g')
        .attr('transform', `translate(${svgWidth / 2},20)`)
        .append('text')
        .attr('text-anchor', 'middle')
        .text('三次贝塞尔曲线')
        .attr('font-size',16)
        .attr('fill','var(--ep-menu-text-color)')

    const rect = svg.append('g')
        .attr('transform', 'translate(25,30)')
        .append('rect')
        .attr('width', contentWidth)
        .attr('height', contentHeight)
        .attr('stroke', 'var(--ep-menu-text-color)')
        .attr('fill', 'none')

    const line = svg.append('g')
        .attr('transform', 'translate(25,30)')
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', dotColor)
        .attr('stroke-width', 1)
        .attr('opacity', '.6')
    const curve = svg.append('g')
        .attr('transform', 'translate(25,30)')
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', dotColor)
        .attr('stroke-width', 3)
        .attr('opacity', '.6')
    const drawCurve = function (points: Point[]): void {
        const path1 = d3.path();
        path1.moveTo(points[0].x, points[0].y);
        path1.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y,points[3].x,points[3].y)
        curve.attr('d', path1.toString());

        const path2 = d3.line<Point>()
            .x(d => d.x)
            .y(d => d.y)
        line.datum(points)
            .attr('d', path2)
    }
    drawCurve(points);
    const dots = svg.append('g')
        .attr('transform', 'translate(25,30)')
        .selectAll('circle')
        .data(points)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 6)
        .attr('fill', dotColor)
        .attr('opacity', '.6')
        .attr('cursor', 'pointer')
        .on('mouseover', function (d) {
            select(this).attr('opacity', '1')
        })
        .on('mouseout', function (d) {
            select(this).attr('opacity', '.6')
        })

    const drag = d3.drag().on('drag', function (e, d) {
        let i = points.indexOf(d as Point);
        const dot = d3.select(this);
        if (e.x >= 0 && e.x <= contentWidth) {
            dot.attr('cx', e.x);
            points[i].x = e.x;
        }
        if (e.y >= 0 && e.y <= contentHeight) {
            dot.attr('cy', e.y);
            points[i].y = e.y;
        }
        drawCurve(points)
    })
    dots.call(drag)
}
onMounted(() => {
    createCurve2(state.curve2);
    createCurve3(state.curve3);
})
</script>
<template>
    <div class="curve-container">
        <div class="curve" id="curve2"></div>
        <div class="curve" id="curve3"></div>
    </div>
</template>

<style scoped lang="scss">
.curve-container {
    margin: 10px;
    display: flex;
}
text{
    color: var(--ep-menu-text-color)
}
.cursor{
    margin: 10px;
}
</style>