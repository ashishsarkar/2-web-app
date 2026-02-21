import { render, screen } from '@testing-library/react';
import Input from './Input';

describe('Input', () => {
  it('renders without crashing', () => {
    render(<Input placeholder="Enter" />);
    expect(screen.getByPlaceholderText(/enter/i)).toBeInTheDocument();
  });
});
