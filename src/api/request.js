import axios from "axios";
import JWT from "@/api/cookies.js";
import router from "@/router/index.js";
import { apiRefreshToken } from "@/api/users.js";
import { useUserStore } from "@/stores/user.js";
import { useMegStore } from "@/stores/meg.js";

// 主要的 Axios 實例
const AxiosEbook = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    pragma: "no-cache",
    "cache-control": "no-cache",
  },
});

// 輔助的 Axios 實例
const AxiosRefresh = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    pragma: "no-cache",
    "cache-control": "no-cache",
  },
});

// 可以跳過 Token 驗證的請求路徑
const passAuthUrls = ["/users/signup", "/users/login"];

// 主要 Axios 實例的攔截器
AxiosEbook.interceptors.request.use(
  async (config) => {
    const userStore = useUserStore();
    const megStore = useMegStore();

    // 取消請求
    const cancelReq = new AbortController();
    config.signal = cancelReq.signal;

    //不需要攜帶Token的URL以外的請求，request header一律帶上Token
    if (!passAuthUrls.includes(config.url)) {
      if (!JWT.getToken() && JWT.getRefreshToken()) {
        try {
          await apiRefreshToken();
          console.log("apiRefreshToken at request", "已成功換發 Token！");
        } catch (e) {
          //可能是 refreshToken 有問題 用戶所有資訊清空
          userStore.clearUserInfo();
          megStore.pushMegs("Meg-Danger", "登入信息驗證失敗，將導向重新登入！");
          console.error(
            "ERROR! apiRefreshToken at request",
            "換發 Token 失敗，將導向重新登入！",
            e
          );
          await router.push({ name: "Home" });
        }
      }
      if (!JWT.getToken() && !JWT.getRefreshToken()) {
        userStore.clearUserInfo();
        userStore.initUserInfo();
        console.error(
          "ERROR! apiRefreshToken at request",
          "進行此操作需要登入！"
        );
        megStore.pushMegs("Meg-Danger", "您尚未登入，無權進行此操作！");
        await router.push({ name: "Home" });
        cancelReq.abort();
      }
      //如果本來就有或換發過後：Token 將是存在的狀態
      const token = JWT.getToken();
      return {
        ...config,
        headers: { ...config.headers, Authorization: `Bearer ${token}` },
      };
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

AxiosEbook.interceptors.response.use(
  (response) => {
    // 存儲 JWT
    if (response.data.data && response.data.data.jwt) {
      JWT.saveAllToken(response.data.data.jwt);
    }
    return response.data;
  },
  (error) => {
    if (!window.navigator.onLine) {
      alert("沒開網路");
    } else {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

// 輔助實例的攔截器
AxiosRefresh.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (!window.navigator.onLine) {
      alert("無網際網路連線");
    } else {
      if (error.response) return Promise.reject(error.response.data);
      return Promise.reject(error);
    }
  }
);

// 串接 API 的所有方法整理
const useApi = {
  get(url) {
    return AxiosEbook.get(url);
  },
  getParams(url, json) {
    return AxiosEbook.get(url, { params: json });
  },
  postBody(url, data) {
    return AxiosEbook.post(url, data);
  },
  postParams(url, json) {
    return AxiosEbook.post(url, null, { params: json });
  },
  putBody(url, data, json) {
    return AxiosEbook.put(url, data, { params: json });
  },
  patchBody(url, data, json) {
    return AxiosEbook.patch(url, data, { params: json });
  },

  // 輔助實例
  postRefresh(url, data) {
    return AxiosRefresh.post(url, data);
  },
};

export default useApi;
