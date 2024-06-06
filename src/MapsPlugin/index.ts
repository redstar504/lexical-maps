import { JSX, useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createMapNode, MapNode } from './MapNode.tsx'
import { COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from 'lexical'
import { $insertNodeToNearestRoot } from '@lexical/utils'

export const INSERT_MAP_COMMAND: LexicalCommand<string> = createCommand(
  'INSERT_MAP_COMMAND'
)

export default function MapsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([MapNode])) {
      throw new Error('MapsPlugin: MapNode not registered on your editor.')
    }

    return editor.registerCommand<string>(INSERT_MAP_COMMAND, payload => {
      const mapNode = $createMapNode(payload)
      $insertNodeToNearestRoot(mapNode)
      return true
    }, COMMAND_PRIORITY_EDITOR)
  }, [editor])

  return null
}