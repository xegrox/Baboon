<template>
  <div class="group relative" @mouseenter="hover = true" @mouseleave="hover = false">
    <FadeTransition>
      <div v-show="active && hover" class="rounded-full bg-gray-900 bg-opacity-60 text-gray-400 hover:text-red-400 p-1 absolute right-0 top-0 !transition-all" @click="$emit('close')">
        <XIcon class="h-3 w-3 transition-colors"/>
      </div>
    </FadeTransition>
    <div class="rounded-full w-14 h-14 p-1 transition-all border-0 border-transparent duration-100" :class="{ 'border-2 border-gray-600': active }" >
      <div class="flex items-center justify-center rounded-full w-full h-full bg-gray-700 group-hover:bg-gray-600 transition-colors">
        <div class="text-gray-300 group-hover:text-white transition-colors">
          <slot/>
        </div>
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
  data() {
    return {
      hover: false
    }
  },
  props: {
    active: {
      type: Boolean,
      default: false
    }
  }
})
</script>
