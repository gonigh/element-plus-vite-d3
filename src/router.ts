import { createRouter, createWebHistory } from "vue-router";
import Demo1 from "./pages/Demo1.vue";
import Demo2 from "./pages/Demo2.vue";
import ColorMixer from './pages/ColorMixerDemo.vue'
import BezierCurve from './pages/BezierCurve.vue'

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
