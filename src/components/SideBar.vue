<script setup>
const route = useRoute();

const bgBlock = ref(null);
const icons = reactive({
  active: null,
  list: ["Home", "Books", "Bookmark", "Set"],
});
const toggleActive = (id, index) => {
  if (icons.active !== id) {
    icons.active = id;
    let topVal = index * 50;
    bgBlock.value.style.top = topVal + "px";
    router.push({ name: id });
  }
};

onMounted(() => {
  toggleActive(
    route.name,
    icons.list.findIndex((item) => item === route.name)
  );
});
</script>

<template>
  <label class="icon__menu" for="menu">
    <SvgIcon icon-name="Sidebar-Menu"></SvgIcon>
  </label>
  <input type="checkbox" name="menu" id="menu" checked />
  <nav class="sidebar__container">
    <div class="icon__logo">
      <SvgIcon icon-name="Logo"></SvgIcon>
    </div>
    <ul class="sidebar__list">
      <span ref="bgBlock" class="sidebar__bg"></span>
      <SvgIcon
        v-for="(item, index) in icons.list"
        :key="item"
        class="icon__item"
        :class="icons.active === item ? 'icon__item--active' : ''"
        :icon-name="`Sidebar-${item}`"
        @click="toggleActive(item, index)"
      ></SvgIcon>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.icon {
  &__menu {
    position: fixed;
    z-index: 50;
    bottom: 2.5rem;
    left: 2rem;
    padding: 0.5rem;
    width: 4rem;
    height: 4rem;
    background-color: var(--e-color-theme-dark);
    border-radius: 5rem;
    transition: all 0.3s ease-in-out;
    &:hover {
      filter: brightness(0.95);
      cursor: pointer;
    }
    svg {
      height: 100%;
      width: 100%;
    }
    & ~ input[type="checkbox"] {
      display: none;
    }
    & ~ input[type="checkbox"]:checked ~ .sidebar__container {
      max-width: 100%;
      padding: 2.5rem 2rem;
      transform: translateX(0);
    }
  }

  &__logo {
    flex-grow: 1;
    svg {
      height: 4rem;
      width: 4rem;
    }
  }

  &__item {
    position: relative;
    z-index: 1;
    padding: 0.6rem;
    width: 4rem;
    height: 4rem;
    transition: all 0.2s ease-in-out;
    &:hover {
      opacity: 0.6;
      cursor: pointer;
    }
  }
  &__item--active {
    color: var(--e-color-theme-light);
    &:hover {
      opacity: 1;
    }
  }
}
.sidebar {
  &__container {
    grid-row: 1 / -1;
    grid-column: 1 / span 1;
    max-width: 0;
    padding: 2.5rem 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--e-color-theme);
    transform: translateX(-100%);
    transition: all 0.35s cubic-bezier(0.11, 0.29, 0.44, 1);
  }

  &__list {
    flex-grow: 2;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  &__bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 4rem;
    width: 4rem;
    background-color: var(--e-color-key-1);
    border-radius: 1.75rem;
    transition: all 0.25s cubic-bezier(0, 0.05, 0.73, 1.27);
  }
}
</style>
