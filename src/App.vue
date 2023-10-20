<script setup>
import { useUserStore } from "@/stores/user.js";
const userStore = useUserStore();

userStore.initUserInfo();
</script>

<template>
  <SideBar />
  <HeaderBar />
  <router-view />
</template>

<style lang="scss" scoped></style>
