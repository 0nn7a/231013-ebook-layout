import axios from "axios";

//主要的Axios實例
const instance = axios.create({
  baseURL: "https://230313-ebook-server.vercel.app",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    pragma: "no-cache",
    "cache-control": "no-cache",
  },
});
instance.interceptors.request.use(
  (config) => {
    // let token = localStorage.getItem('Authorization');
    // return {
    //   ...config,
    //   headers: { ...config.headers, Authorization: token },
    // };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (!window.navigator.onLine) {
      alert("沒開網路");
    } else {
      return Promise.reject(error);
    }
  }
);

const useApi = {
  get(url) {
    return instance.get(url);
  },
  post(url, body) {
    return instance.post(url, body);
  },
};

export default useApi;
