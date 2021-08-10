<template>
  <Navbar/>
  <div class="h-screen flex flex-col text-gray-200 items-center gap-16 font-mono py-56 overflow-auto">
    <p class="text-6xl">Thank You!</p>
    <p class="text-base text-gray-400">We appreciate your feedback!</p>
    <div class="bg-gray-700 shadow-2xl rounded-lg w-1/2 p-6 flex flex-col gap-8">
      <p class="rounded-lg font-bold text-xl">{{ title }}</p>
      <p class="flex-1 rounded-lg whitespace-pre-wrap">{{ contents }}</p>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Navbar from './Navbar.vue'

export default defineComponent({
  components: {
    Navbar
  },
  setup() {
    let uri = window.location.search.substring(1)
    let params = new URLSearchParams(uri)
    let title = params.get('title') ?? ''
    let contents = params.get('contents') ?? ''
    console.log(contents)
    return {
      title,
      contents
    }
  }
})
</script>
