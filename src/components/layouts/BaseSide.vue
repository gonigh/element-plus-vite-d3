<template>
  <el-menu default-active="./" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">

    <el-menu-item index="./">
      <template #title>
        柱状图Demo
        <!-- <router-link to="/">柱状图Demo</router-link> -->
      </template>
    </el-menu-item>
    <el-menu-item index="./demo2">
      <template #title>
        饼图Demo
      </template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import {
} from '@element-plus/icons-vue'
import { Router, useRouter } from 'vue-router';

const router = useRouter()
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  router.push(key);
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

