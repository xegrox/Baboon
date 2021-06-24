<template>
  <Modal ref="modal" dismissible>
    <p class="text-gray-200 text-xl">{{ message }}</p>
    <div class="flex mt-8 gap-4 items-center justify-end">
      <TextButton @click="$refs.modal.close()">
        <p class="pr-4 pl-4">Cancel</p>
      </TextButton>
      <ProgressButton :loading="loading" @click="$emit('positive')" indeterminate>
        <p class="pr-4 pl-4">{{ actionText }}</p>
      </ProgressButton>
    </div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Modal from 'components/ui/Modal.vue'
import TextButton from 'components/ui/TextButton.vue'
import ProgressButton from 'components/ui/ProgressButton.vue'

export default defineComponent({
  components: {
    Modal,
    TextButton,
    ProgressButton
  },
  props: {
    message: {
      type: String,
      required: true
    },
    actionText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    open() { (this.$refs.modal as any).open() },
    close() { (this.$refs.modal as any).close() },
    setLoading(b: boolean) { this.loading = b }
  }
})
</script>

<style lang="css" scoped>
</style>
