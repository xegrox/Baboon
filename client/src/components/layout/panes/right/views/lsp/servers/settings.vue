<template>
  <Modal ref="modal" :dismissible="true" width="45rem">
    <div class="flex flex-col gap-6">
      <TextInput prefix="ws://" placeholder="Url" :modelValue="url" :disabled="true" class="mb-4"/>
      <div>
        <p class="text-gray-200">Path Prefix</p>
        <p class="text-gray-400 leading-tight">
          Path appended before the actual sftp path when sending requests to the lsp server. Useful if the sftp user is running on a different root path.
        </p>
        <TextInput class="mt-2" placeholder="Path" v-model="config.pathPrefix"/>
      </div>
      <div>
        <p class="text-gray-200">File Match Regex</p>
        <p class="text-gray-400 leading-tight">
          Regex used to test the filename of an open file.
          If a match is found, this lsp is used for that file.
          If multiple lsps matches the same file, the first lsp in the list will be used.</p>
        <div class="flex gap-2 mt-2">
          <TextInput class="w-2/3" placeholder="Pattern" v-model="config.fileMatch.pattern"/>
          <TextInput class="w-1/3" placeholder="Flags" v-model="config.fileMatch.flags"/>
        </div>
        <ExpandTransition>
          <ErrorLabel :errorMsg="errors.fileMatchRegex"/>
        </ExpandTransition>
      </div>
      <div class="flex gap-4">
        <OutlinedButton class="mr-auto" @click="remove()">
          <p class="pr-4 pl-4">Remove</p>
        </OutlinedButton>
        <TextButton @click="close()">
          <p class="pr-4 pl-4">Cancel</p>
        </TextButton>
        <OutlinedButton @click="save()">
          <p class="pr-4 pl-4">Save</p>
        </OutlinedButton>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Modal from 'components/ui/Modal.vue'
import TextInput from 'components/ui/TextInput.vue'
import { LSPEntry } from 'types/LSPEntry.class'
import TextButton from 'components/ui/TextButton.vue'
import OutlinedButton from 'components/ui/OutlinedButton.vue'
import ErrorLabel from 'components/ui/ErrorLabel.vue'
import ExpandTransition from 'components/ui/transitions/Expand.vue'

export default defineComponent({
  components: {
    Modal,
    TextInput,
    TextButton,
    OutlinedButton,
    ErrorLabel,
    ExpandTransition
  },
  props: {
    url: {
      type: String,
      required: true
    },
    lspEntry: {
      type: Object as PropType<LSPEntry>,
      required: true
    },
  },
  data() {
    return {
      config: JSON.parse(JSON.stringify({ ...this.lspEntry.config })),
      loading: false,
      errors: {
        fileMatchRegex: ''
      }
    }
  },
  methods: {
    open() {
      (this.$refs.modal as any).open()
      this.config = JSON.parse(JSON.stringify({ ...this.lspEntry.config }))
      this.errors.fileMatchRegex = ''
    },
    close() { (this.$refs.modal as any).close() },
    save() {
      try {
        new RegExp(this.config.fileMatch.pattern, this.config.fileMatch.flags)
      } catch(e) {
        this.errors.fileMatchRegex = (e as Error).message
        return
      }
      this.lspEntry.setConfig(this.config)
      this.close()
    },
    remove() {
      this.$accessor.projects.all.forEach((project) => {
        project.lspServerUrls.delete(this.url)
      })
      this.lspEntry.client.close()
    }
  }
})
</script>

<style lang="css" scoped>
</style>
