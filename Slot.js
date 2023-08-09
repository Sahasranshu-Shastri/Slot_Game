const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8,
}

const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
}
//Depositing money
const deposit = () => {
    while (true) {
        const DepositAmnt = prompt("Enter the amount you want to deposit: ");
        const amnt = parseFloat(DepositAmnt);

        if (isNaN(amnt) || amnt <= 0) {
            console.log("ERROR: INVALID \n ");
        }
        else {
            return amnt;
        }
    }
}

//Determining the number of lines to bet on
const Lines = () => {
    while (true) {
        const Lines = prompt("Enter the number of lines to bet on: ");
        const LinesInput = parseFloat(Lines);
        if (isNaN(LinesInput) || LinesInput < 1 || LinesInput > 3) {
            console.log("ERROR: INVALID ")
        }
        else {
            return LinesInput;
        }
    }
}

//Collecting a bet amount
const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log("Invalid bet, try again.");
        } else {
            return numberBet;
        }
    }
}

//Spinning the Slot machine
const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
}

//Getting the winnings
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }

    return winnings;
}
const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
};

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
};
const game = () => {
    let balance = deposit();

    while (true) {
        console.log("You have a balance of $" + balance);
        const numberOfLines = Lines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * Lines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("You won, $" + winnings.toString());

        if (balance <= 0) {
            console.log("You ran out of money!");
            break;
        }

        const playAgain = prompt("Do you want to play again (y/n)? ");

        if (playAgain != "y") break;
    }
};

game();
