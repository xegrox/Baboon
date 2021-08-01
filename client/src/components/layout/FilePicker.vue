<template>
  <Modal ref="modal" width="50%" height="70%" dismissible>
    <div class="w-full h-full flex flex-col gap-5">
      <TextInput placeholder="Path" v-model="activePath"/>
      <FileTreeWrapper
        class="w-full h-full overflow-auto"
        :rootPath="rootPath"
        @activeRelPathUpdate="updateActivePath($event)"
        :allowFolder="pickFolder"
        :allowFile="pickFile"/>
      <div class="flex flex-none gap-4 items-center justify-end">
        <TextButton @click="close()">
          <p class="pr-4 pl-4">Cancel</p>
        </TextButton>
        <ProgressButton :loading="loading" :disabled="activePath === ''" @click="checkPath" indeterminate>
          <p class="pr-4 pl-4">Open</p>
        </ProgressButton>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Modal from 'components/ui/Modal.vue'
import { FileInfoType } from 'api/sftp'
import FileTreeWrapper from 'components/ui/FileTreeWrapper.vue'
import TextInput from 'components/ui/TextInput.vue'
import ProgressButton from 'components/ui/ProgressButton.vue'
import TextButton from 'components/ui/TextButton.vue'
import { AlertType } from 'types/AlertItem.interface'
import p from 'path-browserify'

export default defineComponent({
  components: {
    Modal,
    FileTreeWrapper,
    TextInput,
    ProgressButton,
    TextButton
  },
  props: {
    rootPath: {
      type: String,
      required: true
    },
    pickFolder: {
      type: Boolean,
      default: false
    },
    pickFile:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activePath: this.rootPath,
      loading: false
    }
  },
  methods: {
    updateActivePath(relPath: string) {
      this.activePath = p.join(this.rootPath, relPath)
    },
    open() { (this.$refs.modal as any).open() },
    close() { (this.$refs.modal as any).close() },
    alertError(title: string, content?: string) {
      this.$accessor.alerts.add({
        type: AlertType.Error,
        title: title,
        content: content
      })
    },
    checkPath() {
      this.loading = true
      this.$sftp.exists(this.activePath).then((exists) => {
        if (!exists) {
          this.alertError('Path does not exists')
          return
        } else {
          if (this.pickFolder && !this.pickFile && exists !== FileInfoType.dir) {
            this.alertError('Path does not lead to a folder')
            return
          } else if (this.pickFile && !this.pickFolder && exists !== FileInfoType.file) {
            this.alertError('Path does not lead to a file')
            return
          }
          (this.$refs.modal as any).close()
          this.$emit('done', this.activePath)
        }
      }).catch(() => {}).finally(() => this.loading = false)
    }
  }
})
</script>
