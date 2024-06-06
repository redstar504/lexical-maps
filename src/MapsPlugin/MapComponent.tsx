import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { $getSelection, $isNodeSelection, BaseSelection, CLICK_COMMAND, COMMAND_PRIORITY_LOW, NodeKey } from 'lexical'
import { useCallback, useEffect, useRef, useState } from 'react'
import { mergeRegister } from '@lexical/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

type MapComponentProps = {
  dataURI: string
  nodeKey: NodeKey
}

function MapComponent({ dataURI, nodeKey }: MapComponentProps) {
  const [editor] = useLexicalComposerContext()
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey)
  const imageRef = useRef<HTMLImageElement>(null)
  const [selection, setSelection] = useState<BaseSelection | null>()
  const [isResizing, _setIsResizing] = useState<boolean>(false)
  const isFocused = isResizing || isSelected

  const onClick = useCallback((payload: MouseEvent) => {
    if (payload.target === imageRef.current) {
      clearSelection()
      setSelected(true)
      return true
    }

    return false
  }, [clearSelection, setSelected])

  useEffect(() => {
    let isMounted = true
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) {
          setSelection(editorState.read($getSelection))
        }
      }),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        onClick,
        COMMAND_PRIORITY_LOW,
      ),
    )

    return () => {
      isMounted = false
      unregister()
    }
  }, [editor, onClick])

  return (
    <>
      <img
        src={dataURI}
        alt="map"
        ref={imageRef}
        className={isSelected ? 'selected map' : 'map'}
      />
      {$isNodeSelection(selection) && isFocused && (
        <p>Foo</p>
      )}
    </>
  )
}

export default MapComponent