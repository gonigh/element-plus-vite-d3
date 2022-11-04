import { createRouter, createWebHistory } from "vue-router";
import Demo1 from "./pages/Demo1.vue";
import Demo2 from "./pages/Demo2.vue";
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
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
