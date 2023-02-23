<script>
import * as d3 from "d3"

export default {
    data() {
        return {
            length: 100,
            obj: {
                a: new Array(100).fill(0).map((item, i) => 0.7 * Math.random()),
                b: new Array(100).fill(0).map((item, i) => 0.3 * Math.random() + 0.2),
                c: new Array(100).fill(0).map((item, i) => Math.random()),
            },
            width: 600,
            height: 400,
            padding: 20,    // 预留20边界
        }
    },
    mounted() {
        const svg = d3.select('#parallel-coordinate-axis')
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);
        this.drawGrid(svg)
        this.drawAxis(svg)
        this.drawLines(svg);
    },
    methods: {
        
        // 获取边界值
        getBoundary(obj) {
            let max = -Number.MAX_VALUE;
            let min = Number.MAX_VALUE;
            for (let i in obj) {
                max = Math.max(...obj[i], max);
                min = Math.min(...obj[i], min);
            }
            return [min, max];
        },

        // 整理数据，输出为可以被d3.line使用的数据
        getLineData(obj) {
            let lineData = new Array(this.length).fill(0).map((t, i) => {
                let line = [];

                for (let keyIndex in Object.keys(obj)) {
                    let key = Object.keys(obj)[keyIndex];
                    line.push([parseInt(keyIndex), obj[key][i]]);
                }
                return line;
            })
            return lineData;
        },

        // 绘制网格
        drawGrid(svg) {
            const g = svg.append('g').attr('transform', `translate(${this.padding},${this.padding})`);
            const gridWidth = this.width - this.padding * 2;
            const gridHeight = this.height - this.padding * 2;
            g.selectAll('.vertical-ine')
                .data(Object.keys(this.obj))
                .enter()
                .append('line')
                .attr('class', 'vertical-line')
                .attr('x1', (d, i) => gridWidth / 6 + i * gridWidth / 3)
                .attr('y1', 0)
                .attr('x2', (d, i) => gridWidth / 6 + i * gridWidth / 3)
                .attr('y2', gridHeight)
                .attr('stroke', 'rgba(0,0,0,0.4)')
                .attr("stroke-width", "1px");

            const heightInc = gridHeight * 0.18;
            g.selectAll('.horizontal-ine')
                .data(new Array(6))
                .enter()
                .append('line')
                .attr('class', 'horizontal-line')
                .attr('x1', 0)
                .attr('y1', (d, i) => gridHeight * 0.05 + i * heightInc)
                .attr('x2', gridWidth)
                .attr('y2', (d, i) => gridHeight * 0.05 + i * heightInc)
                .attr('stroke', 'rgba(0,0,0,0.4)')
                .attr("stroke-width", "1px");
        },

        // 绘制维度名称
        drawAxis(svg) {
            const g = svg.append('g').attr('transform', `translate(${this.padding},${this.height - this.padding})`);
            const gridWidth = this.width - this.padding * 2;
            g.selectAll('.axis-title')
                .data(Object.keys(this.obj))
                .enter()
                .append('text')
                .attr('class', 'axis-title')
                .text((d) => d)
                .attr('text-anchor', 'middle')
                .attr('x', (d, i) => gridWidth / 6 + i * gridWidth / 3)
                .attr('y', '16px');
        },

        // 绘制折线
        drawLines(svg) {
            const g = svg.append('g').attr('transform', `translate(${this.padding},${this.padding})`);
            const gridWidth = this.width - this.padding * 2;
            const gridHeight = this.height - this.padding * 2;
            const [min, max] = this.getBoundary(this.obj);

            const scaleX = x => gridWidth / 6 + x * gridWidth / 3
            const scaleY = d3.scaleLinear()
                .domain([min, max])
                .range([gridHeight * 0.95, gridHeight * 0.05]);

            const lineData = this.getLineData(this.obj);
            const line = d3.line()
                .x(d => scaleX(d[0]))
                .y(d => scaleY(d[1]))

            // 画线
            g.selectAll('path')
                .data(lineData)
                .enter()
                .append('path')
                .attr('d', d => line(d))
                .attr('fill', 'none')
                .attr('stroke-width', 1)
                .attr('stroke', 'green');

            const dotData = [];
            lineData.forEach(item => {
                item.forEach(dot => dotData.push(dot))
            });
            console.log(dotData)
            // 画点
            g.selectAll('circle')
                .data(dotData)
                .enter()
                .append('circle')
                .attr('r', '2px')
                .attr('cx', d => scaleX(d[0]))
                .attr('cy', d => scaleY(d[1]))
                .attr('fill', 'green')
        }

    }
}

</script>
<template>
    <div id="parallel-coordinate-axis"></div>
</template>