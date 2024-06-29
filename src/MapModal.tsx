import { Map, MapRef } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { FaXmark } from 'react-icons/fa6'
import { MdArrowDropDown } from 'react-icons/md'
import { VscSearch, VscTarget } from 'react-icons/vsc'
import { useEffect, useRef, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getMapNodeInSelection, INSERT_MAP_COMMAND } from './MapsPlugin'
import { $isMapNode, MapNode } from './MapsPlugin/MapNode.tsx'
import { $getNodeByKey, NodeKey } from 'lexical'

type MapModalPropsType = {
  onClose: () => void
}

type MapViewState = {
  latitude: number,
  longitude: number
  zoom: number
  bearing: number
  pitch: number
}

function MapModal({ onClose }: MapModalPropsType) {
  const [isLocationFinderOpen, setIsLocationFinderOpen] = useState(false)
  const [editor] = useLexicalComposerContext()
  const mapRef = useRef<MapRef>(null)
  const [currentNodeKey, setCurrentNodeKey] = useState<NodeKey>()
  const [viewState, setViewState] = useState<MapViewState>({
    latitude: 40,
    longitude: -100,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  })

  const handleInsertMap = () => {
    if (!mapRef.current) return
    const { lng, lat } = mapRef.current.getCenter()

    const mapConfig = {
      dataURI: mapRef.current.getCanvas().toDataURL(),
      center: { lng, lat },
      zoom: viewState.zoom,
    }

    if (!currentNodeKey) {
      editor.dispatchCommand(INSERT_MAP_COMMAND, mapConfig)
      onClose()
      return true
    }

    editor.update(() => {
      const existingNode = currentNodeKey ? $getNodeByKey(currentNodeKey) as MapNode : null
      if (!existingNode || !$isMapNode(existingNode)) {
        return
      }

      const replacementConfig = {
        ...mapConfig,
        width: existingNode.__width,
        height: existingNode.__height,
      }

      existingNode.remove()
      editor.dispatchCommand(INSERT_MAP_COMMAND, replacementConfig)
      return true
    })

    onClose()
  }

  useEffect(() => {
    editor.getEditorState().read(() => {
      const currentMap = $getMapNodeInSelection()
      if (!currentMap) return
      setCurrentNodeKey(currentMap.__key)
      setViewState(prevState => ({
        ...prevState,
        zoom: currentMap.__zoom,
        latitude: currentMap.__center.lat,
        longitude: currentMap.__center.lng
      }))
    })
  }, [editor])

  return (
    <>
      <div id="overlay" onClick={onClose}></div>
      <div id="mapsModal" onClick={e => e.stopPropagation()}>
        <header>
          <h2>{currentNodeKey ? 'Edit' : 'Insert'} Map</h2>
          <button onClick={onClose}><FaXmark /></button>
        </header>
        <div className="mapWrapper">
          <Map
            {...viewState}
            onMove={({viewState}) => setViewState(viewState)}
            mapLib={import('mapbox-gl')}
            initialViewState={{
              latitude: 49,
              longitude: -119,
              zoom: 5,
            }}
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            style={{ width: '100%', height: 400 }}
            mapStyle={'mapbox://styles/mapbox/standard'}
            ref={mapRef}
            preserveDrawingBuffer={true}
          />
        </div>
        <div className="buttonWrapper">
          <div id="findLocationWrapper">
            <button
              className="button"
              type="button"
              id="findLocationButton"
              onClick={() => setIsLocationFinderOpen(!isLocationFinderOpen)}
            >
              Find Location <MdArrowDropDown />
            </button>
            {isLocationFinderOpen && (
              <ul>
                <li>
                  <button><VscTarget />My Location</button>
                </li>
                <li>
                  <button><VscSearch />Search</button>
                </li>
              </ul>
            )}
          </div>
          <button className="button" type="button">Place Marker</button>
          <button className="button" type="button" id="insertButton" onClick={handleInsertMap}>Insert Map</button>
        </div>
      </div>
    </>
  )
}

export default MapModal