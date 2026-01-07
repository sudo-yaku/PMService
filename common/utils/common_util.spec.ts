import { reformatDates } from "./common_util";

describe('reformatDates', () => {

  it('should correctly format start date in "01-JAN-22 12.00.00.000000 AM" format', () => {
    const input = "01-JAN-22 12.00.00.000000 AM";
    const expectedOutput = "2022-01-01T00:00:00.000Z";
    
    const result = reformatDates(input);
    expect(result).toBe(expectedOutput);
  });

  it('should correctly format end date in "31-DEC-22 11.59.59.000000 PM" format', () => {
    const input = "31-DEC-22 11.59.59.000000 PM";
    const expectedOutput = "2022-12-31T23:59:59.000Z";

    const result = reformatDates(input);
    expect(result).toBe(expectedOutput);
  });

  it('should return the date with 00:00:00.000Z if time part is missing', () => {
    const input = "01-JAN-22";
    const expectedOutput = "2022-01-01T00:00:00.000Z";

    const result = reformatDates(input);
    expect(result).toBe(expectedOutput);
  });

  it('should correctly handle AM/PM format for times', () => {
    const inputAM = "01-JAN-22 12.00.00.000000 AM";
    const inputPM = "01-JAN-22 12.00.00.000000 PM";
    
    const expectedAM = "2022-01-01T00:00:00.000Z";
    const expectedPM = "2022-01-01T12:00:00.000Z";
    
    const resultAM = reformatDates(inputAM);
    const resultPM = reformatDates(inputPM);

    expect(resultAM).toBe(expectedAM);
    expect(resultPM).toBe(expectedPM);
  });

  it('should correctly handle invalid date format and throw an error', () => {
    const input = "INVALID-DATE";
    
    try {
      reformatDates(input);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });


});
