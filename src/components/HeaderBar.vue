<script setup>
import JWT from "@/api/cookies.js";
import { apiUserAct, apiUserUpdate } from "@/api/users.js";
import { useUserStore } from "@/stores/user.js";
const userStore = useUserStore();

// 個人資料詳細設定
const userDetail = ref(false);
const logout = () => {
  userStore.clearUserInfo();
  router.push({ name: "Home" });
};

// 驗證輸入框：不得為空、不得輸入英數以外字符
const validate = reactive({
  regex: /^[A-Za-z0-9]*$/,
  errors: [],
  isValid: false,
});
const validateInput = (key) => {
  function addToErr(attr) {
    if (!validate.errors.includes(attr)) validate.errors.push(attr);
  }
  function removeFromErr(attr) {
    validate.errors = validate.errors.filter((item) => attr !== item);
  }
  function validateTool(attr) {
    if (attr !== "confirmPassword") {
      if (userForm[attr] === "" || !validate.regex.test(userForm[attr])) {
        addToErr(attr);
      } else {
        removeFromErr(attr);
      }
    }
    // 校驗兩次密碼
    if (
      attr === "confirmPassword" ||
      (attr === "password" && userForm.confirmPassword)
    ) {
      if (userForm.confirmPassword !== userForm.password) {
        addToErr("confirmPassword");
      } else {
        removeFromErr("confirmPassword");
      }
    }
  }
  if (!key) {
    // 校驗全部
    for (let prop in userForm) {
      switch (userForm.act) {
        case "Sign up":
          if (prop !== "act") {
            validateTool(prop);
          }
          break;
        case "Login":
          if (prop === "account" || prop === "password") {
            validateTool(prop);
          }
          break;
      }
    }
  } else {
    // 校驗單個
    validateTool(key);
  }
  validate.isValid = validate.errors.length === 0;
};

// 收集使用者輸入內容
const userForm = reactive({
  act: "",
  username: "",
  account: "",
  password: "",
  confirmPassword: "",
});
watch(
  () => userForm.act,
  (val) => {
    // 切換登入、註冊時，清除輸入框內文、錯誤提示
    for (let key in userForm) {
      if (userForm.hasOwnProperty(key) && key !== "act") {
        userForm[key] = "";
      }
    }
    validate.errors = [];
  }
);
const submitUserForm = async () => {
  validateInput();
  if (!validate.isValid) return;

  const uri = userForm.act.toLowerCase().replace(" ", "");
  const { username, account, password } = userForm;

  try {
    const res = await apiUserAct(uri, {
      username,
      account,
      password,
    });
    console.log(res);
    if (res.status === 200) {
      switch (userForm.act) {
        case "Sign up":
          userForm.act = "Login";
          break;
        case "Login":
          JWT.saveAllToken(res);
          userStore.saveUserInfo(res);
          userForm.act = "";
          break;
      }
    } else {
      console.error(res.meg);
    }
  } catch (e) {
    console.error("ERROR! apiUserAct at HeaderBar", e);
  }
};

// FAKE - 通知數量
const randomInt = computed({
  get() {
    let random = Math.floor(Math.random() * 3);
    switch (random) {
      case 0:
        return 0;
      case 1:
        return 1;
      case 2:
        return 20;
    }
  },
});

// 當下拉式視窗展開時，點擊其以外部分關閉視窗
const bodyClose = () => {
  if (userForm.act) userForm.act = "";
  if (userDetail.value) userDetail.value = false;
};
onMounted(() => {
  apiUserUpdate("avatar");

  document.addEventListener("click", bodyClose);
});
onUnmounted(() => {
  document.removeEventListener("click", bodyClose);
});
</script>

