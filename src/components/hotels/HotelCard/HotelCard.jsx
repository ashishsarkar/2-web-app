export default function HotelCard({ hotel }) {
  return <div>{hotel?.id || 'Hotel'}</div>;
}
