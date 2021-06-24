<template>
  <div>
    <Modal ref="modal" width="40%" dismissible>
      <TextInput v-model="value" :placeholder="placeholder" :disabled="disabled" @input="setError('')" @enter="$emit('enter', value)" autofocus/>
      <ExpandTransition>
        <div v-if="errorMsg !== ''">
          <p class="mt-4 text-red-200">{{ errorMsg }}</p>
        </div>
      </ExpandTransition>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Modal from 'components/ui/Modal.vue'
import TextInput from 'components/ui/TextInput.vue'
import ExpandTransition from 'components/ui/transitions/Expand.vue'

export default defineComponent({
  components: {
    Modal,
    TextInput,
    ExpandTransition
  },
  props: {
    placeholder: String
  },
  data() {
    return {
      show: false,
      errorMsg: '',
      value: '',
      disabled: false
    }
  },
  methods: {
    open() { (this.$refs.modal as any).open() },
    close() { (this.$refs.modal as any).close() },
    setValue(value: string) { this.value = value },
    setError(msg: string) { this.errorMsg = msg },
    setDisabled(b: boolean) { this.disabled = b }
  }
})
</script>

<style lang="css" scoped>
</style>
