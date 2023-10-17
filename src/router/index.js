import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/home",
      name: "Home",
      component: () => import("../views/HomePage.vue"),
    },
    {
      path: "/books",
      name: "Books",
      component: () => import("../views/BooksPage.vue"),
    },
    {
      path: "/bookmark",
      name: "Bookmark",
      component: () => import("../views/BookmarkPage.vue"),
    },
    {
      path: "/set",
      name: "Set",
      component: () => import("../views/SetPage.vue"),
    },
  ],
});

export default router;