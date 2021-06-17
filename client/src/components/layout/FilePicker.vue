<template>
  <Modal :show="show" width="50%" height="70%">
    <div class="w-full h-full flex flex-col gap-5">
      <TextInput placeholder="Path" v-model="path"/>
      <FileTree class="w-full h-full overflow-auto" :item="rootItem" v-model:activePath="path" :allowFolder="pickFolder" :allowFile="pickFile"/>
      <div class="flex flex-none gap-4 items-center justify-end">
        <TextButton @click="$emit('update:show', false)">
          <p class="pr-4 pl-4">Cancel</p>
        </TextButton>
        <ProgressButton :loading="loading" @click="checkPath" indeterminate>
          <p class="pr-4 pl-4">Open</p>
        </ProgressButton>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Modal from '../ui/Modal.vue'
import { FileInfoType } from '../../api/sftp'
import FileTree from '../ui/FileTree.vue'
import { TreeBranch } from '../../types/TreeNode.interface'
import TextInput from '../ui/TextInput.vue'
import ProgressButton from '../ui/ProgressButton.vue'
import TextButton from '../ui/TextButton.vue'
import { AlertType } from '../../types/AlertItem.interface'

export default defineComponent({
  components: {
    Modal,
    FileTree,
    TextInput,
    ProgressButton,
    TextButton
  },
  props: {
    rootPath: {
      type: String,
      required: true
    },
    rootName: {
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
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      path: '',
      rootItem: <TreeBranch>{
        path: this.rootPath,
        name: this.rootName,
        children: [],
        expanded: false
      },
      loading: false
    }
  },
  methods: {
    alertError(title: string, content?: string) {
      this.$accessor.alerts.add({
        type: AlertType.Error,
        title: title,
        content: content
      })
    },
    checkPath() {
      let ctx = this
      ctx.loading = true
      this.$sftp.exists(this.path).exec({
        onSuccess(data) {
          if (!data) {
            ctx.alertError('Path does not exists')
            return
          } else {
            if (ctx.pickFolder && !ctx.pickFile && data !== FileInfoType.dir) {
              ctx.alertError('Path does not lead to a folder')
              return
            } else if (ctx.pickFile && !ctx.pickFolder && data !== FileInfoType.file) {
              ctx.alertError('Path does not lead to a file')
              return
            }
            ctx.$emit('done', ctx.path)
          }
        },
        onError: (msg) => ctx.alertError('Error checking if path exists', msg)
      })
      ctx.loading = false
    }
  }
})
</script>

<style scoped>
</style>
