<template>
  <transition @enter="enter" @after-enter="afterEnter" @leave="leave" class="transition-all overflow-hidden">
    <slot/>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    afterEnter(el: Element) {
      var s = (el as HTMLElement).style
      s.height = "auto"
      s.opacity = '1'
    },
    enter(el: Element) {
      // Hide elem so that it does not show up
      // Set position absolute so that it does not affect layout
      // Then calc auto height
      var s = (el as HTMLElement).style
      s.position = 'absolute'
      s.visibility = 'hidden'
      s.height = 'auto'

      const height = getComputedStyle(el).height

      s.removeProperty('position')
      s.removeProperty('visibility')
      s.height = '0'

      // Make sure height: 0 is set before transition
      requestAnimationFrame(() => {
        s.height = height
        s.opacity = '1'
      })
    },
    leave(el: Element) {
      const height = getComputedStyle(el).height

      var s = (el as HTMLElement).style
      s.height = height

      requestAnimationFrame(() => {
        s.height = '0'
        s.opacity = '0'
      });
    },
  }
})
</script>
