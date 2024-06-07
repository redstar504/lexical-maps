import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  BaseSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  NodeKey,
} from 'lexical'
import { PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from 'react'
import { mergeRegister } from '@lexical/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $isMapNode } from './MapNode.tsx'

type MapComponentProps = {
  dataURI: string
  nodeKey: NodeKey
  width: 'inherit' | number
  height: 'inherit' | number
}

type MapImagePosition = {
  startX: number
  startY: number
  startWidth: number
  startHeight: number | 'inherit'
  currentWidth: number | 'inherit'
  currentHeight: number
  aspectRatio: number
  direction: number
}

const initialMapImagePosition = {
  startX: 0,
  startY: 0,
  startWidth: 0,
  startHeight: 0,
  currentWidth: 0,
  currentHeight: 0,
  aspectRatio: 0,
  direction: 0,
}

const Direction = {
  east: 1 << 0,
  north: 1 << 3,
  south: 1 << 1,
  west: 1 << 2,
}

function MapComponent({
                        dataURI,
                        nodeKey,
                        width,
                        height,
                      }: MapComponentProps) {
  const [editor] = useLexicalComposerContext()
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey)
  const imageRef = useRef<HTMLImageElement>(null)
  const [selection, setSelection] = useState<BaseSelection | null>()
  const [isResizing, _setIsResizing] = useState<boolean>(false)
  const isFocused = isResizing || isSelected
  const posRef = useRef<MapImagePosition>(initialMapImagePosition)

  const onClick = useCallback((payload: MouseEvent) => {
    if (payload.target === imageRef.current) {
      clearSelection()
      setSelected(true)
      return true
    }

    return false
  }, [clearSelection, setSelected])

  const $onDelete = useCallback((e: KeyboardEvent) => {
    if (!isSelected || !$isNodeSelection($getSelection())) return false
    e.preventDefault()
    const node = $getNodeByKey(nodeKey)
    if (!node || !$isMapNode(node)) return false
    node.remove()
    return true
  }, [isSelected, nodeKey])

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
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        $onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        $onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === imageRef.current) {
            // TODO This is just a temporary workaround for FF to behave like other browsers.
            // Ideally, this handles drag & drop too (and all browsers).
            event.preventDefault()
            return true
          }
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
    )

    return () => {
      isMounted = false
      unregister()
    }
  }, [
    $onDelete,
    editor,
    onClick,
    clearSelection,
    isSelected,
    nodeKey,
    setSelected
  ])

  const handlePointerDown = (dir: number) => (e: ReactPointerEvent) => {
    const img = imageRef.current
    if (!editor.isEditable() || !img) return
    e.preventDefault()

    const pos = posRef.current
    const { width, height } = img.getBoundingClientRect()

    // todo: add zoom support
    pos.startWidth = width
    pos.startHeight = height
    pos.aspectRatio = width / height
    pos.currentWidth = width
    pos.currentHeight = height
    pos.startX = e.clientX
    pos.startY = e.clientY
    pos.direction = dir

    addEventListener('pointermove', handlePointerMove)
    addEventListener('pointerup', handlePointerUp)
  }

  const handlePointerMove = (e: PointerEvent) => {
    const img = imageRef.current
    const pos = posRef.current

    if (!img) return

    let diff = pos.startX - e.clientX
    diff = pos.direction & Direction.east ? -diff : diff

    const width = pos.startWidth + diff
    const height = width / pos.aspectRatio

    pos.currentWidth = width
    pos.currentHeight = height

    img.style.width = `${width}px`
    img.style.height = `${height}px`
  }

  const handlePointerUp = () => {
    const { currentWidth, currentHeight } = posRef.current
    posRef.current = initialMapImagePosition
    removeEventListener('pointermove', handlePointerMove)
    removeEventListener('pointerup', handlePointerUp)

    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if (!node || !$isMapNode(node)) return
      node.setWidthAndHeight(currentWidth, currentHeight)
    })
  }

  const isDraggable = isSelected && $isNodeSelection(selection)

  return (
    <div draggable="true">
      <img
        src={dataURI}
        alt="map"
        ref={imageRef}
        className={isSelected ? 'draggable selected map' : 'map'}
        style={{
          width,
          height,
        }}
        draggable="false"
      />
      {$isNodeSelection(selection) && isFocused && (
        <>
          <b className="nw handle" onPointerDown={handlePointerDown(Direction.north | Direction.west)}></b>
          <b className="ne handle" onPointerDown={handlePointerDown(Direction.north | Direction.east)}></b>
          <b className="se handle" onPointerDown={handlePointerDown(Direction.south | Direction.east)}></b>
          <b className="sw handle" onPointerDown={handlePointerDown(Direction.south | Direction.west)}></b>
        </>
      )}
    </div>
  )
}

export default MapComponent