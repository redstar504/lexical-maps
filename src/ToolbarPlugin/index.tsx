import { BiBold, BiItalic, BiUnderline } from 'react-icons/bi'
import { FaGlobeAmericas } from 'react-icons/fa'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { FORMAT_TEXT_COMMAND } from 'lexical'

type ToolbarPluginPropsType = {
  onOpenMapModal: () => void
}

export default function ToolbarPlugin({ onOpenMapModal }: ToolbarPluginPropsType) {
  const [editor] = useLexicalComposerContext()

  return (
    <div id="toolbarWrapper">
      <ul>
        <li>
          <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}><BiBold /></button>
        </li>
        <li>
          <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}><BiItalic /></button>
        </li>
        <li>
          <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}><BiUnderline /></button>
        </li>
        <li>
          <button onClick={onOpenMapModal}><FaGlobeAmericas /></button>
        </li>
      </ul>
    </div>
  )
}