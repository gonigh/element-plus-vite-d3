<script lang="ts" setup>
import * as d3 from 'd3'
import { computed, onMounted, reactive, ref } from 'vue';

interface Info {
    name: string,
    value: number
}

const tableData: Info[] = reactive(
    [
        {
            name: 'Tom',
            value: 12
        },
        {
            name: 'Tony',
            value: 13
        },
        {
            name: 'Marry',
            value: 15
        },
        {
            name: 'Any',
            value: 8
        },
    ])
const svgWidth = 500;
const svgHeight = 400;
const contentWidth = 400;
const contentHeight = 300;

const state = reactive({
    position: 1,
    color: 'black'
})

onMounted(() => {
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')

    const gRect = svg.append('g')
        .attr('transform', 'translate(50,50)')
        .attr('width', contentWidth)
        .attr('height', contentHeight)
        .selectAll('rect')
        .data(tableData)
        .enter()
        .append('rect')

    const m = d3.max(tableData.map(t => t.value))

    if (state.position == 1) {
        const barScaleLiner = d3.scaleLinear()
            .domain([0, m ? m : 0])
            .range([contentHeight, 0]);

        const barScaleBand = d3.scaleBand()
            .domain(tableData.map(t => t.name))
            .range([0, contentWidth]);
        const yAxis = d3.axisLeft(barScaleLiner);
        const xAxis = d3.axisBottom(barScaleBand);
        svg.append('g').attr('transform', 'translate(50,50)').call(yAxis)
        svg.append('g').attr('transform', 'translate(50,350)').call(xAxis)

        const rectStep = contentWidth / tableData.length;

        gRect
            .attr('x', (d, i) => 10 + i * rectStep)
            .attr('y', d => barScaleLiner(d.value))
            .attr('width', rectStep - 20)
            .attr('height', d => barScaleLiner((m ? m : 0) - d.value))
            .attr('fill', state.color)


    } else if (state.position == 2) {
        const barScaleLiner = d3.scaleLinear()
            .domain([0, m ? m : 0])
            .range([0, contentWidth]);
        const barScaleBand = d3.scaleBand()
            .domain(tableData.map(t => t.name))
            .range([0, contentHeight]);
        const yAxis = d3.axisTop(barScaleLiner);
        const xAxis = d3.axisLeft(barScaleBand);
        svg.append('g').attr('transform', 'translate(50,0)').call(yAxis)
        svg.append('g').attr('transform', 'translate(0,50)').call(xAxis)

    }


})
</script>
<template>
    <div class="container">
        <div class="content">
            <div class="chart" id="chart">

            </div>
            <div class="option">

            </div>
        </div>
        <div class="footer">
            <el-table :data="tableData" height="250" style="width: 100%">
                <el-table-column type="index" width="50" />
                <el-table-column prop="name" label="Name" width="180" />
                <el-table-column prop="value" label="Value" />
            </el-table>
        </div>
    </div>
</template>
<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    padding: 10px;

    .content {
        display: flex;
        position: relative;

        .chart {
            width: 500px;
            height: 400px;
        }
    }

    .footer {
        position: relative;
    }
}
</style>