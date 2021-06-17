<template>
  <div class="group flex flex-1 items-center bg-black text-gray-400 truncate hover:bg-gray-800 transition-colors" :class="{ 'bg-gray-800': isActive }">
    <div class="flex truncate px-4 w-full items-center relative">
      <p class="flex-1 truncate text-center text-sm mx-12 font-mono group-hover:text-white transition-colors" :class="{ 'text-white': isActive }">{{ name }}</p>
      <XIcon class="flex-none w-4 h-4 hover:text-white transition absolute right-0 mr-6 ml-3 transform scale-0 group-hover:scale-100" v-on:click="$emit('close')"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { XIcon } from '@zhuowenli/vue-feather-icons'

export default defineComponent({
  components: {
    XIcon
  },
  props: {
    name: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      required: true
    }
  }
})
</script>
