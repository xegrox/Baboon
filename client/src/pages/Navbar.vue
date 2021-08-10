<template>
  <div id="nav" class="px-10 z-10 flex fixed w-screen items-center">
    <FadeTransition>
      <a
        v-show="showTryButton"
        href="/app"
        class="font-mono text-gray-300 border border-gray-600 py-2 px-4 rounded-lg bg-opacity-20 bg-gray-600 hover:bg-opacity-100 !transition">Try now</a>
    </FadeTransition>
    <div class="ml-auto"/>
    <div
      class="py-4 px-5 bg-white bg-opacity-0 text-gray-200 font-mono hover:text-white hover:bg-opacity-5 transition flex items-center gap-3 relative"
      v-for="[name, link] in pages"
      @mouseover="name === 'HOME' ? showDropdown = true : ''"
      @mouseleave="showDropdown = false"
      :key="name">
      <a
        :href="link">
        {{ name }}
        <hr v-if="name === active">
      </a>
      <ChevronDownIcon v-if="name ==='HOME'" class=""/>
      <ExpandTransition>
        <div
          v-show="name ==='HOME' && showDropdown"
          class="absolute right-0 bottom-0 flex flex-col z-20 bg-white bg-opacity-5 w-40 text-right translate-y-full transform"
          @mouseover="showDropdown = true"
          @mouseleave="showDropdown = false">
          <a
            v-for="[name, link] in nav"
            :key="name"
            class="font-mono text-gray-300 py-4 px-5 bg-white bg-opacity-0 hover:text-white hover:bg-opacity-5 transition"
            :href="link">
            {{ name }}
          </a>
        </div>
      </ExpandTransition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ExpandTransition from 'components/ui/transitions/Expand.vue'
import FadeTransition from 'components/ui/transitions/Fade.vue'
import { ChevronDownIcon } from '@zhuowenli/vue-feather-icons'

export default defineComponent({
  components: {
    ExpandTransition,
    ChevronDownIcon,
    FadeTransition
  },
  props: {
    active: {
      type: String,
      required: true
    },
    showTryButton: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    let nav = new Map<string, string>()
    nav.set('FEATURES', '/#features')
    nav.set('SCREENSHOTS', '/#screenshots')
    nav.set('CONTACT', '/#contact')
    let pages = new Map<string, string>()
    pages.set('HOME', '/#hero')
    pages.set('FAQ', '/faq')
    pages.set('FEEDBACK', '/feedback')
    return {
      nav,
      pages,
      showDropdown: ref(false)
    }
  }
})
</script>
