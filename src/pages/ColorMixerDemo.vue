<script lang="ts" setup>
import { onBeforeUnmount, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import * as d3 from 'd3'
const color = reactive([155,52,125,.8])
const state = reactive({
    Max: [0, 0, 0],
    xIndex: 0,
    x: 0,
    y: 0,
    z: color[3]
});
watch(state, (value) => {
    const topText = d3.select('#color-text');
    const topColorShow = d3.select('#color-show');

    color[3] = parseFloat(value.z.toFixed(2));
    console.log(value.z, color[3]);
    switch (value.xIndex) {
        case 0: {
            color[0] = Math.floor(value.Max[0] * value.x);
            color[1] = Math.floor(value.Max[1] * value.y);
            color[2] = Math.floor(value.Max[2] * value.y);
            break;
        }
        case 1: {

            color[0] = Math.floor(value.Max[0] * value.y);
            color[1] = Math.floor(value.Max[1] * value.x);
            color[2] = Math.floor(value.Max[2] * value.y);
            break;
        }
        case 2: {
            color[0] = Math.floor(value.Max[0] * value.y);
            color[1] = Math.floor(value.Max[1] * value.y);
            color[2] = Math.floor(value.Max[2] * value.x);
            break;
        }
    }

    if (color[3] == 1) {
        topText.text(`rgb(${color[0]},${color[1]},${color[2]})`)
    }
    else {
        topText.text(`rgba(${color[0]},${color[1]},${color[2]},${color[3]})`)
    }
    topColorShow.attr('fill', `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`)
})

const paddingGap = 10;
const spaceWidth = 5;
const contentWidth = 300;
const contentHeight = 250;
const topWidth = contentWidth;
const topHeight = contentHeight * 0.1;
const mainWidth = contentWidth * 0.7;
const mainHeight = contentHeight * 0.9;
const asideWidth = contentWidth * 0.15;
const asideHeight = contentHeight * 0.9;

// 调色板原点在右下角
let tr = color[0], tg = color[1], tb = color[2];
if (Math.min(tr, tg, tb) == tr) {
    state.xIndex = 0;
    state.Max[0] = 255;
    if (tg >= tb) {
        state.Max[1] = 255;
        state.Max[2] = (255 / tg) * tb;
    } else {
        state.Max[1] = (255 / tb) * tg;
        state.Max[2] = 255;
    }
    state.x = color[0] / 255;
    state.y = color[2] / state.Max[2];
} else if (Math.min(tr, tg, tb) == tg) {
    state.xIndex = 1;
    state.Max[1] = 255;
    if (tr >= tb) {
        state.Max[0] = 255;
        state.Max[2] = (255 / tr) * tb;
    } else {
        state.Max[0] = (255 / tb) * tr;
        state.Max[2] = 255;
    }
    state.x = color[1] / 255;
    state.y = color[2] / state.Max[2];
} else if (Math.min(tr, tg, tb) == tb) {
    state.xIndex = 2;
    state.Max[2] = 255;
    if (tr >= tg) {
        state.Max[0] = 255;
        state.Max[1] = (255 / tr) * tg;
    } else {
        // state.Max = [(255 / tg) * tr, 255, 0];
        state.Max[0] = (255 / tg) * tr;
        state.Max[1] = 255;
    }
    state.x = color[2] / 255;
    state.y = color[0] / state.Max[0];
}
console.log(state);
const init = () => {
    initTop();
    initMain();
    initChoose();
    initOpacity();
}

const initTop = () => {
    const preColor = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
    const rows = Math.ceil(topHeight / spaceWidth);
    const cols = Math.ceil(topWidth / spaceWidth);
    const topSvg = d3.select('.top')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')

    // 方块透明背景
    topSvg.append('g')
        .selectAll('rect')
        .data(new Array(rows * cols).fill(0).map((t, i) => { return { x: i % cols, y: Math.floor(i / cols) } }))
        .enter()
        .append('rect')
        .attr('x', d => d.x * spaceWidth)
        .attr('y', d => d.y * spaceWidth)
        .attr('width', spaceWidth)
        .attr('height', spaceWidth)
        .attr('fill', d => (d.x + d.y) % 2 == 0 ? 'rgba(0,0,0,.6)' : 'rgba(0,0,0,.8)');

    // 当前颜色展示
    topSvg.append('g')
        .append('rect')
        .attr('id', 'color-show')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', '70%')
        .attr('height', '100%')
        .attr('fill', preColor);
    topSvg.append('g')
        .append('rect')
        .attr('x', '70%')
        .attr('y', 0)
        .attr('width', '30%')
        .attr('height', '100%')
        .attr('fill', preColor)


    // rgba文字显示
    topSvg
        .append('text')
        .attr('id', 'color-text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('font-size', 16)
        .attr('transform', `translate(${contentWidth * 0.7 / 2},0)`)
        .attr('text-anchor', 'middle')
        .text(`rgba(${color[0]},${color[1]},${color[2]},${color[3]})`)
        .attr('fill', 'white')
}

const initMain = () => {
    const rectHeight = mainHeight - paddingGap * 2;
    const rectWidth = mainWidth - paddingGap * 2;
    const mainSvg = d3.select('.main')
        .append('svg')
        .attr('width', mainWidth)
        .attr('height', mainHeight)

    const radialGradient = mainSvg.append('defs')
        .append('radialGradient')
        .attr('id', 'radialMain')
        .attr('r', '100%')
        .attr('cx', '100%')
        .attr('cy', '0%')
        .attr('fx', '100%')
        .attr('fy', '0%')
    radialGradient.append('stop').attr('offset', '0%').attr('stop-color', `rgb(${color[0]},${color[1]},${color[2]})`)
    radialGradient.append('stop').attr('offset', '100%').attr('stop-color', 'rgb(255,255,255)')

    const linearGradient = mainSvg.select('defs')
        .append('linearGradient')
        .attr('id', 'linearMain')
        .attr('x1', '0%')
        .attr('y1', '100%')
        .attr('x2', '0%')
        .attr('y2', '0%')
    linearGradient.append('stop').attr('offset', '0%').attr('stop-color', 'rgb(0,0,0)')
    linearGradient.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(0,0,0,0)')

    mainSvg.append('g')
        .attr('transform', `translate(${paddingGap},${paddingGap})`)
        .append('rect')
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', 'url(#radialMain)')

    const greyLinear = mainSvg.append('g')
        .attr('transform', `translate(${paddingGap},${paddingGap})`)
        .append('rect')
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', 'url(#linearMain)')

    const widthLinearScale = d3.scaleLinear()
        .domain([0, 1])
        .range([rectWidth, 0])

    const XLinearScale = d3.scaleLinear()
        .domain([rectWidth, 0])
        .range([0, 1])

    const heightLinearScale = d3.scaleLinear()
        .domain([0, 1])
        .range([rectHeight, 0])

    const YLinearScale = d3.scaleLinear()
        .domain([rectHeight, 0])
        .range([0, 1])

    const current = mainSvg.append('g')
        .attr('transform', `translate(${paddingGap},${paddingGap})`)
        .append('circle')
        .attr('cx', widthLinearScale(state.x))
        .attr('cy', heightLinearScale(state.y))
        .attr('r', 3)
        .attr('fill', 'rgba(0,0,0,0)')
        .attr('stroke', 'white')

    const updateXY = (x: number, y: number) => {
        if (x >= 0 && x <= rectWidth){
            current.attr('cx', x);
            state.x = XLinearScale(x);
        }
        if(y >= 0 && y <= rectHeight) {
            current.attr('cy', y);
            state.y = YLinearScale(y);
        }

    }
    const drag = d3.drag().on('drag', d => {
        updateXY(d.x, d.y);
    })
    current.call(drag);
    greyLinear.on('click', d => {
        updateXY(d.offsetX - paddingGap, d.offsetY - paddingGap)
    })
}

const initOpacity = () => {
    const rectHeight = asideHeight - paddingGap * 2;
    const rectWidth = asideWidth - paddingGap * 2;
    const opacitySvg = d3.select('#opacity')
        .append('svg')
        .attr('width', asideWidth)
        .attr('height', asideHeight)

    const rows = Math.ceil((asideHeight - paddingGap * 2) / spaceWidth);
    const cols = Math.ceil((asideWidth - paddingGap * 2) / spaceWidth);
    // 方块透明背景
    opacitySvg.append('g')
        .attr('width', asideWidth - 2 * paddingGap)
        .attr('height', asideHeight - 2 * paddingGap)
        .attr('transform', `translate(${paddingGap},${paddingGap})`)
        .selectAll('rect')
        .data(new Array(rows * cols).fill(0).map((t, i) => { return { x: i % cols, y: Math.floor(i / cols) } }))
        .enter()
        .append('rect')
        .attr('x', d => d.x * spaceWidth)
        .attr('y', d => d.y * spaceWidth)
        .attr('width', spaceWidth)
        .attr('height', spaceWidth)
        .attr('fill', d => (d.x + d.y) % 2 == 0 ? 'rgba(0,0,0,.6)' : 'rgba(0,0,0,.8)');

    const linearGradient = opacitySvg.append('defs')
        .append('linearGradient')
        .attr('id', 'linearOpacity')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%')
    linearGradient.append('stop').attr('offset', '0%').attr('stop-color', `rgba(${color[0]},${color[1]},${color[2]},1)`)
    linearGradient.append('stop').attr('offset', '100%').attr('stop-color', `rgba(${color[0]},${color[1]},${color[2]},0)`)


    const rect = opacitySvg.append('g')
        .append('rect')
        .attr('x', paddingGap)
        .attr('y', paddingGap)
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', `url(#linearOpacity)`)



    const linearScale = d3.scaleLinear()
        .domain([1, 0])
        .range([0, rectHeight]);
    const current = opacitySvg.append('g')
        .attr('transform', `translate(0,${paddingGap})`)
        .append('rect')
        .attr('x', paddingGap / 2)
        .attr('y', linearScale(color[3]))
        .attr('width', asideWidth - paddingGap)
        .attr('height', 4)
        .attr('fill', 'rgba(0,0,0,0)')
        .attr('stroke', 'white')
        .attr('transform', 'translate(0,-2)')

    const drag = d3.drag()
        .on('drag', d => {
            if (d.y >= 0 && d.y <= rectHeight) {
                current.attr('y', d.y)
                state.z = 1 - d.y / rectHeight
            }
        })
    current.call(drag);

    rect.on('click', d => {
        current.attr('y', d.offsetY - paddingGap)
        state.z = 1 - (d.offsetY - paddingGap) / rectHeight
    })
}

const initChoose = () => {
    const rectHeight = asideHeight - paddingGap * 2;
    const rectWidth = asideWidth - paddingGap * 2;
    const chooseSvg = d3.select('#choose')
        .append('svg')
        .attr('width', asideWidth)
        .attr('height', asideHeight)
    const colors = [
        'rgb(255,0,0)',
        'rgb(255,255,0)',
        'rgb(0,255,0)',
        'rgb(0,255,255)',
        'rgb(0,0,255)',
        'rgb(255,0,255)',
        'rgb(255,0,0)',]

    const linearGradient = chooseSvg.append('defs')
        .append('linearGradient')
        .attr('id', 'linearColor')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%')

    for (let i = 0; i < 7; i++) {
        linearGradient.append('stop').attr('offset', i / 6).attr('stop-color', colors[i])
    }

    const rect = chooseSvg
        .append('g')
        .append('rect')
        .attr('x', paddingGap)
        .attr('y', paddingGap)
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('fill', `url(#linearColor)`)

    const current = chooseSvg.append('g')
        .attr('transform', `translate(0,${paddingGap})`)
        .append('rect')
        .attr('x', paddingGap / 2)
        .attr('width', asideWidth - paddingGap)
        .attr('height', 4)
        .attr('fill', 'rgba(0,0,0,0)')
        .attr('stroke', 'white')
        .attr('transform', 'translate(0,-2)')

    const linearScaleR_G = d3.scaleLinear()
        .domain([255, -255])
        .range([0, rectHeight / 3])
    const linearScaleG_B = d3.scaleLinear()
        .domain([255, -255])
        .range([rectHeight / 3, rectHeight * 2 / 3])
    const linearScaleB_R = d3.scaleLinear()
        .domain([255, -255])
        .range([rectHeight * 2 / 3, rectHeight])

    let diff;
    if (state.xIndex == 0) {
        diff = state.Max[1] - state.Max[2];
        current.attr('y', linearScaleG_B(diff))
    } else if (state.xIndex == 1) {
        diff = state.Max[2] - state.Max[0];
        current.attr('y', linearScaleB_R(diff))
    } else if (state.xIndex == 2) {
        diff = state.Max[0] - state.Max[1];
        current.attr('y', linearScaleR_G(diff))
    }

    const updateXMax = (y: number) => {
        if (y >= 0 && y <= rectHeight / 3) {
            // diff为R-G
            let diff = Math.floor((rectHeight / 6 - y) / (rectHeight / 6) * 255);
            state.Max[0] = diff >= 0 ? 255 : 255 + diff
            state.Max[1] = diff >= 0 ? 255 - diff : 255
            state.Max[2] = 255;
            state.xIndex = 2;
        } else if (y >= rectHeight / 3 && y <= rectHeight * 2 / 3) {
            // diff为G-B
            let diff = Math.floor((rectHeight / 2 - y) / (rectHeight / 6) * 255);
            state.Max[0] = 255
            state.Max[1] = diff >= 0 ? 255 : 255 + diff;
            state.Max[2] = diff >= 0 ? 255 - diff : 255;
            state.xIndex = 0;
        } else if (y >= rectHeight * 2 / 3 && y <= rectHeight) {
            // diff为B-R
            let diff = Math.floor((rectHeight * 5 / 6 - y) / (rectHeight / 6) * 255);
            state.Max[0] = diff >= 0 ? 255 - diff : 255
            state.Max[1] = 255;
            state.Max[2] = diff >= 0 ? 255 : 255 + diff
            state.xIndex = 1;
        }
        if (y >= 0 && y <= rectHeight) {
            current.attr('y', y)
        }
    }

    const drag = d3.drag()
        .on('drag', d => {
            updateXMax(d.y);
        })
    current.call(drag);

    rect.on('click', d => {
        updateXMax(d.offsetY - paddingGap);
    })
}

const update = () => {

    const topSvg = d3.select('.top').select('svg');
    topSvg.select('#color-show').attr('fill', ``)

}

onMounted(() => {
    init();
})

onBeforeUnmount(() => {
    new Array(d3.selectAll('svg')).forEach(item => {
        item.remove();
    })
})

</script>
<template>
    <!-- <div class="color-show" ref="colorElement"> -->
    <div class="mixer">
        <div class="top"></div>
        <div class="content">
            <div class="main"></div>
            <div class="aside" id="opacity"></div>
            <div class="aside" id="choose"></div>
        </div>
    </div>
    <!-- </div> -->
</template>
<style lang="scss" scoped>
.color-show {
    background-color: rgb(165, 0, 0);
}

.mixer {
    width: 300px;
    height: 250px;
    position: relative;

    .top {
        height: 10%;
        width: 100%;
        position: relative;
    }

    .content {
        height: 90%;
        width: 100%;
        display: flex;
        background-color: rgba(0, 0, 0, 0.8);

        .main {
            box-sizing: border-box;
            width: 70%;
            height: 100%;
            // background-color: rgb(255, 0, 0)
        }

        .aside {
            box-sizing: border-box;
            width: 15%;
            height: 100%;
        }
    }
}
</style>