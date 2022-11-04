<template>
  <el-menu default-active="/" class="el-menu-vertical-demo">

    <el-menu-item v-for="item in routes" :index="item.path" @click="handleOpen(item.path)">
      <template #title>
        {{item.name}}
      </template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import {
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
const router = useRouter();
const routes = router.getRoutes();

const handleOpen = (path: string) => {
  router.replace(path)
}
</script>