<template>
  <header class="header__container">
    <div class="header__search">
      <SvgIcon
        icon-name="Header-Search"
        :icon-style="{ height: '2rem', width: '2rem' }"
      ></SvgIcon>
      <input type="text" placeholder="Search book name, author, edition..." />
    </div>

    <div v-if="userStore.userInfo.username" class="header__user">
      <div
        class="header__user-info"
        @click="userDetail = !userDetail"
        @click.stop
      >
        <img :src="userStore.userInfo.avatar" alt="user photo" />
        <p>{{ userStore.userInfo.username }}</p>
      </div>

      <transition name="opacity" mode="out-in">
        <div v-if="userDetail" class="header__popup" @click.stop>
          <ul class="header__popup-list">
            <li>更新個人資料</li>
            <li @click="logout">登出</li>
          </ul>
        </div>
      </transition>
    </div>
    <div v-else class="header__action">
      <input
        type="radio"
        name="action"
        id="signup"
        value="Sign up"
        v-model="userForm.act"
      />
      <label for="signup" class="header__action-label">Sign up</label>
      <input
        type="radio"
        name="action"
        id="login"
        value="Login"
        v-model="userForm.act"
      />
      <label for="login" class="header__action-label">Login</label>

      <transition name="opacity" mode="out-in">
        <div v-if="userForm.act" class="header__popup" @click.stop>
          <form class="header__popup-form">
            <template v-for="(item, key) in userForm" :key="key">
              <!-- Login 的顯示範圍 -->
              <template
                v-if="
                  key !== 'act' &&
                  key !== 'username' &&
                  key !== 'confirmPassword'
                "
              >
                <label :for="key">{{ key }} *</label>
                <input
                  :type="key.includes('word') ? 'password' : 'text'"
                  :name="key"
                  :id="key"
                  v-model.trim="userForm[key]"
                  @change="validateInput(key)"
                  :class="
                    validate.errors.includes(key) ? 'unvalidated-outline' : ''
                  "
                />
                <span
                  v-if="validate.errors.includes(key)"
                  class="unvalidated-text"
                >
                  不得為空、僅可輸入英數
                </span>
              </template>
              <!-- Sign up 的顯示範圍 -->
              <template
                v-else-if="
                  (key === 'username' || key === 'confirmPassword') &&
                  userForm.act === 'Sign up'
                "
              >
                <label :for="key">{{ key }} *</label>
                <input
                  :type="key.includes('word') ? 'password' : 'text'"
                  :name="key"
                  :id="key"
                  v-model.trim="userForm[key]"
                  @change="validateInput(key)"
                  :class="
                    validate.errors.includes(key) ? 'unvalidated-outline' : ''
                  "
                />
                <span
                  v-if="
                    validate.errors.includes(key) && key === 'confirmPassword'
                  "
                  class="unvalidated-text"
                >
                  兩次密碼必須輸入相同
                </span>
                <span
                  v-else-if="validate.errors.includes(key)"
                  class="unvalidated-text"
                >
                  不得為空、僅可輸入英數
                </span>
              </template>
            </template>
            <button type="button" @click="submitUserForm">
              {{ userForm.act }}
            </button>
          </form>
        </div>
      </transition>
    </div>

    <div class="header__notice" :class="randomInt ? 'header__notice-red' : ''">
      <SvgIcon
        icon-name="Header-Notice"
        :icon-style="{ height: '3rem', width: '3rem' }"
      >
      </SvgIcon>
      <span v-if="randomInt" class="header__notice-dot"></span>
      <p v-if="randomInt" class="header__notice-amount">{{ randomInt }}</p>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  &__container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 2rem;
  }

  &__search {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-right: auto;
    padding: 0 1rem;
    background-color: var(--e-color-theme);
    border-radius: 5rem;
    input[type="text"] {
      width: 22rem;
      padding: 1rem;
      font-size: 1.1rem;
      border: none;
      outline: none;
      background-color: transparent;
      &::placeholder {
        color: var(--e-color-subtext);
      }
    }
  }

  &__user {
    align-self: stretch;
    position: relative;
    &-info {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 1.25rem;
      transition: all 0.2s ease-in-out;
      &:hover {
        background-color: var(--e-color-theme);
        cursor: pointer;
      }
      img {
        height: 3rem;
        width: 3rem;
        border-radius: 5rem;
      }
      p {
        font-size: 1.2rem;
      }
    }
  }
  &__action {
    align-self: stretch;
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: stretch;
    gap: 0.5rem;
    input[type="radio"] {
      display: none;
      &:checked + label {
        color: var(--e-color-text);
        background-color: var(--e-color-theme);
      }
    }
    &-label {
      display: flex;
      align-items: center;
      padding: 1rem;
      height: 100%;
      font-size: 1.2rem;
      color: var(--e-color-subtext);
      border-radius: 1.25rem;
      transition: all 0.2s ease-in-out;
      &:hover {
        color: var(--e-color-text);
        cursor: pointer;
      }
    }
  }
  &__popup {
    position: absolute;
    bottom: -1rem;
    right: 0;
    z-index: 50;
    padding: 1.5rem;
    white-space: nowrap;
    background-color: var(--e-color-theme-light);
    border-radius: 1.25rem;
    border: 1px solid var(--e-color-theme-dark);
    transform: translateY(100%);
    &-list {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
      li {
        text-align: end;
        font-size: 1.2rem;
        transition: all 0.2s ease-in-out;
        &:hover {
          color: var(--e-color-subtext);
          cursor: pointer;
        }
      }
    }
    &-form {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      label {
        letter-spacing: 0.05em;
        padding: 0 0.5rem;
        &:not(:first-of-type) {
          margin-top: 1rem;
        }
      }
      input {
        padding: 0.3rem 0.5rem;
        font-size: 1.2rem;
        letter-spacing: 0.05em;
        background-color: var(--e-color-theme-lighter);
        border: 1px solid var(--e-color-theme-darker);
        border-radius: 0.5rem;
        outline: none;
      }
      button {
        align-self: flex-end;
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        font-size: 1.2rem;
        color: var(--e-color-theme-lighter);
        background-color: var(--e-color-key-1);
        border: none;
        border-radius: 0.5rem;
        transition: all 0.2s ease-in-out;
        &:hover {
          background-color: var(--e-color-key-1-dark);
          cursor: pointer;
        }
      }
    }
  }

  &__notice {
    align-self: stretch;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.75rem;
    border-radius: 1.5rem;
    color: var(--e-color-subtext);
    &:hover {
      background-color: var(--e-color-theme);
      cursor: pointer;
    }
    &-red {
      color: var(--e-color-key-1);
    }
    &-dot {
      position: absolute;
      top: 1.8rem;
      right: 1.2rem;
      width: 0.3rem;
      height: 0.3rem;
      background-color: var(--e-color-key-1);
      border-radius: 5rem;
    }
    &-amount {
      padding-right: 0.8rem;
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.07em;
    }
  }
}

.unvalidated {
  &-outline {
    border: 1px solid var(--e-color-key-1) !important;
  }
  &-text {
    align-self: flex-end;
    font-size: 0.85rem;
    color: var(--e-color-key-1);
  }
}
</style>
