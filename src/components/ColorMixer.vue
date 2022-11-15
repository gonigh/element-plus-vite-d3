<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';

const state = reactive({
    color: {
        r: 0,
        g: 0,
        b: 0,
        a: 0
    },
});
const colorElement = ref(null);
onMounted(() => {

})


</script>
<template>
    <!-- <div class="color-show" ref="colorElement"> -->
    <div class="mixer">
        <div class="top"></div>
        <div class="content">
            <div class="main"></div>
            <div class="left"></div>
            <div class="right"></div>
        </div>
    </div>
    <!-- </div> -->
</template>
<style lang="scss" scoped>
.color-show {
    background-color: rgba(215, 250, 231, 0.382);
}
.mixer{
    width: 300px;
    height: 200px;
    position: relative;
    background-color: aliceblue;
    .top{
        height: 20%;
        width: 100%;
    }
}
</style>