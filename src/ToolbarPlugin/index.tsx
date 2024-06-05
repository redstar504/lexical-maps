import { BiBold, BiItalic, BiUnderline } from 'react-icons/bi'
import { FaGlobeAmericas } from 'react-icons/fa'

export default function ToolbarPlugin() {
  return (
    <div id="toolbarWrapper">
      <ul>
        <li>
          <button><BiBold /></button>
        </li>
        <li>
          <button><BiItalic /></button>
        </li>
        <li>
          <button><BiUnderline /></button>
        </li>
        <li>
          <button><FaGlobeAmericas /></button>
        </li>
      </ul>
    </div>
  )
}