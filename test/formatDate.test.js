const formatMovementDate = require("../src/formatDate.js");

describe("formatMovementDate function", () => {
  it('returns "Today" if the date is today', () => {
    expect(formatMovementDate(new Date(), "en-US")).toBe("Today");
  });

  it('returns "Yesterday" if the date is yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(formatMovementDate(yesterday, "en-US")).toBe("Yesterday");
  });

  it('returns "X days ago" if the date is within the past week', () => {
    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
    expect(formatMovementDate(fourDaysAgo, "en-US")).toBe("4 days ago");
  });

  it("returns correctly formatted date for dates older than a week", () => {
    const oldDate = new Date(2020, 0, 1); // January 1, 2020
    const formattedDate = new Intl.DateTimeFormat("en-US").format(oldDate);
    expect(formatMovementDate(oldDate, "en-US")).toBe(formattedDate);
  });

  it("handles invalid date inputs", () => {
    expect(() => formatMovementDate("invalid-date", "en-US")).toThrow();
  });

  it("handles null date inputs", () => {
    expect(() => formatMovementDate(null, "en-US")).toThrow();
  });

  it("returns a correctly formatted date when no locale is provided", () => {
    const oldDate = new Date(2020, 0, 1); // January 1, 2020
    const formattedDate = new Intl.DateTimeFormat().format(oldDate); // Default locale
    expect(formatMovementDate(oldDate)).toBe(formattedDate);
  });

  it("handles edge case of a leap year date", () => {
    const leapYearDate = new Date(2020, 1, 29); // February 29, 2020
    const formattedDate = new Intl.DateTimeFormat("en-US").format(leapYearDate);
    expect(formatMovementDate(leapYearDate, "en-US")).toBe(formattedDate);
  });
});
