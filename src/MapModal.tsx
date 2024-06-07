import { Map, MapRef } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { FaXmark } from 'react-icons/fa6'
import { MdArrowDropDown } from 'react-icons/md'
import { VscSearch, VscTarget } from 'react-icons/vsc'
import { useRef, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { INSERT_MAP_COMMAND } from './MapsPlugin'

type MapModalPropsType = {
  onClose: () => void
}

function MapModal({ onClose }: MapModalPropsType) {
  const [isLocationFinderOpen, setIsLocationFinderOpen] = useState(false)
  const [editor] = useLexicalComposerContext()
  const mapRef = useRef<MapRef>(null)

  const handleInsertMap = () => {
    if (!mapRef.current) return
    const b64map = mapRef.current.getCanvas().toDataURL()
    editor.dispatchCommand(INSERT_MAP_COMMAND, { dataURI: b64map })
    onClose()
  }

  return (
    <>
      <div id="overlay" onClick={onClose}></div>
      <div id="mapsModal" onClick={e => e.stopPropagation()}>
        <header>
          <h2>Insert a Map</h2>
          <button onClick={onClose}><FaXmark /></button>
        </header>
        <div className="mapWrapper">
          <Map
            mapLib={import('mapbox-gl')}
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            initialViewState={{
              longitude: -100,
              latitude: 40,
              zoom: 5,
            }}
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