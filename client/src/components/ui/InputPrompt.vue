<template>
  <div>
    <Modal ref="modal" width="40%" dismissible>
      <TextInput v-model="value" :placeholder="placeholder" @enter="$emit('enter', value)" autofocus/>
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Modal from 'components/ui/Modal.vue'
import TextInput from 'components/ui/TextInput.vue'

export default defineComponent({
  components: {
    Modal,
    TextInput,
  },
  props: {
    placeholder: String
  },
  data() {
    return {
      show: false,
      errorMsg: '',
      value: ''
    }
  },
  methods: {
    open() { (this.$refs.modal as any).open() },
    close() { (this.$refs.modal as any).close() },
    setValue(value: string) { this.value = value },
    setError(msg: string) { this.errorMsg = msg }
  }
})
</script>

<style lang="css" scoped>
</style>
