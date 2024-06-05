import { Map } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { FaXmark } from 'react-icons/fa6'

type MapModalPropsType = {
  onClose: () => void
}

function MapModal({ onClose }: MapModalPropsType) {
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
          />
        </div>
        <div className="buttonWrapper">
          <button type="button">Place Marker</button>
          <button type="button">Insert Map</button>
        </div>
      </div>
    </>
  )
}

export default MapModal