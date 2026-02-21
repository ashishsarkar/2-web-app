import { render, screen } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  it('renders when open', () => {
    render(
      <Modal isOpen onClose={() => {}}>
        Content
      </Modal>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/content/i)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        Content
      </Modal>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
