/* eslint-disable indent */
/* eslint-disable require-jsdoc */
/* eslint-disable quotes */
// Load-up

let mode = "first";

// Mode : input first or second number
const numberButtons = document.getElementById("numbers-buttons-container");
const display = document.getElementById("display");
let displayedNumberArray = [];

function computeNumber(button) {

    if (mode === "result") {
        clear();
        mode = "first";
    } else if (mode === "blocked") {
        clear();
    } else {
        mode = (operator === null) ? "first" : "second";
    }
    inputNumber(button);
}

function updateDisplay(output) {
    display.style.opacity = "0";
    setTimeout(() => {
        display.textContent = output;
        display.style.opacity = "1";
    }, 10);
}

function inputNumber(button) {
    if (displayedNumberArray.length < 9) {
        displayedNumberArray.push(button);
        display.textContent = displayedNumberArray.join("");
    }
}

numberButtons.addEventListener('click', e => {
    if (e.target.classList.contains("number-button"))
        computeNumber(e.target.id);
});

// Mode: imput operator

const operatorButtons = document.getElementById("operators-buttons-container");
let operator = null;
let firstNumber = null;
let secondNumber = null;

// Memory buttons
let stored = "0";


const memPlusButton = document.getElementById("mem+");
memPlusButton.addEventListener('click', memPlus);

const memCallButton = document.getElementById("memcall");
memCallButton.addEventListener('click', memCall);


function memPlus() {
    stored = display.textContent;
};

function memCall() {
    if (mode === "result") {
        clear();
        mode = "first";
    } else if (mode === "blocked") {
        clear();
    } else {
        mode = (operator === null) ? "first" : "second";
    }
    displayedNumberArray = stored.split("");
    updateDisplay(displayedNumberArray.join(""));
}


function selectOperator(button) {

    switch (mode) {
        case "first":
        case "result":
            mode = "operator";
            break;
        case "second":
            mode = "result";
            break;
    }

    switch (mode) {
        case "operator":
            operator = button;
            firstNumber = (firstNumber || +displayedNumberArray.join(""));
            updateDisplay(firstNumber);

            resetArray();
            break;

        case "result":
            secondNumber = +displayedNumberArray.join("");
            firstNumber = operate(firstNumber, secondNumber, operator);
            computeResultForDisplay(firstNumber);
            mode = "operator";
            operator = button;
            resetArray();

            break;
        case "blocked":
            clear();
            break;

    }

}

function computeResultForDisplay(result) {
    result = result.toString();
    if (+result >= 10 ** 9) {
        updateDisplay(result.slice(0, 8) + "E");
        mode = "blocked";
    } else if (result.length > 9) {
        result = result.slice(0, 8);

        if (result.charAt(result.length - 1) === ".") {
            result = result.slice(0, 8);
        }
        while (result.charAt(result.length - 1) === "0") {
            for (i = 1; i < result.length - 1; i++) {
                if (result.charAt(i) === ".") {
                    result = result.slice(0, result.length - 1);
                }
            }
        }
        updateDisplay(result);
    } else updateDisplay(result);


}


operatorButtons.addEventListener('click', e => {
    if (e.target.classList.contains("operator-button")) selectOperator(e.target.id);
});


//Press equal : compute and display result

// Helpers functions
const add = (a, b) => (a + b);
const substract = (a, b) => (a - b);
const multiply = (a, b) => (a * b);
const divide = (a, b) => b === 0 ? "Error" : (a / b);

function operate(a, b, operator) {
    switch (operator) {
        case "plus":
            return add(a, b);
            break;
        case "minus":
            return substract(a, b);
            break;
        case "multiply":
            return multiply(a, b);
            break;
        case "divide":
            return divide(a, b);
            break;
    }
}


const equalButton = document.getElementById("equal");


