const transferFunction = function (
  accounts,
  amount,
  receiverAccount,
  currentAccount,
  timer
) {
  const receiverAcc = accounts.find((acc) => acc.username === receiverAccount);

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(+amount);
    currentAccount.balance = currentAccount.balance - amount;
    receiverAcc.balance = receiverAcc.balance + +amount;
    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    clearInterval(timer);
  }
};
module.exports = transferFunction;
