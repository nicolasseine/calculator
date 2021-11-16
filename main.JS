// Initialize a few global variables:
let on = false;
let mode;
let displayedNumberArray = [];
let operator = null;
let firstNumber = null;
let secondNumber = null;
let isDecimal = false;
let isNegative = false;
let stored = "0";

const display = document.getElementById("display");
display.textContent = "0";
display.style.opacity = "0";

// Switches the calculator On :
if (on === false) {
    document.getElementById("on").addEventListener('click', function () {
        on = true;
        clear();
        display.style.opacity = "1";
    });
}

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

// Updates the screen with a blinking effect
function updateDisplay(output) {
    display.style.opacity = "0";
    setTimeout(() => {
        display.textContent = output;
        display.style.opacity = "1";
    }, 10);
}


// Compute and display numbers when inputted

if (on = true) {

    document.getElementById("numbers-buttons-container").addEventListener('click', e => {
        if (e.target.classList.contains("number-button"))
            computeNumber(e.target.id);
    });

    //Main function to compute entered number. Switches "mode" in order to enables
    // correct chaining behaviour
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

    // Limit input to 9 digits, which is the maximum size of the screen
    function inputNumber(button) {
        if (displayedNumberArray.length < 9) {
            displayedNumberArray.push(button);
            display.textContent = displayedNumberArray.join("");
        }
    }


    // Mode: input operator

    document.getElementById("operators-buttons-container").
    addEventListener('click', e => {
        if (e.target.classList.contains("operator-button")) selectOperator(e.target.id);
    });

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

    // Main calculation function, also called when equal is pressed
    function operate(a, b, operator) {

        const add = (a, b) => (a + b);
        const substract = (a, b) => (a - b);
        const multiply = (a, b) => (a * b);
        const divide = (a, b) => b === 0 ? "Error" : (a / b);

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

    // Slice the  result to fit the 9 digits screen
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



    // Memory buttons

    document.getElementById("mem+").addEventListener('click', memPlus);

    function memPlus() {
        stored = display.textContent;
    };

    document.getElementById("memcall").addEventListener('click', memCall);

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

    // Function for the equal button: computes the result or chains calculation, depending on the "mode"
    document.getElementById("equal").addEventListener('click', pressequal);


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

    // Toggle negative number

    document.getElementById("negative").addEventListener('click', toggleNegative);

    function toggleNegative() {
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
    };

    // Toggle decimal
    document.getElementById("decimal").addEventListener('click', toggleDecimal);

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
    document.getElementById("backspace").addEventListener('click', backspace);

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

    // document.getElementById("clear").addEventListener('click', clear);


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
            buttonEffect("on");
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


}

let idle = function () {
    let time;
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeydown = resetTimer;

    function powerOff() {
        on = false;
        display.style.opacity = "0";
    }

    function resetTimer() {
        clearTimeout(time);
        time = setTimeout(powerOff, 60000)
    }
};
idle();