const calcDisplaySummary = require("../src/calcDisplaySummary.js");

describe("calcDisplaySummary", () => {
  // Mock DOM elements
  global.labelSumIn = { textContent: "" };
  global.labelSumOut = { textContent: "" };
  global.labelSumInterest = { textContent: "" };

  // Mock formatCurrency function
  const mockFormatCurrency = jest.fn((acc, amount) => `Formatted ${amount}`);

  beforeEach(() => {
    // Reset mocks before each test
    mockFormatCurrency.mockClear();
    global.formatCurrency = mockFormatCurrency;
  });

  it("calculates and displays correct summary for an account", () => {
    // Create a mock account
    const mockAccount = {
      movements: [200, -150, 300, -50, 40],
      interestRate: 1.2,
    };

    calcDisplaySummary(mockAccount);

    expect(labelSumIn.textContent).toBe("Formatted 540");
    expect(labelSumOut.textContent).toBe("Formatted 200");
    expect(labelSumInterest.textContent).toBe("Formatted 6");

    expect(mockFormatCurrency).toHaveBeenCalledWith(mockAccount, 540); // For Incomes
    expect(mockFormatCurrency).toHaveBeenCalledWith(mockAccount, 200); // For Outcomes
    expect(mockFormatCurrency).toHaveBeenCalledWith(mockAccount, 6); // For Interest
  });

  it("handles an account with no movements", () => {
    const mockAccount = {
      movements: [],
      interestRate: 1.2,
    };

    calcDisplaySummary(mockAccount);

    expect(labelSumIn.textContent).toBe("Formatted 0");
    expect(labelSumOut.textContent).toBe("Formatted 0");
    expect(labelSumInterest.textContent).toBe("Formatted 0");
  });

  it("handles unexpected return values from formatCurrency", () => {
    global.formatCurrency = jest.fn(() => "Unexpected Value");

    const mockAccount = {
      movements: [100, -50],
      interestRate: 1.2,
    };

    calcDisplaySummary(mockAccount);

    expect(labelSumIn.textContent).toBe("Unexpected Value");
    expect(labelSumOut.textContent).toBe("Unexpected Value");
    expect(labelSumInterest.textContent).toBe("Unexpected Value");
  });
});
