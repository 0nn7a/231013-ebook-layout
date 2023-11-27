<script setup>
// BREADCRUMB - 麵包屑
const route = useRoute();
const breadcrumb = reactive({
  main: "",
  sub: [],
});
watch(
  () => route.name,
  (val) => {
    breadcrumb.main = val;
    if (val === "Task") {
      breadcrumb.sub = ["Card", "Comment"];
    } else {
      breadcrumb.sub = [];
    }
  },
  { immediate: true }
);

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

// THEME - 切換主題
const themeType = ref(true);
const toggleTheme = () => {
  themeType.value = !themeType.value;
  const root = document.querySelector("html");
  if (root.getAttribute("theme") === "dark") {
    root.setAttribute("theme", "");
  } else {
    root.setAttribute("theme", "dark");
  }
};
</script>

<template>
  <header class="header__container">
    <div class="header__breadcrumb">
      <div class="header__breadcrumb-main">
        <SvgIcon icon-name="Header-Square" />
        <p>{{ breadcrumb.main }}</p>
      </div>
      <div v-if="breadcrumb.sub.length > 0" class="header__breadcrumb__footer">
        <span class="header__breadcrumb__footer-line"></span>
        <div
          v-for="item in breadcrumb.sub"
          :key="item"
          class="header__breadcrumb-sub"
        >
          <SvgIcon icon-name="Header-Square" />
          <p>{{ item }}</p>
        </div>
      </div>
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

    <a
      class="header__theme__btn"
      href="javascript:void(0)"
      @click="toggleTheme"
    >
      <div
        :class="themeType ? 'header__theme__box' : 'header__theme__box-dark'"
      >
        <SvgIcon
          icon-name="Theme-Sun"
          :icon-style="{ height: '2rem', width: '2rem', fill: 'currentColor' }"
        />
        <SvgIcon
          icon-name="Theme-Moon"
          :icon-style="{ height: '2rem', width: '2rem', fill: 'currentColor' }"
        />
      </div>
    </a>
  </header>
</template>

<style lang="scss" scoped>
.header {
  &__container {
    display: flex;
    justify-content: end;
    align-items: flex-start;
    gap: 0.5rem;
    width: 100%;
    padding: 2rem;
  }

  &__breadcrumb {
    align-self: stretch;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    &-main {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease-in-out;
      svg {
        height: 1.5rem;
        width: 1.5rem;
        color: var(--e-color-primary-dark);
      }
      p {
        font-size: 1.8rem;
        font-weight: 600;
      }
      &:hover {
        opacity: 0.5;
        cursor: pointer;
      }
    }
    &__footer {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-left: 0.75rem;
      &-line {
        height: 1.25rem;
        width: 0.75rem;
        border-left: 1px solid var(--e-color-shadow);
        border-bottom: 1px solid var(--e-color-shadow);
        border-bottom-left-radius: 0.5rem;
        transform: translateY(-30%);
      }
    }
    &-sub {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: var(--e-color-subtext);
      transition: all 0.25s ease-in-out;
      &:not(:first-of-type) {
        &::before {
          content: "/";
          margin-right: 0.75rem;
          color: var(--e-color-shadow);
        }
      }
      svg {
        height: 1rem;
        width: 1rem;
      }
      p {
        font-size: 1.2rem;
      }
      &:hover {
        opacity: 0.5;
        cursor: pointer;
      }
    }
  }

  &__notice {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.75rem;
    color: var(--e-color-subtext);
    border-radius: 1.5rem;
    transition: all 0.25s ease-in-out;
    &:hover {
      background-color: var(--e-color-primary-light);
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

  &__theme {
    &__btn {
      overflow: hidden;
      width: 4.5rem;
      padding: 0.75rem 0.65rem;
      color: var(--e-color-primary);
      background-color: var(--e-color-primary-light);
      border-radius: 1.5rem;
      transition: 0.25s all ease-out;
      &:hover {
        color: var(--e-color-primary-dark);
      }
    }
    &__box,
    &__box-dark {
      display: flex;
      align-items: center;
      padding: 0.75rem 0.65rem;
      height: 3rem;
      width: 8rem;
      gap: 2rem;
      transition: 0.35s all ease-out;
    }
    &__box-dark {
      transform: translateX(-4rem);
    }
  }
}
</style>
