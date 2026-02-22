import { createBooking, getBookingById, cancelBooking } from './booking';

const mockPost = jest.fn();
const mockGet = jest.fn();
const mockPatch = jest.fn();

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: () => ({ post: mockPost, get: mockGet, patch: mockPatch }),
  },
}));

describe('booking API', () => {
  const mockData = { id: 'BK123', status: 'confirmed', type: 'flight' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    it('posts to /api/booking and returns data', async () => {
      mockPost.mockResolvedValue({ data: mockData });
      const payload = { type: 'flight', item: { airline: 'IndiGo', origin: 'DEL', destination: 'BOM' } };
      const result = await createBooking(payload);
      expect(mockPost).toHaveBeenCalledWith('/api/booking', payload);
      expect(result).toEqual(mockData);
    });
  });

  describe('getBookingById', () => {
    it('fetches booking by id', async () => {
      mockGet.mockResolvedValue({ data: mockData });
      const result = await getBookingById('BK123');
      expect(mockGet).toHaveBeenCalledWith('/api/booking/BK123');
      expect(result).toEqual(mockData);
    });
  });

  describe('cancelBooking', () => {
    it('patches booking with cancelled status', async () => {
      const cancelled = { ...mockData, status: 'cancelled' };
      mockPatch.mockResolvedValue({ data: cancelled });
      const result = await cancelBooking('BK123');
      expect(mockPatch).toHaveBeenCalledWith('/api/booking/BK123', { status: 'cancelled' });
      expect(result.status).toBe('cancelled');
    });
  });
});
