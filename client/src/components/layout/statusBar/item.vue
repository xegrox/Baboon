<template>
  <p class="text-gray-400 h-3 text-xs font-mono hover:text-gray-200 transition-colors">
    {{ text }}
  </p>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    text: {
      required: true,
      type: String
    }
  }
})
</script>

<style lang="css" scoped>
</style>
