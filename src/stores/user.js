import { defineStore } from "pinia";
import JWT from "@/api/cookies.js";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      userInfo: { avatar: "", username: "" },
    };
  },
  getters: {},
  actions: {
    initUserInfo() {
      let obj = JSON.parse(localStorage.getItem("ebook_userInfo"));
      obj
        ? (this.userInfo = obj)
        : (this.userInfo = { avatar: "", username: "" });
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
