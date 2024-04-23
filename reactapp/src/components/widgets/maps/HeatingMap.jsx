import React  from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";

const HeatingMap = ({ center, coordinates, zoom }) => {
   
    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {coordinates.map(({ latitude, longitude, popupText }, index) => (
                <Marker key={index} position={[latitude, longitude]}>
                    <Popup>
                        {popupText}
                    </Popup>
                </Marker>
            ))}
        </MapContainer> 
    );
};

export default HeatingMap;