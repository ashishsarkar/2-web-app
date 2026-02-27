import { searchFlights, getFlightById } from './flights';

const mockGet = jest.fn();

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: () => ({ get: mockGet, post: jest.fn(), patch: jest.fn() }),
  },
}));

const flightFixture = {
  id: 'f24',
  origin: 'CCU',
  originCity: 'Kolkata',
  destination: 'COK',
  destinationCity: 'Kochi',
  departureTime: '2026-03-07T07:30:00Z',
  arrivalTime: '2026-03-07T10:15:00Z',
  price: 5300,
  airline: 'Vistara',
  duration: '2h 45m',
};

beforeEach(() => jest.clearAllMocks());

describe('searchFlights', () => {
  it('calls GET /api/flights/search and returns data', async () => {
    mockGet.mockResolvedValue({ data: { flights: [flightFixture] } });
    const result = await searchFlights({ origin: 'CCU', destination: 'COK' });
    expect(mockGet).toHaveBeenCalledWith('/api/flights/search', {
      params: { origin: 'CCU', destination: 'COK' },
    });
    expect(result.flights).toHaveLength(1);
    expect(result.flights[0].id).toBe('f24');
  });

  it('returns empty flights array when no results', async () => {
    mockGet.mockResolvedValue({ data: { flights: [] } });
    const result = await searchFlights({ origin: 'ZZZ', destination: 'YYY' });
    expect(result.flights).toEqual([]);
  });

  it('passes all search params', async () => {
    mockGet.mockResolvedValue({ data: { flights: [] } });
    await searchFlights({ origin: 'DEL', destination: 'BOM', departureDate: '2026-03-15' });
    expect(mockGet).toHaveBeenCalledWith('/api/flights/search', {
      params: { origin: 'DEL', destination: 'BOM', departureDate: '2026-03-15' },
    });
  });
});

describe('getFlightById', () => {
  it('calls GET /api/flights/:id and returns flight', async () => {
    mockGet.mockResolvedValue({ data: flightFixture });
    const result = await getFlightById('f24');
    expect(mockGet).toHaveBeenCalledWith('/api/flights/f24');
    expect(result.id).toBe('f24');
    expect(result.airline).toBe('Vistara');
  });

  it('propagates error on failed request', async () => {
    mockGet.mockRejectedValue(new Error('Network error'));
    await expect(getFlightById('bad-id')).rejects.toThrow('Network error');
  });
});
