<template>
  <div class="flex gap-10 p-3 w-full bg-white bg-opacity-0 hover:bg-opacity-5 transition-colors">
    <p class="flex-1 text-gray-200 text-sm">{{ text }}</p>
    <p class="text-gray-400 text-sm">{{ shortcut }}</p>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true
    },
    shortcut: String
  }
})
</script>

<style lang="css" scoped>
</style>
