<script setup>
const emit = defineEmits(["close-dialog"]);
const closeDialog = () => {
  emit("close-dialog", false);
};
</script>

<template>
  <div class="dialog__bg" @click="closeDialog">
    <div class="dialog__container" @click.stop>
      <header class="dialog__header">
        <p v-if="$slots.title" class="dialog__header__title">
          <slot name="title"></slot>
        </p>
        <SvgIcon
          icon-name="Dialog-Close"
          class="dialog__header__close"
          @click="closeDialog"
        ></SvgIcon>
      </header>
      <div class="dialog__main">
        <slot name="main"></slot>
      </div>
      <footer class="dialog__footer">
        <button class="dialog__btn-cancel" @click="closeDialog">取消</button>
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<style lang="scss">
.dialog {
  &__bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
  }
  &__container {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 20rem;
    max-width: 40rem;
    display: flex;
    flex-direction: column;
    background-color: var(--e-color-white);
    border: 1px solid var(--e-color-primary-darker);
    border-radius: 1.5rem;
    transform: translate(-50%, -50%);
  }

  &__header {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    background-color: var(--e-color-primary-lighter);
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    border-bottom: 1px solid var(--e-color-primary-dark);
    &__title {
      font-size: 1.2rem;
      font-weight: 450;
      color: var(--e-color-text);
      letter-spacing: 0.04em;
    }
    &__close {
      height: 1rem;
      width: 1rem;
      margin-left: auto;
      transition: all 0.2s ease-in-out;
      &:hover {
        cursor: pointer;
        color: var(--e-color-subtext);
      }
    }
  }
  &__main {
    padding: 2rem 1.5rem;
    font-size: 1.2rem;
  }
  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 0 1.5rem 1.5rem;
  }

  &__btn {
    &-cancel {
      @extend %dialogBtn;
      color: var(--e-color-text);
      background-color: var(--e-color-primary);
      &:hover {
        background-color: var(--e-color-primary-dark);
      }
    }
    &-submit {
      @extend %dialogBtn;
      color: var(--e-color-primary-light);
      background-color: var(--e-color-key-1);
      &:hover {
        background-color: var(--e-color-key-1-dark);
      }
    }
  }
}

%dialogBtn {
  padding: 0.8rem 1rem;
  font-size: 1.2rem;
  line-height: 1;
  letter-spacing: 0.05em;
  border: none;
  border-radius: 50rem;
  transition: all 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
  }
}
</style>
