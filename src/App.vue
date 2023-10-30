<script setup>
import { useUserStore } from "@/stores/user.js";
import { useMegStore } from "@/stores/meg.js";
const userStore = useUserStore();
const megStore = useMegStore();

userStore.initUserInfo();
</script>

<template>
  <SideBar />
  <HeaderBar />
  <router-view />
  <AlertMeg />
</template>

<style lang="scss" scoped></style>
