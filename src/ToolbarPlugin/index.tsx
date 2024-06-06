import { BiBold, BiItalic, BiUnderline } from 'react-icons/bi'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import { useCallback, useEffect, useState } from 'react'
import { FcGlobe } from 'react-icons/fc'

type ToolbarPluginPropsType = {
  onOpenMapModal: () => void
}

export default function ToolbarPlugin({ onOpenMapModal }: ToolbarPluginPropsType) {
  const [editor] = useLexicalComposerContext()
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
    }
  }, [])

  useEffect(() => {
    return editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
      $updateToolbar()
      return true
    }, COMMAND_PRIORITY_CRITICAL)
  }, [$updateToolbar, editor])

  useEffect(() => {
    editor.registerUpdateListener(({editorState}) => {
      editorState.read($updateToolbar)
    })
  }, [$updateToolbar, editor])

  return (
    <div id="toolbarWrapper">
      <ul>
        <li className={isBold ? 'active' : ''}>
          <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}><BiBold /></button>
        </li>
        <li className={isItalic ? 'active' : ''}>
          <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}><BiItalic /></button>
        </li>
        <li className={isUnderline ? 'active' : ''}>
          <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}><BiUnderline /></button>
        </li>
        <li>
          <button onClick={onOpenMapModal}><FcGlobe /></button>
        </li>
      </ul>
    </div>
  )
}