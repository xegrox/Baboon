<template>
  <ExpandTransition>
    <div v-if="errorMsg !== ''" class="pl-1">
      <p class="text-red-200 text-sm py-1">{{ errorMsg }}</p>
    </div>
  </ExpandTransition>
</template>

<script>
import { defineComponent } from 'vue'
import ExpandTransition from 'components/ui/transitions/Expand.vue'

export default defineComponent({
  components: {
    ExpandTransition
  },
  props: {
    errorMsg: {
      type: String,
      required: true
    }
  }
})
</script>
