import { createRouter, createWebHistory } from "vue-router";
import Demo1 from "./pages/Demo1.vue";
import Demo2 from './pages/Demo2.vue'
const routes = [
  {
    path: "/",
    component: Demo1,
  },
  {
    path: "/demo2",
    component: Demo2,
  },
];

const router = createRouter({
    history:createWebHistory(),
    routes
})

export default router;