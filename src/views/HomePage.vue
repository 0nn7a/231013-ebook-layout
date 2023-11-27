<script setup>
import { useUserStore } from "@/stores/user.js";
const userStore = useUserStore();
</script>

<template>
  <section class="home__container">
    <h1 v-if="userStore.userInfo.username" class="heading-2">Dashboard</h1>
    <h1 v-else class="heading-2">尚未登入暫無法查看</h1>

    <section class="test">
      <div>
        <h2>--e-color-text</h2>
        <h2>--e-color-subtext</h2>
        <h2>--e-color-shadow</h2>
        <br />
        <h2>--e-color-primary-lighter</h2>
        <h2>--e-color-primary-light</h2>
        <h2>--e-color-primary</h2>

        <br />
        <h2>--e-color-key-1</h2>
        <h2>--e-color-key-1-dark</h2>
        <h2>--e-color-key-2</h2>
        <h2>--e-color-key-2-dark</h2>
      </div>
    </section>
  </section>
</template>

<style lang="scss" scoped>
.home {
  &__container {
  }
}

button {
  padding: 1rem;
  background-color: var(--e-color-subtext);
  color: var(--e-color-bg);
  border: none;
  border-radius: 10rem;
  cursor: pointer;
  transition: all 0.25s ease-in-out;
  &:hover {
    background-color: var(--e-color-shadow);
  }
}
.test {
  padding: 5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--e-color-bg);

  div {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
  }

  h2 {
    &:nth-of-type(1) {
      color: var(--e-color-text);
    }
    &:nth-of-type(2) {
      color: var(--e-color-subtext);
    }
    &:nth-of-type(3) {
      color: var(--e-color-shadow);
    }
    &:nth-of-type(4) {
      color: var(--e-color-primary-lighter);
    }
    &:nth-of-type(5) {
      color: var(--e-color-primary-light);
    }
    &:nth-of-type(6) {
      color: var(--e-color-primary);
    }
    &:nth-of-type(7) {
      color: var(--e-color-key-1);
    }
    &:nth-of-type(8) {
      color: var(--e-color-key-1-dark);
    }
    &:nth-of-type(9) {
      color: var(--e-color-key-2);
    }
    &:nth-of-type(10) {
      color: var(--e-color-key-2-dark);
    }
  }
}
</style>
