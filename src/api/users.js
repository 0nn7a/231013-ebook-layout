import useApi from "@/api/request.js";
import JWT from "@/api/cookies.js";

export const apiUserAct = async (uri, data) =>
  await useApi.postBody(`/users/${uri}`, data);
export const apiUserUpdate = async (uri, data, json) => {
  await useApi.patchBody(`/users/update/${uri}`, data, json);
};

export const apiRefreshToken = async () => {
  const res = await useApi.postRefresh("/refreshToken", {
    refreshToken: JWT.getRefreshToken(),
  });
  if (res.status === 200) {
    JWT.saveAllToken(res);
  } else {
    return Promise.reject(res);
  }
  return res;
};
