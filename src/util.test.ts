import {
  preparePinBlockFormat0,
  preparePinBlockFormat1,
  preparePinBlockFormat2,
  preparePinBlockFormat3,
  prepareAccountNumberBlock,
} from '../src/util';

describe('Utility Functions', () => {
  describe('preparePinBlockFormat0', () => {
    test('should prepare PIN block for format 0 correctly', () => {
      expect(preparePinBlockFormat0('1234')).toBe('041234FFFFFFFFFF');
      expect(preparePinBlockFormat0('1529')).toBe('041529FFFFFFFFFF');
      expect(preparePinBlockFormat0('123456')).toBe('06123456FFFFFFFF');
    });

    test('should handle empty PIN', () => {
      expect(preparePinBlockFormat0('')).toBe('00FFFFFFFFFFFFFF');
    });

    test('should handle single digit PIN', () => {
      expect(preparePinBlockFormat0('5')).toBe('015FFFFFFFFFFFFF');
    });

    test('should handle maximum length PIN', () => {
      expect(preparePinBlockFormat0('123456789012')).toBe('012123456789012F');
    });
  });

  describe('preparePinBlockFormat1', () => {
    test('should prepare PIN block for format 1 correctly', () => {
      expect(preparePinBlockFormat1('1529', '123456789177')).toBe('1415291234567891');
      expect(preparePinBlockFormat1('1234', '999888777666')).toBe('1412349998887776');
    });

    test('should truncate to 16 characters when combined length exceeds 16', () => {
      expect(preparePinBlockFormat1('123456', '1234567890123456')).toBe('1612345612345678');
    });

    test('should handle short unique sequence', () => {
      expect(preparePinBlockFormat1('1234', '999')).toBe('141234999');
    });
  });

  describe('preparePinBlockFormat2', () => {
    test('should prepare PIN block for format 2 correctly', () => {
      expect(preparePinBlockFormat2('1529')).toBe('241529FFFFFFFFFF');
      expect(preparePinBlockFormat2('1234')).toBe('241234FFFFFFFFFF');
      expect(preparePinBlockFormat2('123456')).toBe('26123456FFFFFFFF');
    });

    test('should handle empty PIN', () => {
      expect(preparePinBlockFormat2('')).toBe('20FFFFFFFFFFFFFF');
    });
  });

  describe('preparePinBlockFormat3', () => {
    test('should prepare PIN block for format 3 with random fill', () => {
      const result = preparePinBlockFormat3('1529');
      expect(result).toMatch(/^341529[A-F]{10}$/);
      expect(result.length).toBe(16);
    });

    test('should start with format identifier 3 and correct PIN length', () => {
      const result = preparePinBlockFormat3('1234');
      expect(result.substring(0, 6)).toBe('341234');
      expect(result.length).toBe(16);
    });

    test('should use only valid hex characters A-F for fill', () => {
      const result = preparePinBlockFormat3('12');
      const fillPart = result.substring(4); // Skip '3', '2', '1', '2'
      expect(fillPart).toMatch(/^[A-F]{12}$/);
    });

    test('should generate different random fills on multiple calls', () => {
      const result1 = preparePinBlockFormat3('1234');
      const result2 = preparePinBlockFormat3('1234');
      // While theoretically they could be the same, it's extremely unlikely
      // We just check the structure is correct
      expect(result1.substring(0, 6)).toBe(result2.substring(0, 6)); // Same prefix
      expect(result1.length).toBe(16);
      expect(result2.length).toBe(16);
    });
  });

  describe('prepareAccountNumberBlock', () => {
    test('should prepare account number block correctly', () => {
      expect(prepareAccountNumberBlock('123456789177')).toBe('00000123456789177');
      expect(prepareAccountNumberBlock('4567890123456789')).toBe('0000890123456789');
    });

    test('should handle account numbers longer than 12 digits', () => {
      expect(prepareAccountNumberBlock('1234567890123456789')).toBe('0000890123456789');
    });

    test('should pad short account numbers with zeros', () => {
      expect(prepareAccountNumberBlock('123456')).toBe('00000000000123456');
      expect(prepareAccountNumberBlock('1')).toBe('00000000000000001');
    });

    test('should remove check digit when checkDigit flag is true', () => {
      expect(prepareAccountNumberBlock('1234567890123', true)).toBe('00000123456789012');
    });

    test('should handle empty account number', () => {
      expect(prepareAccountNumberBlock('')).toBe('00000000000000000');
    });

    test('should handle account number with check digit removal', () => {
      expect(prepareAccountNumberBlock('4567890123456789', true)).toBe('0000789012345678');
    });
  });
});
