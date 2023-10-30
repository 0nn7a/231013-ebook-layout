<script setup>
import JWT from "@/api/cookies.js";
import { apiUserAct, apiUserUpdate } from "@/api/users.js";
import { useUserStore } from "@/stores/user.js";
import { useMegStore } from "@/stores/meg.js";
const userStore = useUserStore();
const megStore = useMegStore();

// 驗證輸入框
const validate = reactive({
  userRegex: /^.{2,8}$/,
  regex: /^[A-Za-z0-9]*$/,
  errors: [],
  isValid: false,
});
function addToErr(attr) {
  if (!validate.errors.includes(attr)) validate.errors.push(attr);
}
function removeFromErr(attr) {
  validate.errors = validate.errors.filter((item) => attr !== item);
}
const validateInput = (key) => {
  function validateTool(attr) {
    if (attr === "username") {
      // 校驗暱稱：不得為空、僅可輸入 2 ~ 8 個字符
      if (userForm[attr] === "" || !validate.userRegex.test(userForm[attr])) {
        addToErr(attr);
      } else {
        removeFromErr(attr);
      }
    } else if (attr !== "confirmPassword") {
      // 校驗帳密：不得為空、僅可輸入英數
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
const validateUpdate = (key) => {
  function validateTool(attr) {
    switch (attr) {
      case "username":
        // 校驗暱稱：僅可輸入 2 ~ 8 個字符
        if (
          userDetail.updateForm[attr] &&
          !validate.userRegex.test(userDetail.updateForm[attr])
        ) {
          addToErr(attr);
        } else {
          removeFromErr(attr);
        }
        break;
      case "newPassword":
        // 校驗新密碼：僅可輸入英數
        if (
          userDetail.updateForm[attr] &&
          !validate.regex.test(userDetail.updateForm[attr])
        ) {
          addToErr(attr);
        } else {
          removeFromErr(attr);
        }
        break;
    }
    // 校驗兩次密碼：修改密碼不得與舊密碼相同
    if (attr === "oldPassword" || attr === "newPassword") {
      // 校驗舊密碼：於需要修改密碼時輸入
      if (
        (userDetail.updateForm.newPassword &&
          !userDetail.updateForm.oldPassword) ||
        (!userDetail.updateForm.newPassword &&
          userDetail.updateForm.oldPassword)
      ) {
        addToErr("oldPassword");
      } else {
        removeFromErr("oldPassword");
      }
      // 校驗兩次密碼：修改密碼不得與舊密碼相同
      if (
        userDetail.updateForm.newPassword &&
        userDetail.updateForm.newPassword === userDetail.updateForm.oldPassword
      ) {
        addToErr("same");
      } else {
        removeFromErr("same");
      }
    }
  }
  if (!key) {
    // 校驗全部
    for (let prop in userDetail.updateForm) {
      if (prop !== "avatar") {
        validateTool(prop);
      }
    }
  } else {
    // 校驗單個
    validateTool(key);
  }
  validate.isValid = validate.errors.length === 0;
};

// 個人資料詳細設定
const userDetail = reactive({
  popup: false,
  dialog: false,
  alert: false,
  updateForm: {
    avatar: "",
    username: "",
    newPassword: "",
    oldPassword: "",
  },
});
watch(
  () => userDetail.dialog,
  (val) => {
    // 重啟編輯視窗時，清除輸入框內文、錯誤提示
    for (let key in userDetail.updateForm) {
      userDetail.updateForm[key] = "";
    }
    validate.errors = [];
  }
);
const togglePopup = () => {
  userDetail.popup = !userDetail.popup;
};
const toggleDialog = (window, bool) => {
  userDetail[window] = bool;
};
const updateAvatar = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const originalDataUrl = e.target.result;

    // 創建一個新的Image物件
    const img = new Image();
    img.src = originalDataUrl;

    // 等待圖片加載：使用 Canvas 重繪壓縮
    img.onload = async () => {
      // 創建一個 Canvas 物件
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // 設置 Canvas 的尺寸
      canvas.width = 150;
      canvas.height = (150 * img.height) / img.width;

      // 把圖片繪製到 Canvas，使用 toDataURL 轉換為 base64 格式
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 調整圖片壓縮程度並收好
      userDetail.updateForm.avatar = canvas.toDataURL("image/jpeg");
    };
    megStore.pushMegs("Meg-ImgSuccess", "頭像已成功上傳，請記得儲存！");
  };
  reader.readAsDataURL(file);
};
const submitAlert = () => {
  validateUpdate();
  if (!validate.isValid) return;
  userDetail.alert = true;
};
const submitUpdate = async () => {
  userDetail.alert = false;

  // 檢查是否有修改內容
  let changed = false;
  for (let prop in userDetail.updateForm) {
    if (userDetail.updateForm[prop]) changed = true;
  }
  if (!changed) {
    userDetail.dialog = false;
    megStore.pushMegs("Meg-Danger", "個人資料無內容更新！");
    return;
  }

  try {
    const res = await apiUserUpdate(userDetail.updateForm);
    if (res.status === 200) {
      userStore.saveUserInfo(res);
      userDetail.dialog = false;
      megStore.pushMegs("Meg-Smile", res.meg);
    } else {
      megStore.pushMegs("Meg-Sad", res.meg);
    }
  } catch (e) {
    console.error("ERROR! apiUserUpdate at HeaderBar", e);
    if (e.message === "canceled") {
      userDetail.dialog = false;
      megStore.pushMegs("Meg-Bye", "登入驗證已過期，請重新登入！");
      router.push({ name: "Home" });
    }
  }
};
const logout = () => {
  userStore.clearUserInfo();
  megStore.pushMegs("Meg-Bye", "已成功登出，將回到首頁！");
  router.push({ name: "Home" });
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
    if (res.status === 200) {
      megStore.pushMegs("Meg-Smile", res.meg);
      switch (userForm.act) {
        case "Sign up":
          userForm.act = "Login";
          break;
        case "Login":
          userStore.saveUserInfo(res);
          userForm.act = "";
          break;
      }
    } else {
      megStore.pushMegs("Meg-Sad", res.meg);
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
  if (userDetail.popup) userDetail.popup = false;
};
onMounted(() => {
  document.addEventListener("click", bodyClose);
});
onUnmounted(() => {
  document.removeEventListener("click", bodyClose);
});
</script>

<template>
  <!-- HeaderBar -->
  <header class="header__container">
    <div class="header__search">
      <SvgIcon
        icon-name="Header-Search"
        :icon-style="{ height: '2rem', width: '2rem' }"
      ></SvgIcon>
      <input type="text" placeholder="Search book name, author, edition..." />
    </div>

    <div v-if="userStore.userInfo.username" class="header__user">
      <div class="header__user-info" @click="togglePopup" @click.stop>
        <img :src="userStore.userInfo.avatar" alt="user photo" />
        <p>{{ userStore.userInfo.username }}</p>
      </div>

      <transition name="opacity" mode="out-in">
        <div v-if="userDetail.popup" class="header__popup" @click.stop>
          <ul class="header__popup-list">
            <li @click="toggleDialog('dialog', true)">更新個人資料</li>
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
          <form class="header__form">
            <template v-if="userForm.act === 'Sign up'">
              <label for="username" class="header__form-label">暱稱*</label>
              <input
                type="text"
                class="header__form-input"
                name="username"
                id="username"
                v-model.trim="userForm.username"
                @change="validateInput('username')"
                :class="
                  validate.errors.includes('username')
                    ? 'unvalidated-outline'
                    : ''
                "
              />
              <span
                v-if="validate.errors.includes('username')"
                class="unvalidated-text"
              >
                不得為空、僅可輸入 2 ~ 8 個字符
              </span>
            </template>

            <label for="account" class="header__form-label">帳號*</label>
            <input
              type="text"
              class="header__form-input"
              name="account"
              id="account"
              v-model.trim="userForm.account"
              @change="validateInput('account')"
              :class="
                validate.errors.includes('account') ? 'unvalidated-outline' : ''
              "
            />
            <span
              v-if="validate.errors.includes('account')"
              class="unvalidated-text"
            >
              不得為空、僅可輸入英數
            </span>

            <label for="password" class="header__form-label">密碼*</label>
            <input
              type="password"
              class="header__form-input"
              name="password"
              id="password"
              v-model.trim="userForm.password"
              @change="validateInput('password')"
              :class="
                validate.errors.includes('password')
                  ? 'unvalidated-outline'
                  : ''
              "
            />
            <span
              v-if="validate.errors.includes('password')"
              class="unvalidated-text"
            >
              不得為空、僅可輸入英數
            </span>

            <template v-if="userForm.act === 'Sign up'">
              <label for="confirmPassword" class="header__form-label"
                >確認密碼*</label
              >
              <input
                type="password"
                class="header__form-input"
                name="confirmPassword"
                id="confirmPassword"
                v-model.trim="userForm.confirmPassword"
                @change="validateInput('confirmPassword')"
                :class="
                  validate.errors.includes('confirmPassword')
                    ? 'unvalidated-outline'
                    : ''
                "
              />
              <span
                v-if="validate.errors.includes('confirmPassword')"
                class="unvalidated-text"
              >
                兩次密碼必須輸入相同
              </span>
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

  <!-- ModalDialog 1: 更新個人資料 -->
  <transition name="opacity" mode="out-in">
    <ModalDialog
      v-if="userDetail.dialog"
      @close-dialog="toggleDialog('dialog', false)"
      @click.stop
    >
      <template #title>更新個人資料</template>
      <template #main>
        <form class="header__dialog__form">
          <div class="header__dialog__form-avatar">
            <img
              :src="
                userDetail.updateForm.avatar
                  ? userDetail.updateForm.avatar
                  : userStore.userInfo.avatar
              "
              alt="user photo"
            />
            <button
              v-if="userDetail.updateForm.avatar"
              type="button"
              @click="userDetail.updateForm.avatar = ''"
            >
              <SvgIcon icon-name="Header-Trash" />
            </button>
            <label v-else for="update-avatar">
              <SvgIcon icon-name="Header-Edit" />
            </label>
            <input type="file" id="update-avatar" @change="updateAvatar" />
          </div>
          <br />

          <label for="update-username" class="header__form-label">暱稱</label>
          <input
            type="text"
            class="header__form-input"
            name="update-username"
            id="update-username"
            v-model.trim="userDetail.updateForm.username"
            :placeholder="userStore.userInfo.username"
            @change="validateUpdate('username')"
            :class="
              validate.errors.includes('username') ? 'unvalidated-outline' : ''
            "
          />
          <span
            v-if="validate.errors.includes('username')"
            class="unvalidated-text"
          >
            僅可輸入 2 ~ 8 個字符
          </span>

          <label for="update-username" class="header__form-label"
            >修改密碼</label
          >
          <input
            type="password"
            class="header__form-input"
            name="update-new-password"
            id="update-new-password"
            v-model.trim="userDetail.updateForm.newPassword"
            placeholder="僅可輸入英數"
            @change="validateUpdate('newPassword')"
            :class="
              validate.errors.includes('newPassword') ||
              validate.errors.includes('same')
                ? 'unvalidated-outline'
                : ''
            "
          />
          <span
            v-if="validate.errors.includes('newPassword')"
            class="unvalidated-text"
          >
            僅可輸入英數
          </span>
          <span
            v-if="validate.errors.includes('same')"
            class="unvalidated-text"
          >
            修改密碼不得與舊密碼相同
          </span>

          <label for="update-username" class="header__form-label">舊密碼</label>
          <input
            type="password"
            class="header__form-input"
            name="update-old-password"
            id="update-old-password"
            v-model.trim="userDetail.updateForm.oldPassword"
            placeholder="於需要修改密碼時輸入"
            @change="validateUpdate('oldPassword')"
            :class="
              validate.errors.includes('oldPassword')
                ? 'unvalidated-outline'
                : ''
            "
          />
          <span
            v-if="validate.errors.includes('oldPassword')"
            class="unvalidated-text"
          >
            於需要修改密碼時輸入
          </span>
        </form>
      </template>
      <template #footer>
        <button class="dialog__btn-submit" @click="submitAlert">儲存</button>
      </template>
    </ModalDialog>
  </transition>

  <!-- ModalDialog 2: 確認框 -->
  <transition name="opacity" mode="out-in">
    <ModalDialog
      v-if="userDetail.alert"
      @close-dialog="toggleDialog('alert', false)"
      @click.stop
    >
      <template #title>提醒</template>
      <template #main>確定送出修改？</template>
      <template #footer>
        <button class="dialog__btn-submit" @click="submitUpdate">確定</button>
      </template>
    </ModalDialog>
  </transition>
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
    background-color: var(--e-color-primary);
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
        background-color: var(--e-color-primary);
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
        background-color: var(--e-color-primary);
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
    background-color: var(--e-color-primary-light);
    border-radius: 1.25rem;
    border: 1px solid var(--e-color-primary-dark);
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
  }
  &__form {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    &-label {
      letter-spacing: 0.05em;
      padding: 0 0.5rem;
      &:not(:first-of-type) {
        margin-top: 1.5rem;
      }
    }
    &-input {
      padding: 0.3rem 0.5rem;
      font-size: 1.2rem;
      letter-spacing: 0.05em;
      background-color: var(--e-color-primary-lighter);
      border: 1px solid var(--e-color-primary-dark);
      border-radius: 0.5rem;
      outline: none;
      &:focus {
        background-color: var(--e-color-white);
        border: 1px solid var(--e-color-primary-darker);
      }
      &::placeholder {
        color: var(--e-color-primary-darker);
      }
    }
    button {
      align-self: flex-end;
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      font-size: 1.2rem;
      color: var(--e-color-primary-lighter);
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

  &__dialog__form {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
    width: 20rem;
    font-size: 1.2rem;
    &-avatar {
      position: relative;
      display: flex;
      justify-content: center;
      img,
      button,
      label {
        height: 10rem;
        width: 10rem;
        object-fit: cover;
        border: 1px solid var(--e-color-primary-dark);
        border-radius: 50rem;
      }
      button,
      label {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        color: transparent;
        background-color: transparent;
        transition: all 0.2s ease-in-out;
        svg {
          height: 2.5rem;
          width: 2.5rem;
        }
        &:hover {
          color: var(--e-color-primary-light);
          background-color: rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
      }
      input[type="file"] {
        display: none;
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
      background-color: var(--e-color-primary);
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
