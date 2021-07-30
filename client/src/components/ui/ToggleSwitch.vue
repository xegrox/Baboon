<template>
  <div class="bg-gray-600 w-10 h-5 inline-block rounded-full cursor-pointer p-1" @click="emitChange()">
    <div class="h-full w-full relative">
      <div
        class="h-3 w-3 rounded-full absolute transition-all transform"
        :class="{ 'right-full translate-x-full bg-gray-400': !modelValue, 'right-0 translate-x-0 bg-gray-200': modelValue }" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    emitChange() {
      this.$emit('update:modelValue', !this.modelValue)
    }
  }
})
</script>

<style lang="css" scoped>
</style>
