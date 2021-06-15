<template>
  <TransitionFade>
    <div v-if="show" class="absolute h-full w-full top-0 bottom-0 transition-opacity bg-black opacity-50 z-50 pointer-events-none pointer-events-auto"/>
  </TransitionFade>
</template>

<script>
import { defineComponent } from 'vue'
import TransitionFade from './transitions/Fade.vue'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  components: {
    TransitionFade
  }
})
</script>
