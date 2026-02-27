import { searchLocations } from './locations';

const mockGet = jest.fn();

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: () => ({ get: mockGet, post: jest.fn(), patch: jest.fn() }),
  },
}));

const esResponse = {
  query: 'mum',
  total: 2,
  results: [
    { id: 'BOM', name: 'Mumbai', code: 'BOM', type: 'city', country: 'India', score: 24.1 },
    { id: 'IN-MH', name: 'Maharashtra', code: 'MH', type: 'state', country: 'India', score: 12.9 },
  ],
};

beforeEach(() => jest.clearAllMocks());

describe('searchLocations', () => {
  it('calls GET /api/locations/search with query', async () => {
    mockGet.mockResolvedValue({ data: esResponse });
    const result = await searchLocations('mum');
    expect(mockGet).toHaveBeenCalledWith('/api/locations/search', {
      params: { q: 'mum', size: 8 },
    });
    expect(result.results).toHaveLength(2);
  });

  it('includes type filter when provided', async () => {
    mockGet.mockResolvedValue({ data: esResponse });
    await searchLocations('mum', { type: 'city' });
    expect(mockGet).toHaveBeenCalledWith('/api/locations/search', {
      params: { q: 'mum', size: 8, type: 'city' },
    });
  });

  it('omits type when not provided', async () => {
    mockGet.mockResolvedValue({ data: esResponse });
    await searchLocations('del');
    const { params } = mockGet.mock.calls[0][1];
    expect(params).not.toHaveProperty('type');
  });

  it('accepts custom size parameter', async () => {
    mockGet.mockResolvedValue({ data: esResponse });
    await searchLocations('ban', { size: 5 });
    expect(mockGet.mock.calls[0][1].params.size).toBe(5);
  });

  it('returns the full response object', async () => {
    mockGet.mockResolvedValue({ data: esResponse });
    const result = await searchLocations('mum');
    expect(result.query).toBe('mum');
    expect(result.total).toBe(2);
  });

  it('propagates API errors', async () => {
    mockGet.mockRejectedValue(new Error('ES unavailable'));
    await expect(searchLocations('err')).rejects.toThrow('ES unavailable');
  });
});
