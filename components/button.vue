<template>
  <button class="h-[2.5em]">
    <slot/>
  </button>
</template>

<style lang="scss" scoped>
button {
  box-shadow: inset 0 -4px rgb(0 0 0 / 25%), inset 0 4px rgb(255 255 255 / 35%), inset -4px 0 rgb(255 255 255 / 35%), inset 4px 0 rgb(0 0 0 / 25%), 0 4px 0 0 rgb(0 0 0 / 15%);
  text-shadow: 0 2px 0 rgb(0 0 0 / 25%);
  transition: .7s cubic-bezier(0, .8, .26, .99);

  &:hover {
    box-shadow: inset 0 -4px rgb(0 0 0 / 35%), inset 0 4px rgb(255 255 255 / 25%), inset -4px 0 rgb(255 255 255 / 25%), inset 4px 0 rgb(0 0 0 / 35%), 0 4px 0 0 rgb(0 0 0 / 15%);
  }

  &:disabled {
    background: #6b6562;
    box-shadow: none;
    text-shadow: none;
  }

  &.primary {
    background-color: #3c8527;
    color: #fff;

    &:hover {
      background-color: #313131;
    }
  }

  &.secondary {
    background-color: #757575;
  }
}
</style>
