<script setup>
import { useMegStore } from "@/stores/meg.js";
const megStore = useMegStore();

let countdown = null;
const updateCountdown = () => {
  if (megStore.messages.length <= 0) {
    clearInterval(countdown);
    countdown = null;
  }
  megStore.messages.forEach((item, index, arr) => {
    if (item.time <= 0) {
      arr.splice(index, 1);
    } else {
      item.time -= 1;
    }
  });
};
watch(
  () => megStore.messages.length,
  (val) => {
    if (val > 0 && !countdown) {
      countdown = setInterval(updateCountdown, 1000);
    }
  },
  { immediate: true }
);
</script>

<template>
  <transition-group
    tag="div"
    name="move-up"
    mode="out-in"
    class="meg__container"
  >
    <div
      v-for="(item, index) in megStore.messages"
      :key="index"
      class="meg__card"
    >
      <SvgIcon :icon-name="item.icon" />
      <p>{{ item.meg }}</p>
    </div>
  </transition-group>
</template>

<style lang="scss" scoped>
.meg {
  &__container {
    position: absolute;
    top: 4rem;
    left: 50%;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    transform: translateX(-50%);
  }
  &__card {
    display: flex;
    align-items: center;
    gap: 1rem;
    max-width: 30rem;
    padding: 1.5rem 2rem;
    background-color: var(--e-color-bg);
    border: 1px solid var(--e-color-primary);
    box-shadow: 0 0 1rem var(--e-color-shadow);
    border-radius: 1rem;
    svg {
      flex-shrink: 0;
      height: 2rem;
      width: 2rem;
    }
    p {
      font-size: 1.2rem;
      text-align: justify;
      letter-spacing: 0.05em;
      word-break: break-word;
    }
  }
}
</style>
