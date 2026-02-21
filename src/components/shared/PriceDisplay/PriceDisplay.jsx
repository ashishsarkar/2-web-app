export default function PriceDisplay({ amount, currency = 'INR' }) {
  return (
    <span>
      {currency} {amount?.toLocaleString()}
    </span>
  );
}
