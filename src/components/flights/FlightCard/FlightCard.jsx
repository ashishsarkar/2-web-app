export default function FlightCard({ flight }) {
  return <div>{flight?.id || 'Flight'}</div>;
}
