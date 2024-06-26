import {
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
} from "@blocknote/react"
import { insertCommandsItem, insertAlert } from "./insertCommandItem"
import {
  BlockNoteEditor,
  BlockNoteSchema,
  defaultBlockSpecs,
  insertOrUpdateBlock,
} from "@blocknote/core"
import { ChecklistItem } from "./checkToggle"
import { Alert } from "./Alert"
import { MdChecklist } from "react-icons/md"
import { Font } from "./Font"
import { insertVideoBlock } from "./Services"

// customization

export const getCustomSlashMenuItems = (
  editor: BlockNoteEditor
): DefaultReactSuggestionItem[] => [
 
  ...getDefaultReactSlashMenuItems(editor).filter(
    (item) => item.title.toLowerCase() !== "heading 1"
  ),
  insertAlert(editor),
  // insertChecklistItem(editor)
  insertCommandsItem(editor),
  insertVideoBlock(editor)
]

export const theme = {
  colors: {
    editor: {
      text: "#333333",
      background: "transparent",
    },
    borderRadius: 5,
    fontFamily: "Impact, Charcoal",
  },
}

export const placeholders = {
  bulletListItem: "Enter list item...",
  default: "Your Story...",
  heading: "Enter a heading...",
  image: "Click to add an image...",
  numberedListItem: "Enter numbered item...",
  // this glitches block to duplicate
  // paragraph: "Enter paragraph...",
}

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    // custom
    alert: Alert,
    checklistItem: ChecklistItem,
    // checklistItem: checklistItem,
  },
})
// each one is a empty paragraph - can't be fully empty due to placeholder
export const defaultBlockAmount = [
  {
    type: "paragraph",
    content: [
      {
        type: "text",
        text: "",
        styles: {},
      },
    ],
  },
  {
    type: "paragraph",
    content: [{ type: "text", text: " ", styles: {} }],
  },
  {
    type: "paragraph",
    content: [{ type: "text", text: " ", styles: {} }],
  },
  {
    type: "paragraph",
    content: [{ type: "text", text: " ", styles: {} }],
  },
]

