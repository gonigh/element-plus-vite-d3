import { createRouter, createWebHistory } from "vue-router";
import Demo1 from "./pages/Demo1.vue";
import Demo2 from "./pages/Demo2.vue";
import ColorMixer from './pages/ColorMixerDemo.vue'
import BezierCurve from './pages/BezierCurve.vue'
import Upload from './pages/Upload/index.vue'
import CircleCollision from './pages/CircleCollision/index.vue'
import Dashboard from "./pages/Dashboard.vue";
import SegProgress from "./pages/SegProgress.vue";
import ParallelCoordinateAxis from "./pages/ParallelCoordinateAxis.vue";

const routes = [
  {
    path: "/",
    name: "柱状图demo",
    component: Demo1,
  },
  {
    path: "/demo2",
    name: "饼图Demo",
    component: Demo2,
  },{
    path: "/color",
    name: "调色器",
    component: ColorMixer
  },{
    path: "/curve",
    name: "贝塞尔曲线",
    component: BezierCurve,
  },{
    path: "/upload",
    name: "上传文件",
    component : Upload
  },{
    path: "/circle-collision",
    name: "小球碰撞",
    component : CircleCollision
  },{
    path: "/dashboard",
    name: "仪表盘",
    component : Dashboard
  },{
    path: "/seg-progress",
    name: "段式进度条",
    component : SegProgress
  },{
    path: "/parallel-coordinate-axis",
    name: "平行坐标轴",
    component: ParallelCoordinateAxis
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
