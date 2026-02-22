'use client';

const DEFAULT_LAT = 19.076;
const DEFAULT_LNG = 72.878;
const ZOOM = 0.02;

export default function HotelMap({ lat, lng, address, name }) {
  const latitude = lat ?? DEFAULT_LAT;
  const longitude = lng ?? DEFAULT_LNG;
  const bbox = `${longitude - ZOOM},${latitude - ZOOM},${longitude + ZOOM},${latitude + ZOOM}`;

  return (
    <div className="rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
      <iframe
        title="Hotel location"
        width="100%"
        height="200"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${latitude},${longitude}`}
      />
      <a
        href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-xs text-indigo-600 py-2 hover:underline"
      >
        View on OpenStreetMap
      </a>
    </div>
  );
}
