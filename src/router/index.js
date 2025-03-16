/*
 * @Author: huangxin-star 458629403@qq.com
 * @Date: 2025-03-15 21:42:31
 * @LastEditors: huangxin-star 458629403@qq.com
 * @LastEditTime: 2025-03-15 22:20:58
 * @FilePath: /quality-management-system/src/router/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../store/user";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/login/LoginView.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/login/RegisterView.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/",
    component: () => import("../views/layout/MainLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "Dashboard",
        component: () => import("../views/dashboard/DashboardView.vue"),
        meta: { title: "仪表盘" },
      },
      {
        path: "meeting",
        name: "MeetingRecords",
        component: () => import("../views/meeting/MeetingRecords.vue"),
        meta: { title: "会议记录" },
      },
      {
        path: "proposal/submit",
        name: "SubmitProposal",
        component: () =>
          import("../views/proposal/submit/SubmitProposalView.vue"),
        meta: { title: "提交提案" },
      },
      {
        path: "proposal/analyze",
        name: "AnalyzeProposal",
        component: () =>
          import("../views/proposal/analyze/AnalyzeProposalView.vue"),
        meta: { title: "分析提案" },
      },
      {
        path: "proposal/history",
        name: "HistoryProposal",
        component: () =>
          import("../views/proposal/history/HistoryProposalView.vue"),
        meta: { title: "历史提案" },
      },
    ],
  },
//   {
//     path: "/:pathMatch(.*)*",
//     name: "NotFound",
//     component: () => import("../views/NotFound.vue"),
//   },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 导航守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = userStore.isLoggedIn;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "Login", query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
