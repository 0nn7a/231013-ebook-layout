import { createApp } from "vue";
import App from "@/App.vue";
import "@/assets/css/style.css";
import SvgIcon from "@/components/SvgIcon.vue";
import "virtual:svg-icons-register";
import router from "@/router/index.js";

const app = createApp(App);
app.component("svg-icon", SvgIcon);
app.use(router);

router.isReady().then(() => app.mount("#app"));
