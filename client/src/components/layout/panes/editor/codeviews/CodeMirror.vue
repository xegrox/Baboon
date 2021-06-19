<template>
  <div ref="editor"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { EditorView, keymap, highlightActiveLine } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/gutter'
import { history, historyKeymap } from '@codemirror/history'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets'
import { defaultTabBinding } from '@codemirror/commands'
import { indentOnInput } from '@codemirror/language'
import { theme } from 'assets/js/cm-theme'
import { javascript } from '@codemirror/lang-javascript'

export default defineComponent({
  data() {
    return {
      view: new EditorView({
        state: EditorState.create({
          doc: `module.exports = function(data: string) {
  var xml, tmp;
  if (!data || typeof data !== 'string') {
		return null;
  }
  try {
    if (window.DOMParser) {
      tmp = new DOMParser();
      xml = tmp.parseFromString(data, "text/html");
    } else { // IE
      xml = new ActiveXObject("Microsoft.XMLDOM");
      xml.async = false;
      xml.loadXML(data);
    }
  } catch (e) {
    xml = undefined;
  }
  if (!xml || !xml.documentElement || xml.getElementsByTagName(PARSE_ERROR).length) {
    jQuery.error("Invalid XML: " + data);
  }
  return xml;
};

const parser: Object = document.createElement('a');
parser.href = "http://example.com:3000/pathname/?search=test#hash";
parser.hostname; // => "example.com"`,
          extensions: [
            lineNumbers(),
            highlightActiveLineGutter(),
            highlightActiveLine(),
            history(),
            closeBrackets(),
            indentOnInput(),
            keymap.of([
              defaultTabBinding,
              ...historyKeymap,
              ...closeBracketsKeymap
            ]),
            theme,
            javascript({
              typescript: true
            })
          ]
        })
      })
    }
  },
  mounted() {
    (this.$refs.editor as HTMLElement).appendChild(this.view.dom)
  },
})
</script>

<style>
.cm-wrap {
  height: 100%;
  padding-top: 0.25rem;
}
</style>
