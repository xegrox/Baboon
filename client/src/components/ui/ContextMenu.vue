<template>
  <teleport to="body">
    <FadeTransition>
      <div v-if="show" class="absolute w-full h-full left-0 bottom-0 z-20" @click="close" @contextmenu.prevent="close">
        <div ref="menu" class="bg-gray-900 border-gray-800 border-2 rounded-lg absolute overflow-hidden" :style="{ 'left': pos.x + 'px', 'top': pos.y + 'px' }">
          <slot/>
        </div>
      </div>
    </FadeTransition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FadeTransition from 'components/ui/transitions/Fade.vue'

export default defineComponent({
  components: {
    FadeTransition
  },
  data() {
    return {
      show: false,
      pos: {
        x: 0,
        y: 0
      }
    }
  },
  methods: {
    open() { this.show = true },
    close() { this.show = false },
    setPos(x: number, y: number) { this.pos = { x, y } }
  }
})
</script>

<style scoped>
</style>
