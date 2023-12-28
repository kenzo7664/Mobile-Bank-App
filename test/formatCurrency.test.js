const formatCurrency = require("../src/formatCurrrency.js");

describe("formatCurrency", () => {
  it("formats USD correctly", () => {
    const account = { locale: "en-US", currency: "USD" };
    const movement = 1234.56;
    expect(formatCurrency(account, movement)).toBe("$1,234.56");
  });

  it("formats EUR correctly", () => {
    const account = { locale: "de-DE", currency: "EUR" };
    const movement = 1234.56;
    expect(formatCurrency(account, movement)).toBe("1.234,56\u00A0€");
  });

  it("formats JPY correctly", () => {
    const account = { locale: "ja-JP", currency: "JPY" };
    const movement = 1234;
    expect(formatCurrency(account, movement)).toBe("￥1,234");
  });

  it("formats GBP correctly", () => {
    const account = { locale: "en-GB", currency: "GBP" };
    const movement = 1234.56;
    expect(formatCurrency(account, movement)).toBe("£1,234.56");
  });

  it("handles very large numbers correctly", () => {
    const account = { locale: "en-US", currency: "USD" };
    const movement = 1234567890.12;
    expect(formatCurrency(account, movement)).toBe("$1,234,567,890.12");
  });

  it("handles negative numbers correctly", () => {
    const account = { locale: "en-US", currency: "USD" };
    const movement = -1234.56;
    expect(formatCurrency(account, movement)).toBe("-$1,234.56");
  });

  it("formats zero correctly", () => {
    const account = { locale: "en-US", currency: "USD" };
    const movement = 0;
    expect(formatCurrency(account, movement)).toBe("$0.00");
  });

  it("throws error for invalid account object", () => {
    const account = { locale: null, currency: null };
    const movement = 1000;
    expect(() => formatCurrency(account, movement)).toThrow();
  });
});
