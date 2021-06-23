<template>
  <div>
    <teleport to="body">
      <FadeTransition>
        <div v-show="show" class="absolute top-0 left-0 w-full h-full z-20 bg-black bg-opacity-50" :class="bindClass" @click.self="(dismissible) ? close() : ''">
          <div :style="{ 'width': width, 'height': height }" class="p-8 bg-gray-800 shadow-md hover:shadow-lg rounded-2xl absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-10">
            <slot/>
          </div>
        </div>
      </FadeTransition>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FadeTransition from './transitions/Fade.vue'

export default defineComponent({
  components: {
    FadeTransition
  },
  props: {
    dismissible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
    bindClass: String
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    open() { this.show = true },
    close() { this.show = false }
  }
})
</script>
