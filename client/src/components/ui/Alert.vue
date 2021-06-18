<template>
  <div class="rounded-lg bg-gray-600 border-2 border-gray-600 bg-opacity-50 hover:bg-opacity-75 hover:transition-colors p-3">
    <div class="flex items-center gap-3">
      <div class="flex-none w-6 h-6 relative">
        <TransitionFade>
          <div v-if="count > 1" class="flex justify-center items-center top-0 right-0 absolute rounded-full p-1 text-xs w-full h-full" :class="`bg-${ui.color}-200`">
            <p class="font-bold">{{ count <= 9 ? count : '9+' }}</p>
          </div>
          <component v-else :is="ui.icon" class="relative h-full w-full p-px" :class="`text-${ui.color}-200`"/>
        </TransitionFade>
      </div>
      <p class="truncate opacity-75 flex-grow h-full whitespace-no-wrap" :class="`text-${ui.color}-100`">{{ title }}</p>
      <ChevronDownIcon v-if="content !== undefined" @click="isExpanded = !isExpanded" class="text-gray-400 h-3 flex-none hover:text-white transition-all transform" :class="{ 'rotate-180': isExpanded }"/>
      <XIcon @click="$emit('close')" class="text-gray-400 h-3 flex-none hover:text-white transition-colors"/>
    </div>
    <div id="expand" :style="[ !isExpanded ? { 'height': 0 } : '']" class="overflow-hidden transition-all">
      <div class="h-4"/>
      <p v-if="content !== undefined" class="rounded-lg bg-opacity-25 font-mono text-xs p-2 h-32 whitespace-pre overflow-auto" :class="`text-${ui.color}-100 bg-${ui.color}-200`">
        {{ content }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { SlashIcon, CheckIcon, HelpCircleIcon, XIcon, ChevronDownIcon } from '@zhuowenli/vue-feather-icons'
import { AlertType } from 'types/AlertItem.interface'
import TransitionFade from 'components/ui/transitions/Fade.vue'

interface Ui {
  color: string,
  icon: string
}

export default defineComponent({
  components: {
    SlashIcon,
    CheckIcon,
    HelpCircleIcon,
    XIcon,
    ChevronDownIcon,
    TransitionFade
  },
  props: {
    type: {
      type: String,
      required: true,
      validator: (val: string) => {
        return Object.values<string>(AlertType).includes(val)
      }
    },
    title: {
      type: String,
      required: true
    },
    content: String,
    count: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isExpanded: false
    }
  },
  computed: {
    ui(): Ui {
      switch(this.type) {
        case AlertType.Error:
          return {
            color: 'red',
            icon: 'SlashIcon'
          }
        case AlertType.Success:
          return {
            color: 'green',
            icon: 'CheckIcon'
          }
        default:
          return {
            color: 'gray',
            icon: 'HelpCircleIcon'
          }
      }
    },
  }
})
</script>

<style scoped>
#expand {
  --height: 9rem;
  --top-margin: 0.75rem;
  height: var(--height);
}

#expand > div {
  height: var(--top-margin);
}

#expand > p {
  height: calc(var(--height) - var(--top-margin))
}
</style>
