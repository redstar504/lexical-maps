import { JSX, useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createMapNode, $isMapNode, MapNode, MapPayload } from './MapNode.tsx'
import {
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  LexicalCommand,
  LexicalEditor,
} from 'lexical'
import { $wrapNodeInElement, CAN_USE_DOM, mergeRegister } from '@lexical/utils'

declare global {
  interface DragEvent {
    rangeOffset?: number
    rangeParent?: Node
  }
}

const getDOMSelection = (targetWindow: Window | null): Selection | null => {
  return CAN_USE_DOM ? (targetWindow || window).getSelection() : null
}

export const INSERT_MAP_COMMAND: LexicalCommand<MapPayload> = createCommand(
  'INSERT_MAP_COMMAND',
)

const TRANSPARENT_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
const img = document.createElement('img')
img.src = TRANSPARENT_IMAGE

export function $getMapNodeInSelection(): MapNode | null {
  const selection = $getSelection()
  if (!$isNodeSelection(selection)) return null
  const nodes = selection.getNodes()
  const node = nodes[0]
  return $isMapNode(node) ? node : null
}

function canDropMap(event: DragEvent): boolean {
  const target = event.target
  return !!(
    target &&
    target instanceof HTMLElement &&
    !target.closest('code, span.editor_map') &&
    target.parentElement &&
    target.parentElement.closest('div#contentEditable')
  )
}

function $onDragStart(event: DragEvent) {
  const node = $getMapNodeInSelection()
  if (!node) return false

  const dt = event.dataTransfer
  if (!dt) return false

  dt.setData('text/plain', '_')
  dt.setDragImage(img, 0, 0)
  dt.setData(
    'application/x-lexical-drag',
    JSON.stringify({
      data: {
        width: node.__width,
        height: node.__height,
        key: node.getKey(),
        dataURI: node.__dataURI,
      },
      type: 'map',
    }),
  )

  return true
}

function $onDragOver(event: DragEvent): boolean {
  const node = $getMapNodeInSelection()
  if (!node) return false
  if (!canDropMap(event)) event.preventDefault()
  return true
}

function $onDrop(event: DragEvent, editor: LexicalEditor) {
  const node = $getMapNodeInSelection()
  if (!node) return false

  const dragData = event.dataTransfer?.getData('application/x-lexical-drag')
  if (!dragData) return false

  const { type, data } = JSON.parse(dragData)
  if (type !== 'map') return false

  event.preventDefault()
  if (!canDropMap(event)) return true

  // todo: try and understand what the following code does
  let range
  const target = event.target as null | Element | Document
  const targetWindow = target == null
    ? null
    : target.nodeType === 9
      ? (target as Document).defaultView
      : (target as Element).ownerDocument.defaultView

  const domSelection = getDOMSelection(targetWindow)

  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY)
  } else if (event.rangeParent && domSelection !== null) {
    domSelection.collapse(event.rangeParent, event.rangeOffset || 0)
    range = domSelection.getRangeAt(0)
  } else {
    throw new Error('Cannot get the selection when dragging')
  }

  node.remove()
  const rangeSelection = $createRangeSelection()
  if (range !== null && range !== undefined) {
    rangeSelection.applyDOMRange(range)
  }

  $setSelection(rangeSelection)
  editor.dispatchCommand(INSERT_MAP_COMMAND, data)

  return true
}

export default function MapsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([MapNode])) {
      throw new Error('MapsPlugin: MapNode not registered on your editor.')
    }

    return mergeRegister(
      editor.registerCommand<MapPayload>(INSERT_MAP_COMMAND, payload => {
        const mapNode = $createMapNode(payload)
        $insertNodes([mapNode])
        console.log(mapNode.getParentOrThrow())
        if ($isRootOrShadowRoot(mapNode.getParentOrThrow())) {
          $wrapNodeInElement(mapNode, $createParagraphNode).selectEnd()
        }
        return true
      }, COMMAND_PRIORITY_EDITOR),
      editor.registerCommand<DragEvent>(
        DRAGSTART_COMMAND,
        (event) => {
          return $onDragStart(event)
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<DragEvent>(
        DRAGOVER_COMMAND,
        (event) => {
          return $onDragOver(event)
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<DragEvent>(
        DROP_COMMAND,
        (event) => {
          return $onDrop(event, editor)
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor])

  return null
}