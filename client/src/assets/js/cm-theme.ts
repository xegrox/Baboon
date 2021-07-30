import {EditorView} from "@codemirror/view"
import { Extension } from '@codemirror/state'
import {HighlightStyle, tags as t, tags} from "@codemirror/highlight"

const lineHeight = '1.5rem'
const duration = '0.2s'

// Colors
const background = '#1a1a1a',
  lightBackground = '#202020',
  selection = '#2a2a2a',
  foreground = '#eeeeee',
  comment = '#aaaaaa',
  keyword = '#bbbbbb'

export const cmTheme = EditorView.theme({
  "&": {
    fontSize: '0.875rem',
    color: foreground,
    backgroundColor: background
  },

  // Line
  ".cm-line": {
    lineHeight: lineHeight,
    transition: `background-color ${duration}`
  },
  ".cm-activeLine": {
    backgroundColor: lightBackground,
  },

  // Gutter
  ".cm-gutterElement": {
    lineHeight: lineHeight,
    transitionProperty: 'background-color, color',
    transitionDuration: duration,
    paddingLeft: '1rem !important',
    paddingRight: '0.5rem !important'
  },
  ".cm-activeLineGutter": {
    color: foreground,
    backgroundColor: lightBackground
  },
  ".cm-gutters": {
    backgroundColor: background,
    color: '#272b2b',
    border: "none",
  },

  ".cm-content": {
    caretColor: foreground
  },

  "&.cm-focused .cm-cursor": {borderLeftColor: foreground},
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": {backgroundColor: selection},

  ".cm-searchMatch": {
    backgroundColor: "#72a1ff59",
    outline: "1px solid #457dff"
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: "#6199ff2f"
  },
  ".cm-selectionMatch": {backgroundColor: "#aafe661a"},

  ".cm-matchingBracket, .cm-nonmatchingBracket": {
    backgroundColor: selection,
    outline: "1px solid #515a6b"
  },

  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: "#ddd"
  },

  ".cm-tooltip": {
    border: "1px solid #181a1f",
    backgroundColor: background
  },
  ".cm-tooltip-autocomplete": {
    "& > ul > li[aria-selected]": {
      backgroundColor: selection,
      color: foreground
    }
  }
}, {dark: true})

export const cmHighlight = HighlightStyle.define([
  { tag: [tags.comment],
    color: comment },
  { tag: [tags.keyword],
    color: keyword },
  { tag: [tags.propertyName],
    fontWeight: "bold" },
  { tag: [tags.link],
    textDecoration: "underline" },
  { tag: [tags.bool, tags.self],
    fontStyle: "italic" }
])

export const theme: Extension = [cmTheme, cmHighlight]
