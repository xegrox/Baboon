<template>
  <div>
    <Modal ref="modal" width="40%" dismissible>
      <TextInput v-model="value" :placeholder="placeholder" :disabled="disabled" @input="setError('')" @enter="$emit('enter', value)" autofocus/>
      <ErrorLabel :errorMsg="errorMsg"/>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Modal from 'components/ui/Modal.vue'
import TextInput from 'components/ui/TextInput.vue'
import ErrorLabel from 'components/ui/ErrorLabel.vue'

export default defineComponent({
  components: {
    Modal,
    TextInput,
    ErrorLabel
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
