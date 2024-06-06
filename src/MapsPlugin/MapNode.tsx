import {
  $applyNodeReplacement,
  DecoratorNode,
  EditorConfig,
  LexicalNode,
  NodeKey,
} from 'lexical'
import { JSX } from 'react'
import MapComponent from './MapComponent.tsx'

type SerializedMapNode = {
  dataURI: string
  type: 'map'
  version: 1
}

export class MapNode extends DecoratorNode<JSX.Element> {
  __dataURI: string

  constructor(
    dataURI: string,
    key?: NodeKey,
  ) {
    super(key)
    this.__dataURI = dataURI
  }

  static getType(): string {
    return 'map'
  }

  static clone(node: MapNode): MapNode {
    return new MapNode(
      node.__dataURI,
      node.__key,
    )
  }

  exportJSON(): SerializedMapNode {
    return {
      dataURI: this.__dataURI,
      type: 'map' as const,
      version: 1,
    }
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span')
    const theme = config.theme
    const className = theme.image
    if (className) {
      span.className = className
    }
    return span
  }

  updateDOM(): boolean {
    return false
  }

  static importJSON(serializedNode: SerializedMapNode): MapNode {
    const { dataURI } = serializedNode
    return $createMapNode(dataURI)
  }

  decorate(): JSX.Element {
    return (
      <MapComponent dataURI={this.__dataURI} nodeKey={this.__key} />
    )
  }
}

export function $createMapNode(dataURI: string): MapNode {
  const node = new MapNode(dataURI)
  return $applyNodeReplacement(node)
}

export function $isMapNode(node: LexicalNode): node is MapNode {
  return node instanceof MapNode
}