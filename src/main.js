import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "@/App.vue";

import "@/assets/css/style.css";
import SvgIcon from "@/components/SvgIcon.vue";
import "virtual:svg-icons-register";
import router from "@/router/index.js";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.component("svg-icon", SvgIcon);

router.isReady().then(() => app.mount("#app"));
