<template>
  <OutlinedButton :active="loading" :class="{ 'bg-gray-500': indeterminate && loading, 'pointer-events-none': loading}" :disabled="disabled">
    <p :class="{ 'opacity-0': loading }" class="transition-opacity"><slot/></p>
    <div v-if="indeterminate" :class="{ 'opacity-100': loading }" class="opacity-0 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity">
      <div class="w-5 h-5 rounded-full animate-spin bg-transparent border-t-2 border-gray-800"/>
    </div>
  </OutlinedButton>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import OutlinedButton from './OutlinedButton.vue'

export default defineComponent({
  components: {
    OutlinedButton
  },
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    indeterminate: {
      type: Boolean,
      default: false
    },
    progress: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style lang="css" scoped>
</style>
