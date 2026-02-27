import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LocationAutocomplete from './LocationAutocomplete';

// Mock the ES API — return empty by default (static fallback handles results)
jest.mock('@/lib/api/locations', () => ({
  searchLocations: jest.fn().mockResolvedValue({ query: '', total: 0, results: [] }),
}));

// Mock static locations with predictable data
jest.mock('@/lib/constants/locations', () => ({
  filterStaticLocations: jest.fn((q, opts) => {
    if (!q) return [];
    const data = [
      { id: 'DEL', name: 'New Delhi', code: 'DEL', type: 'city', country: 'India', state: 'Delhi', description: 'IGI Airport', aliases: '' },
      { id: 'BOM', name: 'Mumbai', code: 'BOM', type: 'city', country: 'India', state: 'Maharashtra', description: 'CSMI Airport', aliases: '' },
      { id: 'IN-KL', name: 'Kerala', code: 'KL', type: 'state', country: 'India', state: 'Kerala', description: 'God\'s Own Country', aliases: '' },
    ];
    const filtered = data.filter((loc) => {
      const matches = loc.name.toLowerCase().includes(q.toLowerCase()) ||
        loc.code.toLowerCase().includes(q.toLowerCase());
      if (!matches) return false;
      if (opts?.type && loc.type !== opts.type) return false;
      return true;
    });
    return filtered.slice(0, opts?.size ?? 8);
  }),
}));

describe('LocationAutocomplete', () => {
  const onChange = jest.fn();
  const onSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders an input element', () => {
    render(<LocationAutocomplete onChange={onChange} onSelect={onSelect} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows placeholder text', () => {
    render(<LocationAutocomplete placeholder="Search city…" onChange={onChange} onSelect={onSelect} />);
    expect(screen.getByPlaceholderText('Search city…')).toBeInTheDocument();
  });

  it('calls onChange on every keystroke', async () => {
    render(<LocationAutocomplete onChange={onChange} onSelect={onSelect} />);
    await userEvent.type(screen.getByRole('combobox'), 'D');
    expect(onChange).toHaveBeenCalledWith('D');
  });

  it('shows dropdown with results after typing', async () => {
    render(<LocationAutocomplete onChange={onChange} onSelect={onSelect} />);
    await act(async () => {
      await userEvent.type(screen.getByRole('combobox'), 'DEL');
    });
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
    expect(screen.getByText('New Delhi')).toBeInTheDocument();
  });

  it('calls onSelect with location object when item clicked', async () => {
    render(<LocationAutocomplete onChange={onChange} onSelect={onSelect} />);
    await act(async () => {
      await userEvent.type(screen.getByRole('combobox'), 'DEL');
    });
    await waitFor(() => screen.getByRole('listbox'));
    fireEvent.mouseDown(screen.getByText('New Delhi'));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'DEL', code: 'DEL', type: 'city' })
    );
  });

  it('sets input value to "City (CODE)" format for city selection', async () => {
    render(<LocationAutocomplete onChange={onChange} onSelect={onSelect} />);
    await act(async () => {
      await userEvent.type(screen.getByRole('combobox'), 'DEL');
    });
    await waitFor(() => screen.getByRole('listbox'));
    fireEvent.mouseDown(screen.getByText('New Delhi'));
    const input = screen.getByRole('combobox');
    expect(input.value).toBe('New Delhi (DEL)');
  });

  it('closes dropdown on Escape key', async () => {
    render(<LocationAutocomplete onChange={onChange} onSelect={onSelect} />);
    await act(async () => {
      await userEvent.type(screen.getByRole('combobox'), 'mum');
    });
    await waitFor(() => screen.getByRole('listbox'));
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('shows red border when hasError is true', () => {
    render(<LocationAutocomplete hasError onChange={onChange} onSelect={onSelect} />);
    expect(screen.getByRole('combobox').className).toMatch(/red/);
  });

  it('is disabled when disabled prop is true', () => {
    render(<LocationAutocomplete disabled onChange={onChange} onSelect={onSelect} />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('shows no dropdown when input is empty', () => {
    render(<LocationAutocomplete value="" onChange={onChange} onSelect={onSelect} />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('syncs to controlled value via value prop', () => {
    render(<LocationAutocomplete value="Kochi (COK)" onChange={onChange} onSelect={onSelect} />);
    expect(screen.getByRole('combobox').value).toBe('Kochi (COK)');
  });
});
