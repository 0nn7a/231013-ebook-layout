import { createRouter, createWebHistory } from "vue-router";
import JWT from "@/api/cookies.js";
import { apiRefreshToken } from "@/api/users.js";
import { useUserStore } from "@/stores/user.js";
import { useMegStore } from "@/stores/meg.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/dashboard",
      name: "Dashboard",
      meta: { pass: true },
      component: () => import("../views/HomePage.vue"),
    },
    {
      path: "/task",
      name: "Task",
      component: () => import("../views/TaskPage.vue"),
    },
    {
      path: "/course",
      name: "Course",
      component: () => import("../views/CoursePage.vue"),
    },
    {
      path: "/calendar",
      name: "Calendar",
      component: () => import("../views/CalendarPage.vue"),
    },
    {
      path: "/set",
      name: "Set",
      meta: { pass: true },
      component: () => import("../views/SetPage.vue"),
    },
    { path: "/:notFound(.*)*", redirect: "/dashboard" },
  ],
});

router.beforeEach(async (to, from) => {
  const userStore = useUserStore();
  const megStore = useMegStore();

  if (!to.meta.pass) {
    // 需要身分驗證的頁面
    if (!JWT.getToken() && JWT.getRefreshToken()) {
      // 換發 Token 路線
      try {
        await apiRefreshToken();
        console.log("apiRefreshToken at router", "已成功換發 Token");
      } catch (e) {
        megStore.pushMegs("Meg-Danger", "登入信息驗證失敗，將導向重新登入！");
        console.error(
          "ERROR! apiRefreshToken at router",
          "換發 Token 失敗，將導向重新登入！",
          e
        );
        userStore.clearUserInfo();
        return { name: "Dashboard" };
      }
    } else if (!JWT.getToken() && !JWT.getRefreshToken()) {
      // 無任何 Token 路線
      megStore.pushMegs("Meg-Sad", "您尚未登入，無權查看此頁面！");
      userStore.clearUserInfo();
      if (from.path === "/" || !from.meta.pass) return { name: "Dashboard" };
      return false;
    }
    // 有 Token 路線
    userStore.initUserInfo();
    return true;
  } else {
    // 不需要身分認證的頁面，就算失敗或無登入都可以訪問
    if (!JWT.getToken() && JWT.getRefreshToken()) {
      // 換發 Token 路線：順便換發一下過期 Token
      try {
        await apiRefreshToken();
        console.log("apiRefreshToken at router", "已成功換發 Token");
      } catch (e) {
        console.error(
          "ERROR! apiRefreshToken at router",
          "換發 Token 失敗，此頁面無需登入即可訪問！",
          e
        );
        userStore.clearUserInfo();
      }
    } else if (!JWT.getToken() && !JWT.getRefreshToken()) {
      // 無任何 Token 路線：順便清除一下登入資訊
      userStore.clearUserInfo();
    }
    // 有 Token 路線
    userStore.initUserInfo();
    return true;
  }
});

export default router;
