import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders without crashing', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button', { name: /click/i })).toBeInTheDocument();
  });
});
