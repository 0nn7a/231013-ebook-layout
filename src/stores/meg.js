import { defineStore } from "pinia";

export const useMegStore = defineStore("meg", {
  state: () => {
    return {
      messages: [],
    };
  },
  getters: {},
  actions: {
    pushMegs(icon, meg, time = 2) {
      const existed = this.messages.find((item) => meg === item.meg);
      if (!existed) {
        this.messages.push({ icon, meg, time });
      }
    },
  },
});
