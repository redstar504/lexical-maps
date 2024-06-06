import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { NodeKey } from 'lexical'

type MapComponentProps = {
  dataURI: string
  nodeKey: NodeKey
}

function MapComponent({ dataURI, nodeKey }: MapComponentProps) {
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey)

  return (
    <img
      src={dataURI}
      alt="map"
    />
  )
}

export default MapComponent