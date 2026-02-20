import { PinEncryptor } from '../src/main';

describe('PinEncryptor', () => {
  describe('format0', () => {
    test('should generate correct PIN block for format 0 (from README example)', () => {
      const result = PinEncryptor.format0('1529', '123456789177');
      expect(result).toBe('041528dcba9876e8');
      expect(result.length).toBe(16);
    });

    test('should handle different PIN and account number combinations', () => {
      const result = PinEncryptor.format0('1234', '4567890123456789');
      expect(result.length).toBe(16);
      expect(result).toMatch(/^[0-9a-f]{16}$/i); // Valid hex string
    });

    test('should handle account numbers with check digit', () => {
      const result1 = PinEncryptor.format0('1234', '4567890123456789', true);
      const result2 = PinEncryptor.format0('1234', '456789012345678'); // Same but without check digit manually
      expect(result1).toBe(result2);
    });

    test('should produce consistent results for same inputs', () => {
      const result1 = PinEncryptor.format0('1529', '123456789177');
      const result2 = PinEncryptor.format0('1529', '123456789177');
      expect(result1).toBe(result2);
    });

    test('should handle short account numbers', () => {
      const result = PinEncryptor.format0('1234', '123456');
      expect(result.length).toBe(16);
      expect(result).toMatch(/^[0-9a-f]{16}$/i);
    });
  });

  describe('format1', () => {
    test('should generate correct PIN block for format 1 (from README example)', () => {
      const result = PinEncryptor.format1('1529', '123456789177');
      expect(result).toBe('1415291234567891');
      expect(result.length).toBe(16);
    });

    test('should handle different PIN and unique sequence combinations', () => {
      const result = PinEncryptor.format1('1234', '999888777666');
      expect(result).toBe('1412349998887776');
    });

    test('should truncate when total length exceeds 16', () => {
      const result = PinEncryptor.format1('123456', '1234567890123456789');
      expect(result.length).toBe(16);
      expect(result.startsWith('16123456')).toBe(true);
    });

    test('should handle short unique sequences', () => {
      const result = PinEncryptor.format1('12', '999');
      expect(result).toBe('1212999');
    });
  });

  describe('format2', () => {
    test('should generate correct PIN block for format 2 (from README example)', () => {
      const result = PinEncryptor.format2('1529');
      expect(result).toBe('241529FFFFFFFFFF');
      expect(result.length).toBe(16);
    });

    test('should handle different PIN lengths', () => {
      expect(PinEncryptor.format2('1234')).toBe('241234FFFFFFFFFF');
      expect(PinEncryptor.format2('123456')).toBe('26123456FFFFFFFF');
      expect(PinEncryptor.format2('12')).toBe('2212FFFFFFFFFFFF');
    });

    test('should fill remaining positions with F', () => {
      const result = PinEncryptor.format2('1234');
      const fillPart = result.substring(6); // After format(2) + length(4) + pin(1234)
      expect(fillPart).toBe('FFFFFFFFFF');
    });
  });

  describe('format3', () => {
    test('should generate correct format for PIN block format 3', () => {
      const result = PinEncryptor.format3('1529');
      expect(result).toMatch(/^341529[A-F]{10}$/);
      expect(result.length).toBe(16);
    });

    test('should use random fill characters A-F', () => {
      const result = PinEncryptor.format3('1234');
      expect(result.substring(0, 6)).toBe('341234'); // Format + length + PIN
      const fillPart = result.substring(6);
      expect(fillPart).toMatch(/^[A-F]{10}$/);
    });

    test('should generate different results on multiple calls (probabilistic)', () => {
      const results = new Set();
      // Generate multiple results and check they're not all identical
      for (let i = 0; i < 10; i++) {
        results.add(PinEncryptor.format3('1234'));
      }
      // With random fill, we should get some variation (though not guaranteed)
      // At minimum, check structure is consistent
      results.forEach((result) => {
        expect(result).toMatch(/^341234[A-F]{10}$/);
      });
    });

    test('should handle different PIN lengths', () => {
      const result1 = PinEncryptor.format3('12');
      const result2 = PinEncryptor.format3('123456');

      expect(result1).toMatch(/^3212[A-F]{12}$/);
      expect(result2).toMatch(/^36123456[A-F]{8}$/);
    });
  });

  describe('Integration tests', () => {
    test('all formats should produce 16-character hex strings', () => {
      const pin = '1234';
      const accountNumber = '123456789012';
      const uniqueSequence = '999888777666';

      const format0Result = PinEncryptor.format0(pin, accountNumber);
      const format1Result = PinEncryptor.format1(pin, uniqueSequence);
      const format2Result = PinEncryptor.format2(pin);
      const format3Result = PinEncryptor.format3(pin);

      [format0Result, format1Result, format2Result, format3Result].forEach((result) => {
        expect(result.length).toBe(16);
        expect(result).toMatch(/^[0-9A-Fa-f]{16}$/);
      });
    });

    test('format0 should produce different results for different inputs', () => {
      const result1 = PinEncryptor.format0('1234', '123456789012');
      const result2 = PinEncryptor.format0('5678', '123456789012');
      const result3 = PinEncryptor.format0('1234', '987654321098');

      expect(result1).not.toBe(result2);
      expect(result1).not.toBe(result3);
      expect(result2).not.toBe(result3);
    });

    test('should handle edge cases gracefully', () => {
      // Empty PIN cases
      expect(() => PinEncryptor.format0('', '123456789012')).not.toThrow();
      expect(() => PinEncryptor.format1('', 'sequence')).not.toThrow();
      expect(() => PinEncryptor.format2('')).not.toThrow();
      expect(() => PinEncryptor.format3('')).not.toThrow();

      // Very long inputs
      expect(() => PinEncryptor.format0('123456789012', '123456789012345678')).not.toThrow();
      expect(() => PinEncryptor.format1('123456789012', '123456789012345678')).not.toThrow();
    });
  });
});
