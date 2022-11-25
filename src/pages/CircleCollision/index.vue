<script lang="ts" setup>
import * as d3 from 'd3'
import { onMounted } from 'vue';
import { Circle } from './Circle';

const render = () => {
    Circle.list.forEach(item => item.update());
    requestAnimationFrame(render);
}

Circle.list = new Array<Circle>();

const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(new Array(10).fill(0).map((item,i)=>i.toString()));

onMounted(() => {
    const container = document.getElementById('circle-collision-container');
    const width: number = <number>container?.offsetWidth;
    const height: number = <number>container?.offsetHeight;
    const svg = d3.select('#circle-collision-container')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
    const g = svg.append('g')
    svg.on('click', (e) => {
        let x = e.offsetX;
        let y = e.offsetY;

        let circleElement = g.append('g')
            .attr('transform', `translate(${x},${y})`)

        let circle = new Circle(x, y, colorScale((Math.random()*10).toFixed(0)), circleElement, width, height);

    })
    render();

})
</script>
<template>
    <div id="circle-collision-container" class="container"></div>
</template>

<style scoped>
#circle-collision-container {
    height: 100%;
    width: 100%;
}
</style>