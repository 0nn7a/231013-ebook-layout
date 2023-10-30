import { defineStore } from "pinia";
import JWT from "@/api/cookies.js";
import { apiRefreshToken } from "@/api/users.js";
import router from "@/router/index.js";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      userInfo: { avatar: "", username: "" },
    };
  },
  getters: {},
  actions: {
    async initUserInfo() {
      const init = () => {
        let obj = JSON.parse(localStorage.getItem("ebook_userInfo"));
        obj
          ? (this.userInfo = obj)
          : (this.userInfo = { avatar: "", username: "" });
      };
      function cancel() {
        localStorage.removeItem("ebook_userInfo");
        JWT.removeAllToken();
        router.push({ name: "Home" });
      }

      if (!JWT.getToken() && JWT.getRefreshToken()) {
        try {
          await apiRefreshToken();
          console.log("apiRefreshToken at userStore", "已成功換發 Token");
        } catch (e) {
          console.error(
            "ERROR! apiRefreshToken at userStore",
            "換發 Token 失敗，將導向重新登入，清除使用者資訊",
            e
          );
          cancel();
        }
      } else if (!JWT.getToken() && !JWT.getRefreshToken()) {
        console.error("尚未登入，清除使用者資訊");
        cancel();
      }
      init();
    },
    saveUserInfo(res) {
      let { avatar, username } = res.data;
      localStorage.setItem(
        "ebook_userInfo",
        JSON.stringify({ avatar, username })
      );
      this.initUserInfo();
    },
    clearUserInfo() {
      localStorage.removeItem("ebook_userInfo");
      JWT.removeAllToken();
      this.initUserInfo();
    },
  },
});
