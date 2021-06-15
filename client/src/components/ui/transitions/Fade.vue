<template>
  <transition name="fade" class="transition-opacity" mode="out-in">
    <slot/>
  </transition>
</template>

<style scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
