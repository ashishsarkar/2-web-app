export default function Modal({ children, isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div role="dialog" aria-modal="true" onClose={onClose}>
      {children}
    </div>
  );
}
