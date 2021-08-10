<template>
  <Navbar active="FEEDBACK"/>
  <div class="h-screen flex bg-gray-800">
    <div class="h-screen w-1/3 flex flex-col text-gray-200 items-center justify-center gap-24">
      <p class="font-mono text-4xl">Feedback</p>
      <div id="feedback_icon" class="start w-64"/>
    </div>
    <div class="h-screen w-2/3 px-20 py-32">
      <form id="feedback_form" class="h-full bg-gray-700 rounded-lg shadow-2xl p-12 text-gray-300 text-xl flex flex-col font-mono gap-10" action="/feedback_result">
        <div>
          <p class="ml-1 mb-3">Title</p>
          <input name="title" v-model.trim="title" class="w-full rounded-lg bg-gray-600 h-12 outline-none px-5"/>
        </div>
        <div class="flex-1 flex flex-col">
          <p class="ml-1 mb-3">Message</p>
          <textarea name="contents" v-model.trim="message" class="flex-1 w-full rounded-lg bg-gray-600 h-12 outline-none p-5 resize-none"/>
        </div>
        <ProgressButton class="self-end" :loading="sending" @click="sending = true" :disabled="title === '' || message === ''">
          <div class="flex items-center gap-3 px-1">
            <SendIcon class="w-5 h-5"/>
            <p>Send</p>
          </div>
        </ProgressButton>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import Navbar from './Navbar.vue'
import Vivus from 'vivus'
import ProgressButton from 'components/ui/ProgressButton.vue'
import { SendIcon } from '@zhuowenli/vue-feather-icons'

export default defineComponent({
  components: {
    Navbar,
    ProgressButton,
    SendIcon
  },
  setup() {
    let title = ref('')
    let message = ref('')
    let sending = ref(false)
    onMounted(() => {
      let anim = new Vivus('feedback_icon', {
        duration: 200,
        file: 'feedback.svg',
        start: 'manual',
        animTimingFunction: Vivus.EASE_OUT
      })
      setTimeout(() => {
        document.getElementById('feedback_icon')?.classList.remove('start')
        anim.play(1)
      }, 500)
    })
    return {
      sending,
      title,
      message
    }
  }
})
</script>

<style>
#feedback_icon.start * {
  fill-opacity: 0 !important;
}

#feedback_icon * {
  transition: fill-opacity 3s;
}
</style>
