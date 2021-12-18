// This is based on https://www.manage-student-loan-balance.service.gov.uk/ors/account-overview/secured/understand-balance-undergraduatePlan2
// and https://www.manage-student-loan-balance.service.gov.uk/ors/account-overview/secured/understand-interest
// This calculator starts from the begining of the existing year

const prompt = require("prompt-sync")();

const calculateYearsToRepay = (salary, loan, age, interest) => {
  const monthsRemaining = (40 - age) * 12;
  const repaymentThreshold = 27295;
  const repaymentPercentage = 0.09;
  const toPay = ((salary - repaymentThreshold) * repaymentPercentage) / 12;
  const year = new Date().getFullYear();

  let updatedLoanRemaining = loan;
  let totalPaid = 0;
  let exitedMonth = 0;
  let currentYear = 0;
  for (let i = 0; i < monthsRemaining; i++) {
    if (updatedLoanRemaining <= 0) {
      exitedMonth = i / 12;
      break;
    }

    if (updatedLoanRemaining < toPay) {
      totalPaid += updatedLoanRemaining;
      updatedLoanRemaining = 0;
    } else {
      totalPaid += toPay;
      updatedLoanRemaining -= toPay;
    }
    if (i % 12 === 0 && i !== 0) {
      updatedLoanRemaining = (updatedLoanRemaining * (100 + interest)) / 100;
      currentYear++;
      console.log(
        "You would have paid a total of £ " +
          totalPaid +
          " by year " +
          (year + currentYear) +
          ", Loan Remaining: £ " +
          updatedLoanRemaining.toFixed(2)
      );
    }
  }
  return {
    totalPaid,
    loanRemaining: updatedLoanRemaining,
    finalYear: exitedMonth > 0 ? exitedMonth : monthsRemaining % 12,
    amountPerMonth: toPay,
  };
};

const main = () => {
  const salary = Number(prompt("Please enter your salary: ", 0));
  const currentLoan = Number(
    prompt("Please enter your current student loan balance: ", 10)
  );
  const age = Number(prompt("Please enter your current age: ", 0));
  const interest = Number(
    prompt(
      "Please provide your current interest if known (otherwise press Enter): ",
      salary < 49130 ? 1.5 : 4.1
    )
  );
  if (salary === 0 || currentLoan === 0 || age === 0) {
    return console.log("Please enter valid details");
  }
  const {
    totalPaid = 0.0,
    loanRemaining = 0.0,
    finalYear,
    amountPerMonth,
  } = calculateYearsToRepay(salary, currentLoan, age, interest);

  console.log("You have paid: £", totalPaid.toFixed(2));
  console.log("Remaining Loan: £", loanRemaining.toFixed(2));
  console.log("You would have paid per Month: £", amountPerMonth.toFixed(2));
  console.log(
    "You would have paid per Year: £",
    amountPerMonth.toFixed(2) * 12
  );
  console.log(
    "It would take you " +
      finalYear.toFixed(1) +
      " year(s) to repay the student loan"
  );
};

main();
