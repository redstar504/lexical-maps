import { $applyNodeReplacement, DecoratorNode, EditorConfig, LexicalNode, NodeKey } from 'lexical'
import { JSX } from 'react'
import MapComponent from './MapComponent.tsx'

type SerializedMapNode = {
  dataURI: string
  type: 'map'
  version: 1
  width?: number
  height?: number
}

export interface MapPayload {
  dataURI: string
  key?: NodeKey,
  width?: number
  height?: number
}

export class MapNode extends DecoratorNode<JSX.Element> {
  __dataURI: string
  __width: 'inherit' | number
  __height: 'inherit' | number

  constructor(
    dataURI: string,
    width?: 'inherit' | number,
    height?: 'inherit' | number,
    key?: NodeKey,
  ) {
    super(key)
    this.__dataURI = dataURI
    this.__width = width || 'inherit'
    this.__height = height || 'inherit'
  }

  static getType(): string {
    return 'map'
  }

  static clone(node: MapNode): MapNode {
    return new MapNode(
      node.__dataURI,
      node.__width,
      node.__height,
      node.__key,
    )
  }

  exportJSON(): SerializedMapNode {
    return {
      dataURI: this.__dataURI,
      type: 'map' as const,
      height: this.__height === 'inherit' ? 0 : this.__height,
      width: this.__width === 'inherit' ? 0 : this.__width,
      version: 1,
    }
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span')
    const theme = config.theme
    const className = theme.map
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
    return $createMapNode({ dataURI })
  }

  decorate(): JSX.Element {
    return (
      <MapComponent
        dataURI={this.__dataURI}
        nodeKey={this.__key}
        width={this.__width}
        height={this.__height}
      />
    )
  }

  setWidthAndHeight(
    width: 'inherit' | number,
    height: 'inherit' | number,
  ): void {
    const writable = this.getWritable()
    writable.__width = width
    writable.__height = height
  }
}

export function $createMapNode({
  dataURI,
  width,
  height,
  key
}: MapPayload): MapNode {
  const node = new MapNode(
    dataURI,
    width,
    height,
    key
  )
  return $applyNodeReplacement(node)
}

export function $isMapNode(node: LexicalNode): node is MapNode {
  return node instanceof MapNode
}