import useApi from "@/api/request.js";
import JWT from "@/api/cookies.js";

export const apiUserAct = async (uri, data) =>
  await useApi.postBody(`/users/${uri}`, data);
export const apiUserUpdate = async (data) =>
  await useApi.putBody(`/users/update`, data);
export const apiRefreshToken = async () => {
  const res = await useApi.postRefresh("/refreshToken", {
    refreshToken: JWT.getRefreshToken(),
  });
  if (res.status === 200) {
    JWT.saveAllToken(res.data.jwt);
  } else {
    return Promise.reject(res);
  }
  return res;
};
