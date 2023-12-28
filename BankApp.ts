import bankData from "./data.ts";
interface Account {
    owner: string;
    movements: number[];
    interestRate: number;
    pin: number;
    movementsDates: string[];
    currency: string;
    locale: string;
    balance: number;
    username: string
    
}
const accounts = bankData;
// Elements
const labelWelcome = document.querySelector('.welcome') as HTMLElement;
const labelDate = document.querySelector('.date') as HTMLElement;
const labelBalance = document.querySelector('.balance__value') as HTMLElement;
const labelSumIn = document.querySelector('.summary__value--in') as HTMLElement;
const labelSumOut = document.querySelector('.summary__value--out') as HTMLElement;
const labelSumInterest = document.querySelector('.summary__value--interest') as HTMLElement;
const labelTimer = document.querySelector('.timer') as HTMLElement;
const containerApp = document.querySelector('.app') as HTMLElement;
const containerMovements = document.querySelector('.movements') as HTMLElement;
const btnLogin = document.querySelector('.login__btn') as HTMLElement;
const btnTransfer = document.querySelector('.form__btn--transfer') as HTMLElement;
const btnLoan = document.querySelector('.form__btn--loan') as HTMLElement;
const btnClose = document.querySelector('.form__btn--close') as HTMLElement;
const btnSort = document.querySelector('.btn--sort') as HTMLElement;
const inputLoginUsername = document.querySelector('.login__input--user') as HTMLInputElement;
const inputLoginPin = document.querySelector('.login__input--pin') as HTMLInputElement;
const inputTransferTo = document.querySelector('.form__input--to') as HTMLInputElement;
const inputTransferAmount = document.querySelector('.form__input--amount') as HTMLInputElement;
const inputLoanAmount = document.querySelector('.form__input--loan-amount') as HTMLInputElement;
const inputCloseUsername = document.querySelector('.form__input--user') as HTMLInputElement;
const inputClosePin = document.querySelector('.form__input--pin') as HTMLInputElement;

/////////////////////////////////////////////////
// Functions

// Format all the Dates
const formatMovementDate = function (date: Date, locale: string): string {
  const calcDaysPassed = (date1: Date, date2: Date): number =>
    Math.round(Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));

  const daysPassed: number = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

//Currency Formatting by Locale
const formatCurrency = (acc: { locale: string, currency: string }, mov: number): string => {
  return new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(mov);
};

// Display Transactions
const displayMovements = function (acc: Account, sort: boolean = false): void {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov: number, i: number) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedTransactions = formatCurrency(acc, mov);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedTransactions}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// Display Account Balance
const calcDisplayBalance = function (acc: Account) {
  acc.balance = acc.movements.reduce((acc: number, mov: number) => acc + mov, 0);
  labelBalance.textContent = formatCurrency(acc, acc.balance);
};
//Ins, Outs and Interest
const calcDisplaySummary = function (acc: Account) {
  const incomes: number = acc.movements
    .filter((mov: number) => mov > 0)
    .reduce((acc: number, mov: number) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(acc, incomes);

  const out: number = acc.movements
    .filter((mov: number) => mov < 0)
    .reduce((acc: number, mov: number) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(acc, Math.abs(out));

  const interest: number = acc.movements
    .filter((mov: number) => mov > 0)
    .map((deposit: number) => (deposit * acc.interestRate) / 100)
    .filter((int: number, i: number, arr: number[]) => {
      
      return int >= 1;
    })
    .reduce((acc: number, int: number) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(acc, interest);
};
// Creating Usernames
const createUsernames = function (accs: { owner: string, username: string }[]) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((name: string) => name[0])
      .join('');
  });
};
createUsernames(accounts);
//Update Interface
const updateUI = function (acc: Account) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// Timer Function
const startLogOutTimer = function (): number {
  const tick = function (): void {
    const min: string = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec: string = String(time % 60).padStart(2, '0');

    //In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    //When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = '0';
    }

    //Decrease 1s
    time--;
  };

  // Set time to 5 minutes
  let time: number = 150;

  // Call the timer evrry second
  tick();
  const timer: any = setInterval(tick, 1000);

  return timer;
};
///////////////////////////////////////
// Event handlers
let currentAccount:any, timer:number;
// Handling Login
btnLogin.addEventListener('click', function (e: MouseEvent) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc: Account | any) => acc.username === inputLoginUsername.value
  );
  

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = '100';

    // Current Date
    const now: Date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: '2-digit',
      month: 'numeric',
      weekday: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    // Getting the users location
    const locale: string = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

// Handling Transfer Transactions
btnTransfer.addEventListener('click', function (e: Event) {
  e.preventDefault();
  const amount: number = +inputTransferAmount.value;
  const receiverAcc: Account | undefined = accounts.find(
    (acc: Account | any) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});
// Handling Loan Transactions
btnLoan.addEventListener('click', function (e: Event) {
  e.preventDefault();

  const amount: number  = Math.floor(Number((inputLoanAmount.value)));

  if (amount > 0 && currentAccount.movements.some((mov: number) => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);
      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);
  }
  inputLoanAmount.value = '';
});
// Handling Close Account Transactions
btnClose.addEventListener('click', function (e: Event) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index: number = accounts.findIndex(
      (acc: { username: string }) => acc.username === currentAccount.username
    );
    
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = '0';
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

// Sorting Transactions by deposit or withdrawal
let sorted: boolean = false;
btnSort.addEventListener('click', function (e: Event): void {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});