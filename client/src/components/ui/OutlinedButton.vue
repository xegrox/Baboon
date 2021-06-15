<template>
  <button :class="{ 'bg-gray-400 text-gray-800': active || hover, 'opacity-25': disabled }" :disabled="disabled" @mouseover="hover = true" @mouseleave="hover = false" class="leading-snug text-gray-200 border-2 appearance-none focus:outline-none border-gray-400 rounded-lg p-3 transition-all relative">
    <slot/>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hover: false
    }
  }
})
</script>

<style scoped>
</style>
