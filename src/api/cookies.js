const { EBOOK_TOKEN_KEY, EBOOK_REFRESH_TOKEN_KEY } = import.meta.env;

function getToken() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${EBOOK_TOKEN_KEY}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
function getRefreshToken() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${EBOOK_REFRESH_TOKEN_KEY}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
function saveToken(token, expired) {
  document.cookie = `${EBOOK_TOKEN_KEY}=${token}; expires=${expired}; path=/`;
}
function saveRefreshToken(token, expired) {
  document.cookie = `${EBOOK_REFRESH_TOKEN_KEY}=${token}; expires=${expired}; path=/`;
}
function saveAllToken(res) {
  const { token, refreshToken, expireTime, expireTimeR } = res;
  saveToken(token, expireTime);
  saveRefreshToken(refreshToken, expireTimeR);
}
function removeToken() {
  document.cookie = `${EBOOK_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}
function removeRefreshToken() {
  document.cookie = `${EBOOK_REFRESH_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}
function removeAllToken() {
  removeToken();
  removeRefreshToken();
}

export default {
  getToken,
  getRefreshToken,
  saveRefreshToken,
  saveToken,
  saveAllToken,
  removeToken,
  removeRefreshToken,
  removeAllToken,
};
