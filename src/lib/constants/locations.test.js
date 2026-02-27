import { STATIC_LOCATIONS, filterStaticLocations } from './locations';

describe('STATIC_LOCATIONS', () => {
  it('contains at least 30 entries', () => {
    expect(STATIC_LOCATIONS.length).toBeGreaterThanOrEqual(30);
  });

  it('every entry has required fields', () => {
    const required = ['id', 'name', 'code', 'type', 'country'];
    STATIC_LOCATIONS.forEach((loc) => {
      required.forEach((field) => {
        expect(loc).toHaveProperty(field);
      });
    });
  });

  it('contains DEL (New Delhi)', () => {
    const del = STATIC_LOCATIONS.find((l) => l.id === 'DEL');
    expect(del).toBeDefined();
    expect(del.type).toBe('city');
    expect(del.code).toBe('DEL');
  });

  it('contains COK (Kochi)', () => {
    const cok = STATIC_LOCATIONS.find((l) => l.id === 'COK');
    expect(cok).toBeDefined();
    expect(cok.state).toBe('Kerala');
  });

  it('contains Kerala as state entry', () => {
    const kerala = STATIC_LOCATIONS.find((l) => l.id === 'IN-KL');
    expect(kerala).toBeDefined();
    expect(kerala.type).toBe('state');
    expect(kerala.code).toBe('KL');
  });

  it('has no duplicate IDs', () => {
    const ids = STATIC_LOCATIONS.map((l) => l.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

describe('filterStaticLocations', () => {
  it('matches by city name prefix', () => {
    const results = filterStaticLocations('mum');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.name === 'Mumbai')).toBe(true);
  });

  it('matches by IATA code', () => {
    const results = filterStaticLocations('DEL');
    expect(results.some((r) => r.code === 'DEL')).toBe(true);
  });

  it('is case-insensitive', () => {
    const lower = filterStaticLocations('del');
    const upper = filterStaticLocations('DEL');
    expect(lower.length).toBe(upper.length);
  });

  it('filters by type=city', () => {
    const results = filterStaticLocations('ker', { type: 'city' });
    results.forEach((r) => expect(r.type).toBe('city'));
  });

  it('filters by type=state', () => {
    const results = filterStaticLocations('ker', { type: 'state' });
    results.forEach((r) => expect(r.type).toBe('state'));
  });

  it('returns empty array for unknown query', () => {
    const results = filterStaticLocations('zzzzxxx123');
    expect(results).toEqual([]);
  });

  it('respects size limit', () => {
    const results = filterStaticLocations('a', { size: 3 });
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it('returns results for Kerala-related query', () => {
    const results = filterStaticLocations('kerala');
    expect(results.length).toBeGreaterThan(0);
  });

  it('returns no state results when filterType=city for "kerala"', () => {
    const results = filterStaticLocations('kerala', { type: 'city' });
    // city entries for kerala (COK, TRV) should match via state field
    results.forEach((r) => expect(r.type).toBe('city'));
  });
});
