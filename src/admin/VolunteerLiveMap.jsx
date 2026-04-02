import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { User, MapPin, Clock, Activity } from 'lucide-react';

// Fix for default marker icon in Leaflet + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom Pulsing Icon for Live Volunteers
const pulsingIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class='marker-pin'></div><div class='pulse'></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const SetMapBounds = ({ markers }) => {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.liveLocation.lat, m.liveLocation.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [markers, map]);
  return null;
};

const VolunteerLiveMap = () => {
  const [activeVolunteers, setActiveVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch volunteers who have a liveLocation and were seen recently (e.g., last 24h for registry, but filters can be tighter)
    const q = query(
      collection(db, 'volunteers'),
      where('liveLocation', '!=', null)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const volunteers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).filter(v => v.liveLocation && v.liveLocation.lat && v.liveLocation.lng);
      
      setActiveVolunteers(volunteers);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <div className="h-[600px] w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative">
      {loading && (
        <div className="absolute inset-0 z-[1000] bg-primary-navy/80 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-gold border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest text-primary-gold">Initializing Global Radar...</p>
        </div>
      )}

      <MapContainer 
        center={[19.0760, 72.8777]} // Default to Mumbai
        zoom={11} 
        style={{ height: '100%', width: '100%', background: '#0A0A0F' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {activeVolunteers.map((vol) => (
          <Marker 
            key={vol.id} 
            position={[vol.liveLocation.lat, vol.liveLocation.lng]}
            icon={vol.isOnline ? pulsingIcon : new L.Icon.Default()}
          >
            <Popup className="custom-popup">
              <div className="p-4 min-w-[200px] font-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-gold flex items-center justify-center text-primary-navy font-black text-lg shadow-lg shadow-primary-gold/20">
                    {vol.fullName?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight leading-none mb-1 text-gray-900">{vol.fullName}</h4>
                    <p className="text-[10px] font-bold text-primary-gold uppercase tracking-widest">{vol.status || 'Active Agent'}</p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase">
                    <MapPin size={12} className="text-primary-gold" />
                    <span>From: {vol.city || 'Mumbai Base'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase">
                    <Clock size={12} className="text-primary-gold" />
                    <span>Last Seen: {vol.liveLocation.lastSeen?.toDate ? vol.liveLocation.lastSeen.toDate().toLocaleTimeString() : 'Live'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-black uppercase">
                    <Activity size={12} />
                    <span>Status: {vol.isOnline ? 'Online now' : 'Standby'}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <SetMapBounds markers={activeVolunteers} />
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-10 left-10 z-[1000] glass p-6 rounded-3xl border border-white/10 flex flex-col gap-3">
         <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Active Deployments ({activeVolunteers.filter(v => v.isOnline).length})</span>
         </div>
         <div className="flex items-center gap-3 opacity-50">
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Standby Agents ({activeVolunteers.filter(v => !v.isOnline).length})</span>
         </div>
      </div>

      <style jsx>{`
        .marker-pin {
          width: 20px;
          height: 20px;
          border-radius: 50% 50% 50% 0;
          background: #C9933A;
          position: absolute;
          transform: rotate(-45deg);
          left: 50%;
          top: 50%;
          margin: -15px 0 0 -10px;
          border: 2px solid white;
        }

        .pulse {
          background: rgba(201, 147, 58, 0.4);
          border-radius: 50%;
          height: 40px;
          width: 40px;
          position: absolute;
          left: 50%;
          top: 50%;
          margin: -25px 0 0 -20px;
          transform: rotateX(55deg);
          z-index: -2;
        }
        
        .pulse:after {
          content: "";
          border-radius: 50%;
          height: 60px;
          width: 60px;
          position: absolute;
          margin: -10px 0 0 -10px;
          animation: pulsate 1.5s ease-out;
          animation-iteration-count: infinite;
          opacity: 0;
          box-shadow: 0 0 1px 2px #C9933A;
          animation-delay: 1.1s;
        }

        @keyframes pulsate {
          0% { transform: scale(0.1, 0.1); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: scale(1.2, 1.2); opacity: 0; }
        }

        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 2rem;
          padding: 0;
          background: white;
          border: 1px solid rgba(201, 147, 58, 0.2);
        }
        
        .custom-popup .leaflet-popup-tip-container {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default VolunteerLiveMap;
