<script setup>
const route = useRoute();

const bgBlock = ref(null);
const icons = reactive({
  active: null,
  list: ["Dashboard", "Task", "Course", "Calendar", "Set"],
});
const toggleActive = async (id, index) => {
  if (icons.active !== id) {
    await router.push({ name: id });
  }
  if (route.name === id) {
    icons.active = id;
    let topVal = index * 55;
    bgBlock.value.style.top = topVal + "px";
    if (icons.list.includes(id)) {
      bgBlock.value.style.display = "block";
    } else {
      bgBlock.value.style.display = "none";
    }
  }
};
watch(
  () => route.name,
  (val) => {
    toggleActive(
      val,
      icons.list.findIndex((item) => item === val)
    );
  }
);

onMounted(() => {
  toggleActive(
    route.name,
    icons.list.findIndex((item) => item === route.name)
  );
});
</script>

<template>
  <input class="icon__menu" type="checkbox" name="menu" id="menu" checked />
  <label for="menu">
    <SvgIcon icon-name="Sidebar-Arrow"></SvgIcon>
  </label>

  <nav class="sidebar__container">
    <UserInfo />

    <ul class="sidebar__list">
      <span ref="bgBlock" class="sidebar__bg"></span>
      <SvgIcon
        v-for="(item, index) in icons.list"
        :key="item"
        class="icon__item"
        :class="icons.active === item ? 'icon__item--active' : ''"
        :icon-name="
          icons.active === item
            ? `Sidebar-${item}-Solid`
            : `Sidebar-${item}-Line`
        "
        @click="toggleActive(item, index)"
      ></SvgIcon>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.icon {
  &__menu {
    display: none;
    & ~ label {
      position: absolute;
      z-index: 50;
      bottom: 2rem;
      left: 2rem;
      width: 3rem;
      height: 3rem;
      padding: 0.75rem;
      color: var(--e-color-primary);
      background-color: var(--e-color-primary-lighter);
      border-radius: 5rem;
      transition: all 0.35s ease-in-out;
      &:hover {
        opacity: 0.6;
        cursor: pointer;
      }
      svg {
        height: 100%;
        width: 100%;
        transform: rotate(180deg);
        transition: all 0.35s ease-in-out;
      }
    }
    &:checked {
      & ~ label {
        background-color: var(--e-color-bg);
        svg {
          transform: rotate(0deg);
        }
      }
      & ~ .sidebar__container {
        max-width: 100%;
        padding: 2rem 1.5rem;
        overflow: visible;
        transform: translateX(0);
      }
    }
  }

  &__item {
    position: relative;
    z-index: 1;
    padding: 0.9rem;
    width: 4rem;
    height: 4rem;
    transition: all 0.2s ease-in-out;
    &:hover {
      color: var(--e-color-primary);
      opacity: 0.6;
      cursor: pointer;
    }
  }
  &__item--active {
    color: var(--e-color-primary);
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
    padding: 2rem 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;
    background-color: var(--e-color-primary-lighter);
    transform: translateX(-100%);
    transition: all 0.35s cubic-bezier(0.11, 0.29, 0.44, 1);
  }

  &__list {
    flex-grow: 2;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  &__bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 4rem;
    width: 4rem;
    background-color: var(--e-color-primary-light);
    border-radius: 1.2rem;
    transition: all 0.25s cubic-bezier(0, 0.05, 0.73, 1.27);
  }
}
</style>
