<template>
  <div class="relative">
    <div :class="{ 'opacity-75': disabled }" class="rounded-lg w-full px-3 pt-5 pb-2 bg-gray-700 text-gray-200 transition-opacity">
      <div class="flex w-full gap-1">
        <p v-if="prefix" class="flex-none text-white text-opacity-70">{{ prefix }}</p>
        <input
          ref="input"
          :type="type !== 'number' ? type : ''"
          @keypress="isNumber"
          @paste.prevent
          @input="updateValue"
          @keyup.enter="$emit('enter')"
          :value="modelValue"
          :disabled="disabled"
          autocomplete="off"
          :class="{ filled: prefix !== undefined || modelValue !== '' }"
          class="appearance-none bg-transparent outline-none flex-1"/>
        <label class="absolute mb-0 -mt-2 pt-4 pl-3 leading-tighter text-gray-400 text-base mt-2 cursor-text pointer-events-none">{{ placeholder }}</label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {  defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    prefix: String,
    placeholder: String,
    type: String,
    disabled: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (this.autofocus) (this.$refs.input as HTMLInputElement).focus()
  },
  methods: {
    updateValue(event: Event) {
      this.$emit('update:modelValue', (event.target as HTMLInputElement).value)
    },
    focus() {
      (this.$refs.input as HTMLInputElement).focus()
    },
    isNumber(event: KeyboardEvent) {
      if (this.type == 'number') {
        if (!/[0-9]+/.test(event.key)) return event.preventDefault()
      }
    }
  }
})
</script>

<style scoped>
input:focus+label,
input:active+label,
input.filled+label {
    font-size: 0.75rem;
    transition: all 0.2s ease-out;
    top: -0.3rem;
}

label {
    transition: all 0.2s ease-out;
    top: 0.4rem;
  	left: 0;
}
</style>
