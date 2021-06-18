<template>
  <div class="rounded-full w-14 h-14 p-1 group transition-all border-0 border-transparent duration-100" :class="{ 'border-2 border-gray-600': active }" >
    <div class="flex items-center justify-center rounded-full w-full h-full bg-gray-700 group-hover:bg-gray-600 transition-colors">
      <div class="text-gray-300 group-hover:text-white transition-colors">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    active: {
      type: Boolean,
      default: false
    }
  }
})
</script>
