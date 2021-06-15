<template>
  <div>
    <FilePicker v-model:show="showFilePicker" rootName="/" rootPath="/" @done="showFilePicker = false" pickFolder/>
    <div class="h-full bg-gray-800 flex flex-col items-center pt-7">
      <div class="rounded-full bg-gray-700 group hover:bg-gray-600 transition-colors" @click="showFilePicker = true">
        <PlusIcon class="text-gray-500 p-4 h-12 w-12 group-hover:text-gray-400 transition-colors"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { PlusIcon } from '@zhuowenli/vue-feather-icons'
import FilePicker from '../../FilePicker.vue'

export default defineComponent({
  components: {
    PlusIcon,
    FilePicker
  },
  data() {
    return {
      showFilePicker: false
    }
  }
})
</script>

<style scoped>
</style>
