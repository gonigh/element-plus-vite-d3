<script lang="ts" setup>
import * as d3 from 'd3'
import { onMounted } from 'vue';
import { Circle } from './Circle';

const circleList: Circle[] = [];
const render = () => {
    circleList.forEach(item => item.update());
    requestAnimationFrame(render);
}

onMounted(() => {
    console.log(window);
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
        let r = 10

        let circleElement = g.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', r)
            .attr('fill', 'block');
        let circle = new Circle(x, y, r, circleElement, width, height);
        if (circleList.length > 10) {
            circleList[0].el.remove();
            circleList.shift();
        }
        circleList.push(circle);
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