<script setup>
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
onMounted(() => {});
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

    <div class="header__user">
      <img src="../assets/images/user.jpg" alt="user photo" />
      <p>Nauieuimi</p>
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

  &__notice {
    justify-self: stretch;
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
</style>
