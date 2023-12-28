const transferFunction = require("../src/transferFunction");
describe("Transfer Money", () => {
  // Mock accounts data
  const accounts = [
    { username: "user1", balance: 1000, movements: [], movementsDates: [] },
    { username: "user2", balance: 500, movements: [], movementsDates: [] },
  ];

  // Mock DOM elements
  const inputTransferAmount = { value: "" };
  const inputTransferTo = { value: "" };

  // Mock current account
  let currentAccount = accounts[0];
  let timer;

  it("does not transfer due to insufficient balance", () => {
    const amount = (inputTransferAmount.value = "1500"); // More than current account balance
    const receiverAccount = (inputTransferTo.value = "user2");

    transferFunction(accounts, amount, receiverAccount, currentAccount, timer);

    expect(currentAccount.balance).toBe(1000); // Balance remains unchanged
    expect(accounts[1].balance).toBe(500); // Receiver's balance remains unchanged
  });

  it("does not transfer a negative amount", () => {
    const amount = (inputTransferAmount.value = "-100");
    const receiverAccount = (inputTransferTo.value = "user2");

    transferFunction(accounts, amount, receiverAccount, currentAccount, timer);

    expect(currentAccount.balance).toBe(1000); // Balance remains unchanged
    expect(accounts[1].balance).toBe(500); // Receiver's balance remains unchanged
  });

  it("does not transfer to an invalid receiver", () => {
    const amount = (inputTransferAmount.value = "100");
    const receiverAccount = (inputTransferTo.value = "nonExistingUser");

    transferFunction(accounts, amount, receiverAccount, currentAccount, timer);

    expect(currentAccount.balance).toBe(1000); // Balance remains unchanged
  });

  it("transfers money successfully", () => {
    const amount = (inputTransferAmount.value = "100");
    const receiverAccount = (inputTransferTo.value = "user2");

    transferFunction(accounts, amount, receiverAccount, currentAccount, timer);

    expect(currentAccount.balance).toBe(900); // Check if balance is updated
    expect(accounts[1].balance).toBe(600); // Check receiver's balance
    expect(currentAccount.movements).toEqual([-100]); // Check the Movement array for the sender is updated
    expect(accounts[1].movements).toEqual([100]); // Check if the Movement array for the receiever is updated
  });
});
