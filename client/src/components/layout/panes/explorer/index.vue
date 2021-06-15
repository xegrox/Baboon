<template>
  <div id="tree" class="bg-gray-900 h-full">
    <div class="flex h-12 align-bottom items-center pl-5 pr-5">
      <p id="tree_title" class="align-text-bottom text-gray-400 font-mono text-sm" @click="test">File Explorer</p>
    </div>
    <div class="flex flex-col">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
  },
  methods: {
    test() {
      this.$sftp.list('/').exec({
        onSuccess: (data) => {
          console.log(data)
        },
        onError: (msg) => {
          console.log(msg)
        }
      })
    }
  }
})
</script>

<style scoped>
</style>
