<template>
  <div class="px-10 py-5 bg-white bg-opacity-0 hover:bg-opacity-5 transition-colors" @click="expanded = !expanded">
    <div class="flex text-gray-200 items-center">
      <p class="mr-auto text-base font-mono">{{ title }}</p>
      <ChevronDownIcon class="transform transition-transform" :class="expanded ? 'rotate-180': ''"/>
    </div>
    <ExpandTransition>
      <div v-show="expanded">
        <Markdown
          :source="contents"
          :breaks="true"
          :highlight="highlightConf"
          id="md"
          class="m-5 text-gray-200 leading-relaxed text-base"/>
      </div>
    </ExpandTransition>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import ExpandTransition from 'components/ui/transitions/Expand.vue'
import { ChevronDownIcon } from '@zhuowenli/vue-feather-icons'
import Markdown from 'vue3-markdown-it'

export default defineComponent({
  components: {
    ExpandTransition,
    ChevronDownIcon,
    Markdown
  },
  props: {
    title: {
      type: String,
      required: true
    },
    contents: {
      type: String,
      required: true
    }
  },
  setup() {
    let expanded = ref(false)
    return {
      expanded,
      highlightConf: {
        auto: true,
        inline: true
      }
    }
  }
})
</script>

<style lang="postcss">
#md h1, #md h2 {
  @apply font-bold leading-10 !important
}

#md h1 {
  @apply text-2xl !important
}

#md h2 {
  @apply text-xl !important
}

.hljs-meta {
  @apply text-gray-400
}

#md pre {
  @apply border-gray-200 rounded-lg border p-3 border-opacity-5
}

#md td, #md th {
  @apply border border-gray-200 border-opacity-5 px-5 py-2
}

#md a {
  @apply underline text-gray-300 hover:text-gray-200 transition-colors !important
}

#md code {
  @apply px-2
}
</style>
