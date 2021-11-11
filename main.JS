/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable indent */
// Basic operation functions
const add = (a, b) => (a + b);
const substract = (a, b) => (a - b);
const multiply = (a, b) => (a * b);
const divide = (a, b) => (a / b);


// eslint-disable-next-line require-jsdoc
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


// Inputting numbers when pressing buttons
const numberButtons = document.getElementById("numbers-buttons-container");
const display = document.getElementById("display");
let displayedNumberArray = [];
let displayedNumber = null;

function computeNumber(button) {
    if (!allowModifiers) resetModifiers(true);
    displayedNumberArray.push(button.id);
    display.textContent = displayedNumberArray.join("");
}

numberButtons.addEventListener('click', e => {
    if (e.target.nodeName === "BUTTON") computeNumber(e.target);
});

// Clicking an operator
const operatorButtons = document.getElementById("operators-buttons-container");
let operator = null;
let previousNumber = 0;
let allowModifiers = true;


function selectOperator(button) {
    if (previousEqual) {
        previousNumber = previousEqual;
        previousEqual = null;
    }

    switch (operator) {
        case null:
            operator = button.id;
            previousNumber = (displayedNumberArray.length === 0) ?
                previousNumber : +displayedNumberArray.join("");
            display.textContent = previousNumber;
            resetModifiers(true);
            break;

        default:
            displayedNumber = +displayedNumberArray.join("");
            previousNumber = operate(previousNumber,
                displayedNumber, operator);
            operator = button.id;
            display.textContent = previousNumber;
            resetModifiers(false);
            break;

    }
}


operatorButtons.addEventListener('click', e => {
    if (e.target.nodeName === "BUTTON") selectOperator(e.target);
});
// clicking "equal"
const equalButton = document.getElementById("equal");
let previousEqual = null;
let previousOperator = null;

function pressequal() {
    switch (!!previousEqual) {
        case true:
            previousEqual = operate(previousNumber, previousEqual,
                previousOperator);
            display.textContent = previousEqual;
            break;

        default:
            displayedNumber = +displayedNumberArray.join("");
            previousEqual = operate(previousNumber, displayedNumber, operator);
            display.textContent = previousEqual;
            previousNumber = displayedNumber;
            previousOperator = operator;
            operator = null;
            break;
    }
    resetModifiers(false);
}
equalButton.addEventListener('click', pressequal);

// Toggle negative number

let isNegative = false;

function toggleNegative() {
    if (allowModifiers === true) {
        isNegative = (isNegative === true) ? false : true;

        switch (isNegative) {
            case true:
                displayedNumberArray.unshift("-");
                display.textContent = displayedNumberArray.join("");
                break;

            default:
                displayedNumberArray.shift();
                display.textContent = displayedNumberArray.join("");
                break;
        }
    } else return;
}

const negativeButton = document.getElementById("negative");
negativeButton.addEventListener('click', e => toggleNegative());

// Toggle decimal

let isDecimal = false;

function toggleDecimal() {
    if (allowModifiers === true) {
        switch (displayedNumberArray.length) {

            case (0):
                displayedNumberArray.unshift("0", ".");
                display.textContent = displayedNumberArray.join("");

                break;

            default:
                if (!isDecimal) {
                    displayedNumberArray.push(".");
                    display.textContent = displayedNumberArray.join("");
                    isDecimal = true;
                } else return;
        }
    }
}

const decimalButton = document.getElementById("decimal");
decimalButton.addEventListener('click', e => toggleDecimal());


function resetModifiers(bool) {
    allowModifiers = (bool === true) ? true : false;
    isNegative = false;
    isDecimal = false;
    displayedNumberArray = [];
}