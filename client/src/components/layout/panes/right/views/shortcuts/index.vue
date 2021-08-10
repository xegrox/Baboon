<template>
  <div class="p-2">
    <table class="table-fixed text-gray-200 border-0">
      <thead>
        <th class="w-1/2">Shortcut Keys</th>
        <th class="w-1/2">Description</th>
      </thead>
      <tbody>
        <tr>
          <td>Ctrl-S</td>
          <td>Save</td>
        </tr>
        <tr>
          <td>Alt-W</td>
          <td>Close Tab</td>
        </tr>
        <tr>
          <td>Alt-&lt;num&gt;</td>
          <td>Switch to Tab &lt;num&gt;</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="postcss" scoped>
td {
  @apply border p-2 border-gray-600
}

th {
  @apply p-2
}
</style>
