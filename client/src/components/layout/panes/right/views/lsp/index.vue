<template>
  <div class="flex flex-col">
    <Servers class="flex-1 m-6"/>
    <div class="flex-none flex h-46 px-6 border-t border-gray-700 pb-6">
      <Footer class="flex-1 self-end"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Servers from './servers/index.vue'
import Footer from './footer.vue'

export default defineComponent({
  components: {
    Servers,
    Footer
  }
})
</script>
