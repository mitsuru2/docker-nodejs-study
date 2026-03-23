import { uuid } from './uuid';

describe('UUID', () => {
  it('should generate a valid v4 UUID', () => {
    const result = uuid();

    // UUID v4 format regex
    // xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where x is hex and y is 8, 9, a, or b
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

    expect(result).toMatch(uuidV4Regex);
  });
});
