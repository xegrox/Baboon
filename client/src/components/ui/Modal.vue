<template>
  <FadeTransition>
    <div v-show="show" class="absolute w-full h-full z-30 bg-black bg-opacity-50">
      <div :style="{ 'width': width, 'height': height }" class="p-8 bg-gray-800 shadow-md hover:shadow-lg rounded-2xl absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-10">
        <slot/>
      </div>
    </div>
  </FadeTransition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FadeTransition from './transitions/Fade.vue'

export default defineComponent({
  components: {
    FadeTransition
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    }
  }
})
</script>
