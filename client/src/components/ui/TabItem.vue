<template>
  <div class="group flex flex-1 items-center text-gray-400 truncate hover:bg-gray-800 transition-colors bg-transparent" :class="{ 'bg-gray-900': !isActive }">
    <div class="flex truncate px-4 w-full items-center relative">
      <p class="flex-1 truncate text-center text-sm mx-12 font-mono group-hover:text-white transition-colors" :class="{ 'text-white': isActive }">{{ name }}</p>
      <div class="flex-none absolute right-0 mr-6">
        <FadeTransition>
          <div v-if="isSaving" class="w-4 h-4 rounded-full right-0 border-t-2 border-white border-opacity-30 animate-spin"/>
          <div v-else class="relative h-4 w-4">
            <div class="w-2 h-2 mt-1 mr-1 top-0 right-0 rounded-full absolute bg-white bg-opacity-10 border-white border border-opacity-50 transform !transition group-hover:scale-0" :class="[isModified ? 'opacity-100': 'opacity-0']"/>
            <XIcon class="w-4 h-4 top-0 right-0 hover:text-white absolute transition transform scale-0 group-hover:scale-100" v-on:click="$emit('close')"/>
          </div>
        </FadeTransition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { XIcon } from '@zhuowenli/vue-feather-icons'
import FadeTransition from 'components/ui/transitions/Fade.vue'

export default defineComponent({
  components: {
    XIcon,
    FadeTransition
  },
  props: {
    name: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      required: true
    },
    isModified: {
      type: Boolean,
      default: false
    },
    isSaving: {
      type: Boolean,
      default: false
    }
  }
})
</script>