function pressequal() {
    switch (mode) {
        case "second":
            mode = "result";
            secondNumber = +displayedNumberArray.join("");
            firstNumber = operate(firstNumber, secondNumber, operator);
            computeResultForDisplay(firstNumber);
            resetArray();

            break;

        case "result":
            firstNumber = operate(firstNumber, secondNumber, operator);
            computeResultForDisplay(firstNumber);
            resetArray();
            break;
        case "blocked":
            clear();
            break;
    }
}
equalButton.addEventListener('click', pressequal);

// Toggle negative number

let isNegative = false;

const negativeButton = document.getElementById("negative");
negativeButton.addEventListener('click', function toggleNegative() {

    switch (mode) {
        case ("first" || "second"):
            isNegative = !isNegative;

            switch (isNegative) {
                case true:
                    displayedNumberArray.unshift("-");
                    updateDisplay(displayedNumberArray.join(""));
                    break;

                case false:
                    displayedNumberArray.shift();
                    break;
            }
            break;
        case "operator":
            mode = "second";
            resetArray();
            isNegative = true;
            displayedNumberArray.unshift("-");
            updateDisplay(displayedNumberArray.join(""));
            break;

        case "result":
            clear();
            mode = "first";
            isNegative = true;
            displayedNumberArray.unshift("-");
            updateDisplay(displayedNumberArray.join(""));
    }
});

// Toggle decimal

let isDecimal = false;

const decimalButton = document.getElementById("decimal");
decimalButton.addEventListener('click', toggleDecimal);

function toggleDecimal() {
    if (mode === "first" || mode === "second") {
        switch (displayedNumberArray.length) {

            case 0:
                displayedNumberArray.unshift("0", ".");
                updateDisplay(displayedNumberArray.join(""));
                break;

            default:
                if (!isDecimal) {
                    displayedNumberArray.push(".");
                    updateDisplay(displayedNumberArray.join(""));
                    isDecimal = true;
                    break;
                } else return;
        }
    }
}

// Clear and backspace
const backspaceButton = document.getElementById("backspace");
backspaceButton.addEventListener('click', backspace);

function backspace() {
    if (mode === "first" || mode === "second") {
        switch (displayedNumberArray.length) {
            case 0:
                break;
            case 1:
                displayedNumberArray = [];
                display.textContent = "0";
                break;

            default:
                displayedNumberArray.pop();
                updateDisplay(displayedNumberArray.join(""));
                break;
        }
    }
}

const clearButton = document.getElementById("clear");
clearButton.addEventListener('click', clear);

function clear() {
    firstNumber = null;
    secondNumber = null;
    operator = null;
    displayedNumberArray.length = 0;
    updateDisplay("0");
    isDecimal = false;
    isNegative = false;
    mode = "first";
};


function resetArray() {
    isNegative = false;
    isDecimal = false;
    displayedNumberArray.length = 0;
}


// Keyboard shortcuts

document.addEventListener("keydown", function (e) {
    const numeric = /["0-9"]/;

    function buttonEffect(id) {
        let activeButton = document.getElementById(id);
        activeButton.classList.add("active-button");
        setTimeout(() => {
            activeButton.classList.remove("active-button")
        }, 100);
    }

    if (e.key === "+") {
        selectOperator("plus");
        buttonEffect("plus");
    }
    if (e.key === "-") {
        selectOperator("minus");
        buttonEffect("minus");
    }
    if (e.key === "/") {
        selectOperator("divide");
        buttonEffect("divide");
    }
    if (e.key === "*") {
        selectOperator("multiply");
        buttonEffect("multiply");
    }
    if (e.key.match(numeric)) {
        computeNumber(e.key);
        buttonEffect(`${e.key}`);
    }
    if (e.key === "Enter") {
        pressequal();
        buttonEffect("equal");
    }
    if (e.key === "Escape") {
        clear();
        buttonEffect("clear");
    }
    if (e.key === "Backspace") {
        backspace();
        buttonEffect("backspace");
    }
    if (e.key === ".") {
        toggleDecimal();
        buttonEffect("decimal");
    }
});

display.addEventListener('DOMCharacterDataModified', blink);

function blink() {
    display.style.opacity = "0";
    setTimeout(() => display.style.opacity = 1, 100);
}

display.textContent = "0";